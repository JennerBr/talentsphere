import { Router } from "express";
import multer from "multer";
import { ObjectStorageService } from "../lib/objectStorage.js";
import { db } from "@workspace/db";
import {
  teams,
  positions,
  members,
  teamMembers,
  projects,
  projectStakeholders,
  absenceTypes,
  skillCategories,
  skills,
  memberSkills,
  kudosTypes,
  kudos,
  logTypes,
  actionTypes,
  hobbies,
  hobbyCategories,
  memberHobbies,
  functions,
  memberFunctions,
  memberLinks,
  invitations,
} from "@workspace/db";
import { eq, sql, and, inArray, asc, max, desc, isNull, isNotNull } from "drizzle-orm";
import { parseLink } from "./parse-link.js";
import { getAuth, createClerkClient } from "@clerk/express";

const clerkClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });

// ─── Types ────────────────────────────────────────────────────────────────────

interface TeamEntry {
  teamId: number;
  role: string | null;
  positionId: number | null;
}

interface MemberRecord {
  id: number;
  name: string;
  fullName: string | null;
  seniority: string | null;
  project: string | null;
  turma: string | null;
  skills: string[] | null;
  email: string | null;
  avatar: string | null;
  birthday: string | null;
  contractDate: string | null;
  availableKudos: number | null;
  phone: string | null;
  linkedin: string | null;
}

interface MemberWithTeams {
  member: MemberRecord;
  teamEntries: TeamEntry[];
}

// ─── Core helpers ─────────────────────────────────────────────────────────────

async function resolveMemberWithTeams(clerkUserId: string): Promise<MemberWithTeams | null> {
  const clerkUser = await clerkClient.users.getUser(clerkUserId);
  const email = clerkUser.emailAddresses[0]?.emailAddress;
  if (!email) return null;

  const rows = await db.select().from(members).where(eq(members.email, email));
  const member = rows[0];
  if (!member) return null;

  const teamRows = await db
    .select()
    .from(teamMembers)
    .where(eq(teamMembers.memberId, member.id));

  return {
    member,
    teamEntries: teamRows.map((r) => ({
      teamId: r.teamId,
      role: r.role,
      positionId: r.positionId,
    })),
  };
}

function isManager(member: { role?: string | null }): boolean {
  return !!(member.role && /manager|diretor|director|admin/i.test(member.role));
}

function getRequestedTeamId(req: any): number | null {
  const header = req.headers["x-team-id"];
  if (header && !isNaN(Number(header))) return Number(header);
  return null;
}

function flattenMember(member: MemberRecord, teamEntry: TeamEntry | undefined) {
  return {
    ...member,
    role: teamEntry?.role ?? null,
    positionId: teamEntry?.positionId ?? null,
    organizacaoId: teamEntry?.teamId ?? null,
  };
}

// ─── Middlewares ───────────────────────────────────────────────────────────────

/**
 * requireAuth — only verifies a valid Clerk session.
 * Does NOT validate team membership. Use for public/non-team-scoped routes.
 */
const requireAuth = (req: any, res: any, next: any) => {
  const auth = getAuth(req);
  if (!auth?.userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  req.clerkUserId = auth.userId;
  next();
};

/**
 * requireTeamAuth — validates Clerk session AND that the caller is a member of
 * the team identified by X-Team-Id (falls back to the caller's first team
 * when the header is absent). Populates req.member (with role/positionId for
 * the active team) and req.activeTeamEntry.
 */
const requireTeamAuth = async (req: any, res: any, next: any) => {
  const auth = getAuth(req);
  if (!auth?.userId) return res.status(401).json({ error: "Unauthorized" });

  try {
    const resolved = await resolveMemberWithTeams(auth.userId);
    if (!resolved) {
      return res.status(403).json({ error: "No member record linked to this account" });
    }

    const requestedTeamId = getRequestedTeamId(req);
    const teamEntry = requestedTeamId
      ? resolved.teamEntries.find((t) => t.teamId === requestedTeamId)
      : resolved.teamEntries[0];

    if (!teamEntry) {
      return res.status(403).json({ error: "Not a member of this team" });
    }

    req.clerkUserId = auth.userId;
    req.activeTeamEntry = teamEntry;
    req.member = flattenMember(resolved.member, teamEntry);
    next();
  } catch (e) {
    res.status(500).json({ error: "Authorization check failed" });
  }
};

/**
 * requireManagerTeamAuth — same as requireTeamAuth but also requires the caller
 * to have a manager-level role in the active team.
 */
const requireManagerTeamAuth = async (req: any, res: any, next: any) => {
  await requireTeamAuth(req, res, () => {
    if (!isManager(req.member)) {
      return res.status(403).json({ error: "Forbidden: manager access required" });
    }
    next();
  });
};

/**
 * requireOwnMemberData — validates team membership and that the caller is
 * either accessing their own record or is a manager in the active team.
 * Also verifies the target member (:id) belongs to the active team so
 * managers cannot reach members in other teams.
 */
const requireOwnMemberData = async (req: any, res: any, next: any) => {
  await requireTeamAuth(req, res, async () => {
    const requestedId = Number(req.params.id);
    const activeTeamId: number = req.activeTeamEntry.teamId;

    if (req.member.id !== requestedId) {
      if (!isManager(req.member)) {
        return res.status(403).json({ error: "Forbidden: you can only access your own data" });
      }
      // Manager: verify the target member belongs to the active team
      const tmCheck = await db
        .select()
        .from(teamMembers)
        .where(
          and(
            eq(teamMembers.memberId, requestedId),
            eq(teamMembers.teamId, activeTeamId)
          )
        );
      if (!tmCheck.length) {
        return res.status(403).json({ error: "This member does not belong to your team" });
      }
    }
    next();
  });
};

const appRouter = Router();

// ─── Auth ─────────────────────────────────────────────────────────────────────

appRouter.get("/auth/me", requireAuth, async (req: any, res) => {
  try {
    const resolved = await resolveMemberWithTeams(req.clerkUserId);
    if (!resolved) {
      res.status(404).json({ error: "No member record linked to this account" });
      return;
    }

    const requestedTeamId = getRequestedTeamId(req);
    const teamEntry = requestedTeamId
      ? resolved.teamEntries.find((t) => t.teamId === requestedTeamId)
      : resolved.teamEntries[0];

    const teamDetails =
      resolved.teamEntries.length > 0
        ? await db
            .select({ id: teams.id, name: teams.name, logo: teams.logo })
            .from(teams)
            .where(inArray(teams.id, resolved.teamEntries.map((t) => t.teamId)))
        : [];

    res.json({
      ...flattenMember(resolved.member, teamEntry),
      organizations: teamDetails,
    });
  } catch (e) {
    req.log.error(e);
    res.status(500).json({ error: "Failed to fetch current member" });
  }
});

// ─── Onboarding ───────────────────────────────────────────────────────────────

appRouter.post("/onboarding", requireAuth, async (req: any, res) => {
  try {
    const clerkUser = await clerkClient.users.getUser(req.clerkUserId);
    const email = clerkUser.emailAddresses[0]?.emailAddress;
    if (!email) {
      res.status(400).json({ error: "No email address found for this account" });
      return;
    }

    const existing = await db.select().from(members).where(eq(members.email, email));
    if (existing.length > 0) {
      res.status(409).json({ error: "Member record already exists for this account" });
      return;
    }

    const { orgName, employeeName } = req.body as {
      orgName: string;
      employeeName: string;
    };

    if (!orgName || !employeeName) {
      res.status(400).json({ error: "orgName and employeeName are required" });
      return;
    }

    const result = await db.transaction(async (tx) => {
      const [team] = await tx
        .insert(teams)
        .values({ name: orgName, logo: null, cnpj: null, status: "Ativo" })
        .returning();

      const [mem] = await tx
        .insert(members)
        .values({
          name: employeeName,
          email,
          seniority: null,
          project: null,
          turma: null,
          skills: null,
          avatar: null,
          birthday: null,
          contractDate: null,
          availableKudos: 5,
        })
        .returning();

      await tx.insert(teamMembers).values({
        memberId: mem.id,
        teamId: team.id,
        role: "Admin",
        positionId: null,
      });

      return {
        organization: team,
        member: { ...mem, role: "Admin", organizacaoId: team.id, positionId: null },
      };
    });

    res.status(201).json(result);
  } catch (e) {
    req.log.error(e);
    res.status(500).json({ error: "Failed to complete onboarding" });
  }
});

// ─── Teams ────────────────────────────────────────────────────────────────────
// GET is intentionally public: needed before a session is established.

appRouter.get("/teams", async (req, res) => {
  try {
    const rows = await db.select().from(teams).orderBy(teams.id);
    res.json(rows);
  } catch (e) {
    req.log.error(e);
    res.status(500).json({ error: "Failed to fetch teams" });
  }
});

appRouter.post("/teams", requireManagerTeamAuth, async (req, res) => {
  try {
    const { name, logo, cnpj, status } = req.body as {
      name: string;
      logo?: string;
      cnpj?: string;
      status?: string;
    };
    if (!name) {
      res.status(400).json({ error: "name is required" });
      return;
    }
    const [row] = await db
      .insert(teams)
      .values({ name, logo: logo ?? null, cnpj: cnpj ?? null, status: status ?? "Ativo" })
      .returning();
    res.status(201).json(row);
  } catch (e) {
    req.log.error(e);
    res.status(500).json({ error: "Failed to create team" });
  }
});

appRouter.put("/teams/:id", requireManagerTeamAuth, async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { name, logo, cnpj, status, allowedDomains } = req.body as {
      name?: string;
      logo?: string;
      cnpj?: string;
      status?: string;
      allowedDomains?: string[] | null;
    };
    const [row] = await db
      .update(teams)
      .set({
        ...(name !== undefined && { name }),
        ...(logo !== undefined && { logo }),
        ...(cnpj !== undefined && { cnpj }),
        ...(status !== undefined && { status }),
        ...(allowedDomains !== undefined && { allowedDomains }),
      })
      .where(eq(teams.id, id))
      .returning();
    if (!row) {
      res.status(404).json({ error: "Not found" });
      return;
    }
    res.json(row);
  } catch (e) {
    req.log.error(e);
    res.status(500).json({ error: "Failed to update team" });
  }
});

appRouter.delete("/teams/:id", requireManagerTeamAuth, async (req, res) => {
  try {
    const id = Number(req.params.id);
    await db.delete(teamMembers).where(eq(teamMembers.teamId, id));
    await db.delete(teams).where(eq(teams.id, id));
    res.status(204).end();
  } catch (e) {
    req.log.error(e);
    res.status(500).json({ error: "Failed to delete team" });
  }
});

// ─── Positions ────────────────────────────────────────────────────────────────
// All position access is scoped to the caller's validated active team.

appRouter.get("/positions", requireTeamAuth, async (req: any, res) => {
  try {
    const activeTeamId: number = req.activeTeamEntry.teamId;
    const rows = await db
      .select()
      .from(positions)
      .where(eq(positions.organizacaoId, activeTeamId))
      .orderBy(positions.id);
    res.json(rows);
  } catch (e) {
    req.log.error(e);
    res.status(500).json({ error: "Failed to fetch positions" });
  }
});

appRouter.post("/positions", requireManagerTeamAuth, async (req: any, res) => {
  try {
    const activeTeamId: number = req.activeTeamEntry.teamId;
    const { name, chairs, allocated, parentId, createdBy, createdAt } = req.body as {
      name: string;
      chairs?: number;
      allocated?: number;
      parentId?: number | null;
      createdBy?: string;
      createdAt?: string;
    };
    if (!name) {
      res.status(400).json({ error: "name is required" });
      return;
    }
    const [row] = await db
      .insert(positions)
      .values({
        name,
        chairs: chairs ?? 1,
        allocated: allocated ?? 0,
        parentId: parentId ?? null,
        organizacaoId: activeTeamId,
        createdBy: createdBy ?? null,
        createdAt: createdAt ?? null,
      })
      .returning();
    res.status(201).json(row);
  } catch (e) {
    req.log.error(e);
    res.status(500).json({ error: "Failed to create position" });
  }
});

appRouter.put("/positions/:id", requireManagerTeamAuth, async (req: any, res) => {
  try {
    const id = Number(req.params.id);
    const activeTeamId: number = req.activeTeamEntry.teamId;

    const existing = await db
      .select()
      .from(positions)
      .where(and(eq(positions.id, id), eq(positions.organizacaoId, activeTeamId)));
    if (!existing.length) {
      res.status(404).json({ error: "Not found in your team" });
      return;
    }

    const { name, chairs, allocated, parentId, createdBy, createdAt } = req.body as {
      name?: string;
      chairs?: number;
      allocated?: number;
      parentId?: number | null;
      createdBy?: string;
      createdAt?: string;
    };
    const [row] = await db
      .update(positions)
      .set({
        ...(name !== undefined && { name }),
        ...(chairs !== undefined && { chairs }),
        ...(allocated !== undefined && { allocated }),
        ...(parentId !== undefined && { parentId }),
        ...(createdBy !== undefined && { createdBy }),
        ...(createdAt !== undefined && { createdAt }),
      })
      .where(eq(positions.id, id))
      .returning();
    res.json(row);
  } catch (e) {
    req.log.error(e);
    res.status(500).json({ error: "Failed to update position" });
  }
});

appRouter.delete("/positions/:id", requireManagerTeamAuth, async (req: any, res) => {
  try {
    const id = Number(req.params.id);
    const activeTeamId: number = req.activeTeamEntry.teamId;

    const existing = await db
      .select()
      .from(positions)
      .where(and(eq(positions.id, id), eq(positions.organizacaoId, activeTeamId)));
    if (!existing.length) {
      res.status(404).json({ error: "Not found in your team" });
      return;
    }

    await db.delete(positions).where(eq(positions.id, id));
    res.status(204).end();
  } catch (e) {
    req.log.error(e);
    res.status(500).json({ error: "Failed to delete position" });
  }
});

// ─── Members ──────────────────────────────────────────────────────────────────

appRouter.get("/members", requireTeamAuth, async (req: any, res) => {
  try {
    const activeTeamId: number = req.activeTeamEntry.teamId;

    const teamMemberRows = await db
      .select({
        memberId: teamMembers.memberId,
        role: teamMembers.role,
        positionId: teamMembers.positionId,
      })
      .from(teamMembers)
      .where(eq(teamMembers.teamId, activeTeamId));

    if (isManager(req.member)) {
      const memberIds = teamMemberRows.map((r) => r.memberId);
      if (memberIds.length === 0) {
        res.json([]);
        return;
      }
      const memberRows = await db
        .select()
        .from(members)
        .where(inArray(members.id, memberIds))
        .orderBy(members.id);

      const result = memberRows.map((m) => {
        const tm = teamMemberRows.find((r) => r.memberId === m.id);
        return { ...m, role: tm?.role ?? null, positionId: tm?.positionId ?? null, organizacaoId: activeTeamId };
      });
      res.json(result);
      return;
    }

    const myTm = teamMemberRows.find((r) => r.memberId === req.member.id);
    if (!myTm) {
      res.json([]);
      return;
    }

    res.json([{
      ...req.member,
      role: myTm.role,
      positionId: myTm.positionId,
      organizacaoId: activeTeamId,
    }]);
  } catch (e) {
    req.log.error(e);
    res.status(500).json({ error: "Failed to fetch members" });
  }
});

appRouter.get("/members/:id", requireOwnMemberData, async (req: any, res) => {
  try {
    const id = Number(req.params.id);
    const activeTeamId: number = req.activeTeamEntry.teamId;

    const rows = await db.select().from(members).where(eq(members.id, id));
    if (!rows.length) {
      res.status(404).json({ error: "Not found" });
      return;
    }

    const tmRows = await db
      .select()
      .from(teamMembers)
      .where(and(eq(teamMembers.memberId, id), eq(teamMembers.teamId, activeTeamId)));

    const tm = tmRows[0];
    res.json({
      ...rows[0],
      role: tm?.role ?? null,
      positionId: tm?.positionId ?? null,
      organizacaoId: tm?.teamId ?? null,
    });
  } catch (e) {
    req.log.error(e);
    res.status(500).json({ error: "Failed to fetch member" });
  }
});

appRouter.post("/members", requireManagerTeamAuth, async (req: any, res) => {
  try {
    const activeTeamId: number = req.activeTeamEntry.teamId;
    const body = req.body as {
      name: string;
      role?: string;
      seniority?: string;
      project?: string;
      turma?: string;
      skills?: string[];
      email?: string;
      avatar?: string;
      birthday?: string;
      contractDate?: string;
      availableKudos?: number;
      positionId?: number | null;
    };
    if (!body.name) {
      res.status(400).json({ error: "name is required" });
      return;
    }

    const result = await db.transaction(async (tx) => {
      const [row] = await tx
        .insert(members)
        .values({
          name: body.name,
          seniority: body.seniority ?? null,
          project: body.project ?? null,
          turma: body.turma ?? null,
          skills: body.skills ?? null,
          email: body.email ?? null,
          avatar: body.avatar ?? null,
          birthday: body.birthday ?? null,
          contractDate: body.contractDate ?? null,
          availableKudos: body.availableKudos ?? 5,
        })
        .returning();

      await tx.insert(teamMembers).values({
        memberId: row.id,
        teamId: activeTeamId,
        role: body.role ?? null,
        positionId: body.positionId ?? null,
      });

      return { ...row, role: body.role ?? null, positionId: body.positionId ?? null, organizacaoId: activeTeamId };
    });

    res.status(201).json(result);
  } catch (e) {
    req.log.error(e);
    res.status(500).json({ error: "Failed to create member" });
  }
});

appRouter.put("/members/:id", requireOwnMemberData, async (req: any, res) => {
  try {
    const id = Number(req.params.id);
    const activeTeamId: number = req.activeTeamEntry.teamId;
    const isSelf = req.member.id === id;
    const managerAccess = isManager(req.member);

    const body = req.body as {
      name?: string;
      fullName?: string | null;
      role?: string;
      seniority?: string;
      project?: string;
      turma?: string;
      skills?: string[];
      email?: string;
      avatar?: string;
      birthday?: string;
      contractDate?: string;
      availableKudos?: number;
      positionId?: number | null;
      phone?: string;
      linkedin?: string;
      teamsUrl?: string | null;
      slackUrl?: string | null;
      webexUrl?: string | null;
    };

    for (const urlField of ["teamsUrl", "slackUrl", "webexUrl"] as const) {
      const val = body[urlField];
      if (val !== undefined && val !== null) {
        try {
          const parsed = new URL(val);
          if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
            res.status(400).json({ error: `${urlField} must be an http or https URL` });
            return;
          }
        } catch {
          res.status(400).json({ error: `${urlField} must be a valid URL` });
          return;
        }
      }
    }

    const memberUpdates: Record<string, unknown> = {};
    for (const key of ["name", "fullName", "seniority", "project", "turma", "skills", "email", "avatar", "birthday", "contractDate", "availableKudos", "phone", "linkedin", "teamsUrl", "slackUrl", "webexUrl"] as const) {
      if (body[key] !== undefined) memberUpdates[key] = body[key];
    }

    const result = await db.transaction(async (tx) => {
      let row;
      if (Object.keys(memberUpdates).length > 0) {
        const [updated] = await tx.update(members).set(memberUpdates).where(eq(members.id, id)).returning();
        row = updated;
      } else {
        const [existing] = await tx.select().from(members).where(eq(members.id, id));
        row = existing;
      }
      if (!row) return null;

      // Only managers can change role/positionId
      if (managerAccess && (body.role !== undefined || body.positionId !== undefined)) {
        const tmUpdates: Record<string, unknown> = {};
        if (body.role !== undefined) tmUpdates.role = body.role;
        if (body.positionId !== undefined) tmUpdates.positionId = body.positionId;
        await tx
          .update(teamMembers)
          .set(tmUpdates)
          .where(and(eq(teamMembers.memberId, id), eq(teamMembers.teamId, activeTeamId)));
      }

      const [tm] = await tx
        .select()
        .from(teamMembers)
        .where(and(eq(teamMembers.memberId, id), eq(teamMembers.teamId, activeTeamId)));

      return { ...row, role: tm?.role ?? null, positionId: tm?.positionId ?? null, organizacaoId: tm?.teamId ?? null };
    });

    if (!result) {
      res.status(404).json({ error: "Not found" });
      return;
    }
    res.json(result);
  } catch (e) {
    req.log.error(e);
    res.status(500).json({ error: "Failed to update member" });
  }
});

// ─── Member avatar upload ─────────────────────────────────────────────────────

const ALLOWED_AVATAR_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_AVATAR_SIZE = 5 * 1024 * 1024; // 5 MB
const objectStorage = new ObjectStorageService();

const avatarUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_AVATAR_SIZE },
  fileFilter: (_req, file, cb) => {
    if (ALLOWED_AVATAR_TYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Allowed: jpg, png, webp"));
    }
  },
});

/**
 * POST /members/:id/avatar
 * Receives multipart/form-data with field "avatar" (image file).
 * Validates type (jpg/png/webp) and size (max 5 MB) server-side,
 * uploads to Object Storage, and atomically updates members.avatar.
 * Returns: { avatarUrl: string }
 */
appRouter.post(
  "/members/:id/avatar",
  requireOwnMemberData,
  (req: any, res: any, next: any) => {
    avatarUpload.single("avatar")(req, res, (err: any) => {
      if (err instanceof multer.MulterError && err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({ error: "File too large. Maximum size is 5 MB" });
      }
      if (err) {
        return res.status(400).json({ error: err.message ?? "Invalid file" });
      }
      next();
    });
  },
  async (req: any, res: any) => {
    try {
      const file = req.file as Express.Multer.File | undefined;
      if (!file) {
        res.status(400).json({ error: "No file provided. Send field 'avatar' as multipart/form-data" });
        return;
      }

      const id = Number(req.params.id);

      const objectPath = await objectStorage.uploadBuffer(file.buffer, file.mimetype);
      const avatarUrl = `/api/storage${objectPath}`;

      const [updated] = await db
        .update(members)
        .set({ avatar: avatarUrl })
        .where(eq(members.id, id))
        .returning();

      if (!updated) {
        res.status(404).json({ error: "Member not found" });
        return;
      }

      res.json({ avatarUrl });
    } catch (e) {
      req.log.error(e);
      res.status(500).json({ error: "Failed to upload avatar" });
    }
  }
);

appRouter.delete("/members/:id", requireManagerTeamAuth, async (req: any, res) => {
  try {
    const id = Number(req.params.id);
    const activeTeamId: number = req.activeTeamEntry.teamId;

    const tmCheck = await db
      .select()
      .from(teamMembers)
      .where(and(eq(teamMembers.memberId, id), eq(teamMembers.teamId, activeTeamId)));
    if (!tmCheck.length) {
      res.status(403).json({ error: "This member does not belong to your team" });
      return;
    }

    // Unlink from active team only
    await db
      .delete(teamMembers)
      .where(and(eq(teamMembers.memberId, id), eq(teamMembers.teamId, activeTeamId)));

    // Hard-delete the global profile only if the member has no remaining team memberships
    const remaining = await db
      .select()
      .from(teamMembers)
      .where(eq(teamMembers.memberId, id));
    if (remaining.length === 0) {
      await db.delete(members).where(eq(members.id, id));
    }

    res.status(204).end();
  } catch (e) {
    req.log.error(e);
    res.status(500).json({ error: "Failed to delete member" });
  }
});

// ─── Link existing member to team by email ────────────────────────────────────
// Admins can add an existing member (from another team) to their team by email.

appRouter.post("/members/link-by-email", requireManagerTeamAuth, async (req: any, res) => {
  try {
    const activeTeamId: number = req.activeTeamEntry.teamId;
    const { email, role, positionId } = req.body as {
      email: string;
      role?: string;
      positionId?: number | null;
    };

    if (!email) {
      res.status(400).json({ error: "email is required" });
      return;
    }

    const memberRows = await db.select().from(members).where(eq(members.email, email));
    if (!memberRows.length) {
      res.status(404).json({ error: "No member found with this email address" });
      return;
    }

    const member = memberRows[0];

    const [row] = await db
      .insert(teamMembers)
      .values({ memberId: member.id, teamId: activeTeamId, role: role ?? null, positionId: positionId ?? null })
      .onConflictDoUpdate({
        target: [teamMembers.memberId, teamMembers.teamId],
        set: { role: role ?? null, positionId: positionId ?? null },
      })
      .returning();

    res.status(201).json({ ...member, role: row.role, positionId: row.positionId, organizacaoId: row.teamId });
  } catch (e) {
    req.log.error(e);
    res.status(500).json({ error: "Failed to link member to team" });
  }
});

// ─── Add existing member to team by ID ───────────────────────────────────────

appRouter.post("/members/:id/teams", requireManagerTeamAuth, async (req: any, res) => {
  try {
    const memberId = Number(req.params.id);
    const activeTeamId: number = req.activeTeamEntry.teamId;
    const { role, positionId } = req.body as {
      role?: string;
      positionId?: number | null;
    };

    const memberRows = await db.select().from(members).where(eq(members.id, memberId));
    if (!memberRows.length) {
      res.status(404).json({ error: "Member not found" });
      return;
    }

    const [row] = await db
      .insert(teamMembers)
      .values({ memberId, teamId: activeTeamId, role: role ?? null, positionId: positionId ?? null })
      .onConflictDoUpdate({
        target: [teamMembers.memberId, teamMembers.teamId],
        set: { role: role ?? null, positionId: positionId ?? null },
      })
      .returning();

    res.status(201).json(row);
  } catch (e) {
    req.log.error(e);
    res.status(500).json({ error: "Failed to add member to team" });
  }
});

// ─── Remove member from a specific team (junction-only delete) ────────────────

appRouter.delete("/members/:id/teams/:teamId", requireManagerTeamAuth, async (req: any, res) => {
  try {
    const memberId = Number(req.params.id);
    const teamId = Number(req.params.teamId);
    const activeTeamId: number = req.activeTeamEntry.teamId;

    if (teamId !== activeTeamId) {
      res.status(403).json({ error: "You can only remove members from your own team" });
      return;
    }

    const tmCheck = await db
      .select()
      .from(teamMembers)
      .where(and(eq(teamMembers.memberId, memberId), eq(teamMembers.teamId, teamId)));
    if (!tmCheck.length) {
      res.status(404).json({ error: "This member does not belong to this team" });
      return;
    }

    await db
      .delete(teamMembers)
      .where(and(eq(teamMembers.memberId, memberId), eq(teamMembers.teamId, teamId)));

    res.status(204).end();
  } catch (e) {
    req.log.error(e);
    res.status(500).json({ error: "Failed to remove member from team" });
  }
});

// ─── Hobbies catalog ─────────────────────────────────────────────────────────

appRouter.get("/hobbies", requireTeamAuth, async (req: any, res) => {
  try {
    const rows = await db
      .select({
        id: hobbies.id,
        name: hobbies.name,
        categoryId: hobbies.categoryId,
        categoryName: hobbyCategories.name,
        icon: hobbies.icon,
      })
      .from(hobbies)
      .leftJoin(hobbyCategories, eq(hobbies.categoryId, hobbyCategories.id))
      .orderBy(hobbies.name);
    res.json(rows);
  } catch (e) {
    req.log.error(e);
    res.status(500).json({ error: "Failed to fetch hobbies" });
  }
});

appRouter.post("/hobbies", requireTeamAuth, async (req: any, res) => {
  try {
    const { name, categoryId, icon } = req.body as { name: string; categoryId?: number | null; icon?: string | null };
    if (!name) {
      res.status(400).json({ error: "name is required" });
      return;
    }
    const [row] = await db
      .insert(hobbies)
      .values({ name, categoryId: categoryId ?? null, icon: icon ?? null })
      .returning();
    const categoryRow = row.categoryId
      ? await db.select().from(hobbyCategories).where(eq(hobbyCategories.id, row.categoryId)).then((r) => r[0])
      : null;
    res.status(201).json({ ...row, categoryName: categoryRow?.name ?? null });
  } catch (e) {
    req.log.error(e);
    res.status(500).json({ error: "Failed to create hobby" });
  }
});

appRouter.put("/hobbies/:id", requireTeamAuth, async (req: any, res) => {
  try {
    const id = Number(req.params.id);
    const { name, categoryId, icon } = req.body as { name: string; categoryId?: number | null; icon?: string | null };
    if (!name) {
      res.status(400).json({ error: "name is required" });
      return;
    }
    const [row] = await db
      .update(hobbies)
      .set({ name, categoryId: categoryId ?? null, icon: icon ?? null })
      .where(eq(hobbies.id, id))
      .returning();
    if (!row) { res.status(404).json({ error: "Not found" }); return; }
    const categoryRow = row.categoryId
      ? await db.select().from(hobbyCategories).where(eq(hobbyCategories.id, row.categoryId)).then((r) => r[0])
      : null;
    res.json({ ...row, categoryName: categoryRow?.name ?? null });
  } catch (e) {
    req.log.error(e);
    res.status(500).json({ error: "Failed to update hobby" });
  }
});

appRouter.delete("/hobbies/:id", requireTeamAuth, async (req: any, res) => {
  try {
    const id = Number(req.params.id);
    await db.delete(memberHobbies).where(eq(memberHobbies.hobbyId, id));
    await db.delete(hobbies).where(eq(hobbies.id, id));
    res.status(204).end();
  } catch (e) {
    req.log.error(e);
    res.status(500).json({ error: "Failed to delete hobby" });
  }
});

// ─── Hobby categories ─────────────────────────────────────────────────────────

appRouter.get("/hobby-categories", requireTeamAuth, async (req: any, res) => {
  try {
    const rows = await db.select().from(hobbyCategories).orderBy(hobbyCategories.name);
    res.json(rows);
  } catch (e) {
    req.log.error(e);
    res.status(500).json({ error: "Failed to fetch hobby categories" });
  }
});

appRouter.post("/hobby-categories", requireTeamAuth, async (req: any, res) => {
  try {
    const { name } = req.body as { name: string };
    if (!name) {
      res.status(400).json({ error: "name is required" });
      return;
    }
    const [row] = await db.insert(hobbyCategories).values({ name }).returning();
    res.status(201).json(row);
  } catch (e) {
    req.log.error(e);
    res.status(500).json({ error: "Failed to create hobby category" });
  }
});

appRouter.put("/hobby-categories/:id", requireTeamAuth, async (req: any, res) => {
  try {
    const id = Number(req.params.id);
    const { name } = req.body as { name: string };
    if (!name) { res.status(400).json({ error: "name is required" }); return; }
    const [row] = await db.update(hobbyCategories).set({ name }).where(eq(hobbyCategories.id, id)).returning();
    if (!row) { res.status(404).json({ error: "Not found" }); return; }
    res.json(row);
  } catch (e) {
    req.log.error(e);
    res.status(500).json({ error: "Failed to update hobby category" });
  }
});

appRouter.delete("/hobby-categories/:id", requireTeamAuth, async (req: any, res) => {
  try {
    const id = Number(req.params.id);
    await db.delete(hobbyCategories).where(eq(hobbyCategories.id, id));
    res.status(204).end();
  } catch (e) {
    req.log.error(e);
    res.status(500).json({ error: "Failed to delete hobby category" });
  }
});

appRouter.get("/members/:id/hobbies", requireOwnMemberData, async (req, res) => {
  try {
    const id = Number(req.params.id);

    const catalogRows = await db
      .select({
        id: hobbies.id,
        name: hobbies.name,
        icon: hobbies.icon,
        categoryId: hobbies.categoryId,
        customName: sql<null>`NULL`,
      })
      .from(memberHobbies)
      .innerJoin(hobbies, eq(memberHobbies.hobbyId, hobbies.id))
      .where(and(eq(memberHobbies.memberId, id), isNotNull(memberHobbies.hobbyId)))
      .orderBy(hobbies.name);

    const customRows = await db
      .select({
        id: sql<null>`NULL`,
        name: memberHobbies.customName,
        icon: sql<null>`NULL`,
        categoryId: sql<null>`NULL`,
        customName: memberHobbies.customName,
      })
      .from(memberHobbies)
      .where(and(eq(memberHobbies.memberId, id), isNull(memberHobbies.hobbyId)))
      .orderBy(memberHobbies.customName);

    res.json([...catalogRows, ...customRows]);
  } catch (e) {
    req.log.error(e);
    res.status(500).json({ error: "Failed to fetch member hobbies" });
  }
});

appRouter.put("/members/:id/hobbies", requireOwnMemberData, async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { ids, customNames } = req.body as { ids: number[]; customNames: string[] };

    await db.transaction(async (tx) => {
      await tx.delete(memberHobbies).where(eq(memberHobbies.memberId, id));
      const catalogEntries = (ids ?? []).map((hobbyId) => ({ memberId: id, hobbyId, customName: null as string | null }));
      const customEntries = (customNames ?? [])
        .map(n => n.trim())
        .filter(Boolean)
        .map((customName) => ({ memberId: id, hobbyId: null as number | null, customName }));
      const allEntries = [...catalogEntries, ...customEntries];
      if (allEntries.length > 0) {
        await tx.insert(memberHobbies).values(allEntries);
      }
    });

    const catalogRows = await db
      .select({
        id: hobbies.id,
        name: hobbies.name,
        icon: hobbies.icon,
        categoryId: hobbies.categoryId,
        customName: sql<null>`NULL`,
      })
      .from(memberHobbies)
      .innerJoin(hobbies, eq(memberHobbies.hobbyId, hobbies.id))
      .where(and(eq(memberHobbies.memberId, id), isNotNull(memberHobbies.hobbyId)))
      .orderBy(hobbies.name);

    const customRows = await db
      .select({
        id: sql<null>`NULL`,
        name: memberHobbies.customName,
        icon: sql<null>`NULL`,
        categoryId: sql<null>`NULL`,
        customName: memberHobbies.customName,
      })
      .from(memberHobbies)
      .where(and(eq(memberHobbies.memberId, id), isNull(memberHobbies.hobbyId)))
      .orderBy(memberHobbies.customName);

    res.json([...catalogRows, ...customRows]);
  } catch (e) {
    req.log.error(e);
    res.status(500).json({ error: "Failed to update member hobbies" });
  }
});

// ─── Functions catalog ────────────────────────────────────────────────────────

appRouter.get("/functions", requireTeamAuth, async (req: any, res) => {
  try {
    const rows = await db.select().from(functions).orderBy(functions.name);
    res.json(rows);
  } catch (e) {
    req.log.error(e);
    res.status(500).json({ error: "Failed to fetch functions" });
  }
});

appRouter.get("/members/:id/functions", requireOwnMemberData, async (req, res) => {
  try {
    const id = Number(req.params.id);
    const rows = await db
      .select({ id: functions.id, name: functions.name })
      .from(memberFunctions)
      .innerJoin(functions, eq(memberFunctions.functionId, functions.id))
      .where(eq(memberFunctions.memberId, id))
      .orderBy(functions.name);
    res.json(rows);
  } catch (e) {
    req.log.error(e);
    res.status(500).json({ error: "Failed to fetch member functions" });
  }
});

appRouter.put("/members/:id/functions", requireOwnMemberData, async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { functionIds } = req.body as { functionIds: number[] };

    await db.transaction(async (tx) => {
      await tx.delete(memberFunctions).where(eq(memberFunctions.memberId, id));
      if (functionIds.length > 0) {
        await tx.insert(memberFunctions).values(functionIds.map((functionId) => ({ memberId: id, functionId })));
      }
    });

    const rows = await db
      .select({ id: functions.id, name: functions.name })
      .from(memberFunctions)
      .innerJoin(functions, eq(memberFunctions.functionId, functions.id))
      .where(eq(memberFunctions.memberId, id))
      .orderBy(functions.name);
    res.json(rows);
  } catch (e) {
    req.log.error(e);
    res.status(500).json({ error: "Failed to update member functions" });
  }
});

appRouter.get("/members/:id/skills", requireOwnMemberData, async (req, res) => {
  try {
    const id = Number(req.params.id);
    const rows = await db.select().from(memberSkills).where(eq(memberSkills.memberId, id));
    res.json(rows);
  } catch (e) {
    req.log.error(e);
    res.status(500).json({ error: "Failed to fetch member skills" });
  }
});

appRouter.post("/members/:id/skills", requireOwnMemberData, async (req, res) => {
  try {
    const memberId = Number(req.params.id);
    const { name, type, level, desired } = req.body as {
      name: string;
      type?: string;
      level?: string;
      desired?: string;
    };
    if (!name) {
      res.status(400).json({ error: "name is required" });
      return;
    }
    const [row] = await db
      .insert(memberSkills)
      .values({ memberId, name, type: type ?? null, level: level ?? null, desired: desired ?? null })
      .returning();
    res.status(201).json(row);
  } catch (e) {
    req.log.error(e);
    res.status(500).json({ error: "Failed to add member skill" });
  }
});

appRouter.delete("/members/:id/skills/:skillId", requireOwnMemberData, async (req, res) => {
  try {
    const memberId = Number(req.params.id);
    const skillId = Number(req.params.skillId);
    await db
      .delete(memberSkills)
      .where(and(eq(memberSkills.id, skillId), eq(memberSkills.memberId, memberId)));
    res.status(204).end();
  } catch (e) {
    req.log.error(e);
    res.status(500).json({ error: "Failed to delete member skill" });
  }
});

appRouter.put("/members/:id/skills", requireOwnMemberData, async (req, res) => {
  try {
    const memberId = Number(req.params.id);
    const { skills: incoming } = req.body as {
      skills: Array<{ name: string; type: string | null }>;
    };
    if (!Array.isArray(incoming)) {
      res.status(400).json({ error: "skills must be an array" });
      return;
    }
    const existing = await db.select().from(memberSkills).where(eq(memberSkills.memberId, memberId));
    const incomingSet = new Set(incoming.map(s => s.name.toLowerCase()));
    const existingSet = new Set(existing.map(s => s.name.toLowerCase()));
    const toDelete = existing.filter(s => !incomingSet.has(s.name.toLowerCase()));
    if (toDelete.length > 0) {
      await db.delete(memberSkills).where(
        and(eq(memberSkills.memberId, memberId), inArray(memberSkills.id, toDelete.map(s => s.id)))
      );
    }
    const toInsert = incoming.filter(s => !existingSet.has(s.name.toLowerCase()));
    if (toInsert.length > 0) {
      await db.insert(memberSkills).values(
        toInsert.map(s => ({ memberId, name: s.name, type: s.type ?? null, level: null, desired: null }))
      );
    }
    const updated = await db.select().from(memberSkills).where(eq(memberSkills.memberId, memberId));
    res.json(updated);
  } catch (e) {
    req.log.error(e);
    res.status(500).json({ error: "Failed to update member skills" });
  }
});

appRouter.get("/members/:id/kudos", requireOwnMemberData, async (req, res) => {
  try {
    const id = Number(req.params.id);
    const rows = await db.select().from(kudos).where(eq(kudos.memberId, id));
    res.json(rows);
  } catch (e) {
    req.log.error(e);
    res.status(500).json({ error: "Failed to fetch member kudos" });
  }
});

// ─── Projects ─────────────────────────────────────────────────────────────────
// All project access is scoped to the caller's validated active team.

appRouter.get("/projects", requireTeamAuth, async (req: any, res) => {
  try {
    const activeTeamId: number = req.activeTeamEntry.teamId;

    const stakeholderRows = await db
      .select()
      .from(projectStakeholders);

    if (isManager(req.member)) {
      const projectRows = await db
        .select()
        .from(projects)
        .where(eq(projects.organizacaoId, activeTeamId))
        .orderBy(projects.id);

      const result = projectRows.map((p) => ({
        ...p,
        stakeholders: stakeholderRows
          .filter((s) => s.projectId === p.id)
          .map((s) => s.memberId),
      }));
      res.json(result);
      return;
    }

    const myProjectIds = stakeholderRows
      .filter((s) => s.memberId === req.member.id)
      .map((s) => s.projectId);

    if (myProjectIds.length === 0) {
      res.json([]);
      return;
    }

    const projectRows = await db
      .select()
      .from(projects)
      .where(and(inArray(projects.id, myProjectIds), eq(projects.organizacaoId, activeTeamId)))
      .orderBy(projects.id);

    const result = projectRows.map((p) => ({
      ...p,
      stakeholders: stakeholderRows
        .filter((s) => s.projectId === p.id)
        .map((s) => s.memberId),
    }));
    res.json(result);
  } catch (e) {
    req.log.error(e);
    res.status(500).json({ error: "Failed to fetch projects" });
  }
});

appRouter.post("/projects", requireManagerTeamAuth, async (req: any, res) => {
  try {
    const activeTeamId: number = req.activeTeamEntry.teamId;
    const body = req.body as {
      name: string;
      objective?: string;
      clients?: string;
      tools?: string[];
      team?: string;
      startDate?: string;
      endDate?: string;
      rating?: number;
      status?: string;
      observation?: string;
      stakeholders?: number[];
    };
    if (!body.name) {
      res.status(400).json({ error: "name is required" });
      return;
    }
    const [project] = await db
      .insert(projects)
      .values({
        name: body.name,
        organizacaoId: activeTeamId,
        objective: body.objective ?? null,
        clients: body.clients ?? null,
        tools: body.tools ?? null,
        team: body.team ?? null,
        startDate: body.startDate ?? null,
        endDate: body.endDate ?? null,
        rating: body.rating ?? 0,
        status: body.status ?? null,
        observation: body.observation ?? null,
      })
      .returning();

    const stakeholderIds = body.stakeholders ?? [];
    if (stakeholderIds.length > 0) {
      await db.insert(projectStakeholders).values(
        stakeholderIds.map((memberId) => ({ projectId: project.id, memberId }))
      );
    }

    res.status(201).json({ ...project, stakeholders: stakeholderIds });
  } catch (e) {
    req.log.error(e);
    res.status(500).json({ error: "Failed to create project" });
  }
});

appRouter.put("/projects/:id", requireManagerTeamAuth, async (req: any, res) => {
  try {
    const id = Number(req.params.id);
    const activeTeamId: number = req.activeTeamEntry.teamId;

    const existing = await db
      .select()
      .from(projects)
      .where(and(eq(projects.id, id), eq(projects.organizacaoId, activeTeamId)));
    if (!existing.length) {
      res.status(404).json({ error: "Not found in your team" });
      return;
    }

    const body = req.body as {
      name?: string;
      objective?: string;
      clients?: string;
      tools?: string[];
      team?: string;
      startDate?: string;
      endDate?: string;
      rating?: number;
      status?: string;
      observation?: string;
      stakeholders?: number[];
    };

    const updates: Record<string, unknown> = {};
    for (const key of ["name", "objective", "clients", "tools", "team", "startDate", "endDate", "rating", "status", "observation"] as const) {
      if (body[key] !== undefined) updates[key] = body[key];
    }

    const [project] = await db
      .update(projects)
      .set(updates)
      .where(eq(projects.id, id))
      .returning();

    if (body.stakeholders !== undefined) {
      await db.delete(projectStakeholders).where(eq(projectStakeholders.projectId, id));
      if (body.stakeholders.length > 0) {
        await db.insert(projectStakeholders).values(
          body.stakeholders.map((memberId) => ({ projectId: id, memberId }))
        );
      }
    }

    const stakeholderRows = await db
      .select()
      .from(projectStakeholders)
      .where(eq(projectStakeholders.projectId, id));

    res.json({ ...project, stakeholders: stakeholderRows.map((s) => s.memberId) });
  } catch (e) {
    req.log.error(e);
    res.status(500).json({ error: "Failed to update project" });
  }
});

appRouter.delete("/projects/:id", requireManagerTeamAuth, async (req: any, res) => {
  try {
    const id = Number(req.params.id);
    const activeTeamId: number = req.activeTeamEntry.teamId;

    const existing = await db
      .select()
      .from(projects)
      .where(and(eq(projects.id, id), eq(projects.organizacaoId, activeTeamId)));
    if (!existing.length) {
      res.status(404).json({ error: "Not found in your team" });
      return;
    }

    await db.delete(projectStakeholders).where(eq(projectStakeholders.projectId, id));
    await db.delete(projects).where(eq(projects.id, id));
    res.status(204).end();
  } catch (e) {
    req.log.error(e);
    res.status(500).json({ error: "Failed to delete project" });
  }
});

// ─── Absence Types ────────────────────────────────────────────────────────────

appRouter.get("/absence-types", requireTeamAuth, async (req: any, res) => {
  try {
    const rows = await db.select().from(absenceTypes).orderBy(absenceTypes.id);
    res.json(rows);
  } catch (e) {
    req.log.error(e);
    res.status(500).json({ error: "Failed to fetch absence types" });
  }
});

appRouter.post("/absence-types", requireManagerTeamAuth, async (req, res) => {
  try {
    const { name, color, description, type, icon } = req.body as {
      name: string;
      color?: string;
      description?: string;
      type?: string;
      icon?: string;
    };
    if (!name) {
      res.status(400).json({ error: "name is required" });
      return;
    }
    const [row] = await db
      .insert(absenceTypes)
      .values({ name, color: color ?? null, description: description ?? null, type: type ?? null, icon: icon ?? null })
      .returning();
    res.status(201).json(row);
  } catch (e) {
    req.log.error(e);
    res.status(500).json({ error: "Failed to create absence type" });
  }
});

appRouter.put("/absence-types/:id", requireManagerTeamAuth, async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { name, color, description, type, icon } = req.body as {
      name?: string;
      color?: string;
      description?: string;
      type?: string;
      icon?: string;
    };
    const [row] = await db
      .update(absenceTypes)
      .set({
        ...(name !== undefined && { name }),
        ...(color !== undefined && { color }),
        ...(description !== undefined && { description }),
        ...(type !== undefined && { type }),
        ...(icon !== undefined && { icon }),
      })
      .where(eq(absenceTypes.id, id))
      .returning();
    if (!row) {
      res.status(404).json({ error: "Not found" });
      return;
    }
    res.json(row);
  } catch (e) {
    req.log.error(e);
    res.status(500).json({ error: "Failed to update absence type" });
  }
});

appRouter.delete("/absence-types/:id", requireManagerTeamAuth, async (req, res) => {
  try {
    const id = Number(req.params.id);
    await db.delete(absenceTypes).where(eq(absenceTypes.id, id));
    res.status(204).end();
  } catch (e) {
    req.log.error(e);
    res.status(500).json({ error: "Failed to delete absence type" });
  }
});

// ─── Skill Categories ─────────────────────────────────────────────────────────

appRouter.get("/skill-categories", requireTeamAuth, async (req: any, res) => {
  try {
    const rows = await db.select().from(skillCategories).orderBy(skillCategories.id);
    res.json(rows);
  } catch (e) {
    req.log.error(e);
    res.status(500).json({ error: "Failed to fetch skill categories" });
  }
});

appRouter.post("/skill-categories", requireManagerTeamAuth, async (req, res) => {
  try {
    const { nome, descricao, niveis, tipoGrafico } = req.body as {
      nome: string;
      descricao?: string;
      niveis?: number;
      tipoGrafico?: string;
    };
    if (!nome) {
      res.status(400).json({ error: "nome is required" });
      return;
    }
    const [row] = await db
      .insert(skillCategories)
      .values({ nome, descricao: descricao ?? null, niveis: niveis ?? 3, tipoGrafico: tipoGrafico ?? null })
      .returning();
    res.status(201).json(row);
  } catch (e) {
    req.log.error(e);
    res.status(500).json({ error: "Failed to create skill category" });
  }
});

appRouter.put("/skill-categories/:id", requireManagerTeamAuth, async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { nome, descricao, niveis, tipoGrafico } = req.body as {
      nome?: string;
      descricao?: string;
      niveis?: number;
      tipoGrafico?: string;
    };
    const [row] = await db
      .update(skillCategories)
      .set({
        ...(nome !== undefined && { nome }),
        ...(descricao !== undefined && { descricao }),
        ...(niveis !== undefined && { niveis }),
        ...(tipoGrafico !== undefined && { tipoGrafico }),
      })
      .where(eq(skillCategories.id, id))
      .returning();
    if (!row) {
      res.status(404).json({ error: "Not found" });
      return;
    }
    res.json(row);
  } catch (e) {
    req.log.error(e);
    res.status(500).json({ error: "Failed to update skill category" });
  }
});

appRouter.delete("/skill-categories/:id", requireManagerTeamAuth, async (req, res) => {
  try {
    const id = Number(req.params.id);
    await db.delete(skillCategories).where(eq(skillCategories.id, id));
    res.status(204).end();
  } catch (e) {
    req.log.error(e);
    res.status(500).json({ error: "Failed to delete skill category" });
  }
});

// ─── Skills catalog ───────────────────────────────────────────────────────────

appRouter.get("/skills", requireTeamAuth, async (req: any, res) => {
  try {
    const rows = await db.select().from(skills).orderBy(skills.name);
    res.json(rows);
  } catch (e) {
    req.log.error(e);
    res.status(500).json({ error: "Failed to fetch skills" });
  }
});

appRouter.post("/skills", requireManagerTeamAuth, async (req, res) => {
  try {
    const { name, categoryId, icon } = req.body as {
      name: string;
      categoryId?: number | null;
      icon?: string | null;
    };
    if (!name) {
      res.status(400).json({ error: "name is required" });
      return;
    }
    const [row] = await db
      .insert(skills)
      .values({ name, categoryId: categoryId ?? null, icon: icon ?? null })
      .returning();
    res.status(201).json(row);
  } catch (e) {
    req.log.error(e);
    res.status(500).json({ error: "Failed to create skill" });
  }
});

appRouter.put("/skills/:id", requireManagerTeamAuth, async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { name, categoryId, icon } = req.body as {
      name?: string;
      categoryId?: number | null;
      icon?: string | null;
    };
    const [row] = await db
      .update(skills)
      .set({
        ...(name !== undefined && { name }),
        ...(categoryId !== undefined && { categoryId }),
        ...(icon !== undefined && { icon }),
      })
      .where(eq(skills.id, id))
      .returning();
    if (!row) {
      res.status(404).json({ error: "Not found" });
      return;
    }
    res.json(row);
  } catch (e) {
    req.log.error(e);
    res.status(500).json({ error: "Failed to update skill" });
  }
});

appRouter.delete("/skills/:id", requireManagerTeamAuth, async (req, res) => {
  try {
    const id = Number(req.params.id);
    await db.delete(skills).where(eq(skills.id, id));
    res.status(204).end();
  } catch (e) {
    req.log.error(e);
    res.status(500).json({ error: "Failed to delete skill" });
  }
});

// ─── Kudos Types ──────────────────────────────────────────────────────────────

appRouter.get("/kudos-types", requireTeamAuth, async (req: any, res) => {
  try {
    const rows = await db.select().from(kudosTypes).orderBy(kudosTypes.id);
    res.json(rows);
  } catch (e) {
    req.log.error(e);
    res.status(500).json({ error: "Failed to fetch kudos types" });
  }
});

// ─── Log Types ────────────────────────────────────────────────────────────────

appRouter.get("/log-types", requireTeamAuth, async (req: any, res) => {
  try {
    const rows = await db.select().from(logTypes).orderBy(logTypes.id);
    res.json(rows);
  } catch (e) {
    req.log.error(e);
    res.status(500).json({ error: "Failed to fetch log types" });
  }
});

// ─── Action Types ─────────────────────────────────────────────────────────────

appRouter.get("/action-types", requireTeamAuth, async (req: any, res) => {
  try {
    const rows = await db.select().from(actionTypes).orderBy(actionTypes.id);
    res.json(rows);
  } catch (e) {
    req.log.error(e);
    res.status(500).json({ error: "Failed to fetch action types" });
  }
});

// ─── Skill-category member skills ─────────────────────────────────────────────

appRouter.get("/skill-categories/:id/skills", requireManagerTeamAuth, async (req: any, res) => {
  try {
    const activeTeamId: number = req.activeTeamEntry.teamId;

    const teamMemberRows = await db
      .select({ memberId: teamMembers.memberId })
      .from(teamMembers)
      .where(eq(teamMembers.teamId, activeTeamId));

    const memberIds = teamMemberRows.map((r) => r.memberId);
    if (memberIds.length === 0) {
      res.json([]);
      return;
    }

    const rows = await db
      .select()
      .from(memberSkills)
      .where(and(eq(memberSkills.type, req.params.id), inArray(memberSkills.memberId, memberIds)));
    res.json(rows);
  } catch (e) {
    req.log.error(e);
    res.status(500).json({ error: "Failed to fetch skills" });
  }
});

// ─── Member Links ─────────────────────────────────────────────────────────────

appRouter.get("/members/:id/links", requireOwnMemberData, async (req: any, res) => {
  try {
    const id = Number(req.params.id);
    const rows = await db
      .select()
      .from(memberLinks)
      .where(eq(memberLinks.memberId, id))
      .orderBy(asc(memberLinks.sortOrder), asc(memberLinks.id));
    res.json(rows);
  } catch (e) {
    req.log.error(e);
    res.status(500).json({ error: "Failed to fetch member links" });
  }
});

appRouter.post("/members/:id/links", requireOwnMemberData, async (req: any, res) => {
  try {
    const id = Number(req.params.id);
    const { url } = req.body as { url: string };
    if (!url) {
      res.status(400).json({ error: "url is required" });
      return;
    }

    let normalizedUrl: string;
    try {
      const urlObj = new URL(url.startsWith("http") ? url : `https://${url}`);
      if (urlObj.protocol !== "http:" && urlObj.protocol !== "https:") {
        res.status(400).json({ error: "Only http and https URLs are allowed" });
        return;
      }
      normalizedUrl = url.startsWith("http") ? url : `https://${url}`;
    } catch {
      res.status(400).json({ error: "Invalid URL" });
      return;
    }

    const parsed = parseLink(normalizedUrl);

    const [maxRow] = await db
      .select({ maxOrder: max(memberLinks.sortOrder) })
      .from(memberLinks)
      .where(eq(memberLinks.memberId, id));

    const nextOrder = (maxRow?.maxOrder ?? -1) + 1;

    const [row] = await db
      .insert(memberLinks)
      .values({
        memberId: id,
        url: normalizedUrl,
        platform: parsed.platform,
        handle: parsed.handle,
        sortOrder: nextOrder,
      })
      .returning();

    res.status(201).json(row);
  } catch (e) {
    req.log.error(e);
    res.status(500).json({ error: "Failed to create member link" });
  }
});

appRouter.delete("/members/:id/links/:linkId", requireOwnMemberData, async (req: any, res) => {
  try {
    const id = Number(req.params.id);
    const linkId = Number(req.params.linkId);

    const existing = await db
      .select()
      .from(memberLinks)
      .where(and(eq(memberLinks.id, linkId), eq(memberLinks.memberId, id)));

    if (!existing.length) {
      res.status(404).json({ error: "Link not found" });
      return;
    }

    await db.delete(memberLinks).where(eq(memberLinks.id, linkId));
    res.status(204).end();
  } catch (e) {
    req.log.error(e);
    res.status(500).json({ error: "Failed to delete member link" });
  }
});

appRouter.patch("/members/:id/links/reorder", requireOwnMemberData, async (req: any, res) => {
  try {
    const id = Number(req.params.id);
    const { ids } = req.body as { ids: number[] };
    if (!Array.isArray(ids)) {
      res.status(400).json({ error: "ids must be an array" });
      return;
    }

    await db.transaction(async (tx) => {
      for (let i = 0; i < ids.length; i++) {
        await tx
          .update(memberLinks)
          .set({ sortOrder: i })
          .where(and(eq(memberLinks.id, ids[i]), eq(memberLinks.memberId, id)));
      }
    });

    const rows = await db
      .select()
      .from(memberLinks)
      .where(eq(memberLinks.memberId, id))
      .orderBy(asc(memberLinks.sortOrder), asc(memberLinks.id));

    res.json(rows);
  } catch (e) {
    req.log.error(e);
    res.status(500).json({ error: "Failed to reorder member links" });
  }
});

// ─── Stats ────────────────────────────────────────────────────────────────────

appRouter.get("/stats/members", requireTeamAuth, async (req: any, res) => {
  try {
    const activeTeamId: number = req.activeTeamEntry.teamId;
    const [{ count }] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(teamMembers)
      .where(eq(teamMembers.teamId, activeTeamId));
    res.json({ total: count });
  } catch (e) {
    req.log.error(e);
    res.status(500).json({ error: "Failed to fetch stats" });
  }
});

// ─── Invitations ──────────────────────────────────────────────────────────────

function buildInviteUrl(req: any, token: string): string {
  const proto = (req.headers["x-forwarded-proto"] as string | undefined ?? req.protocol ?? "https").split(",")[0].trim();
  const host = (req.headers["x-forwarded-host"] as string | undefined ?? req.headers.host ?? "localhost") as string;
  return `${proto}://${host}/invite/${token}`;
}

function isDomainAllowed(email: string, allowedDomains: string[] | null | undefined): boolean {
  if (!allowedDomains || allowedDomains.length === 0) return true;
  const domain = email.split("@")[1]?.toLowerCase() ?? "";
  return allowedDomains.some((d) => d.replace(/^@/, "").toLowerCase() === domain);
}

function isInviteExpired(expiresAt: Date): boolean {
  return new Date() > expiresAt;
}

appRouter.post("/invites/batch", requireTeamAuth, async (req: any, res) => {
  try {
    const activeTeamId: number = req.activeTeamEntry.teamId;
    const invitedByMemberId: number = req.member.id;
    const { emails, role } = req.body as { emails: string[]; role?: string };

    if (!Array.isArray(emails) || emails.length === 0) {
      res.status(400).json({ error: "emails must be a non-empty array" });
      return;
    }

    const [teamRow] = await db.select().from(teams).where(eq(teams.id, activeTeamId));
    if (!teamRow) {
      res.status(404).json({ error: "Team not found" });
      return;
    }

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const results: Array<{ email: string; token: string | null; inviteUrl: string | null; valid: boolean; reason: string | null }> = [];

    for (const rawEmail of emails) {
      const email = rawEmail.trim().toLowerCase();
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        results.push({ email: rawEmail, token: null, inviteUrl: null, valid: false, reason: "E-mail inválido" });
        continue;
      }

      if (!isDomainAllowed(email, teamRow.allowedDomains)) {
        const domain = email.split("@")[1] ?? "";
        results.push({ email, token: null, inviteUrl: null, valid: false, reason: `Domínio @${domain} não permitido` });
        continue;
      }

      const existing = await db
        .select()
        .from(invitations)
        .where(and(eq(invitations.teamId, activeTeamId), eq(invitations.invitedEmail, email), eq(invitations.status, "pending")));

      let inv;
      if (existing.length > 0) {
        inv = existing[0];
      } else {
        const [created] = await db
          .insert(invitations)
          .values({ teamId: activeTeamId, invitedEmail: email, invitedByMemberId, role: role ?? "Membro", status: "pending", expiresAt })
          .returning();
        inv = created;
      }

      const inviteUrl = buildInviteUrl(req, inv.token!);
      results.push({ email, token: inv.token!, inviteUrl, valid: true, reason: null });
    }

    res.status(201).json(results);
  } catch (e) {
    req.log.error(e);
    res.status(500).json({ error: "Failed to create invitations" });
  }
});

appRouter.get("/invites", requireTeamAuth, async (req: any, res) => {
  try {
    const activeTeamId: number = req.activeTeamEntry.teamId;
    const callerMemberId: number = req.member.id;
    const callerIsManager = isManager(req.member);

    const whereConditions = callerIsManager
      ? and(eq(invitations.teamId, activeTeamId), eq(invitations.status, "pending"))
      : and(
          eq(invitations.teamId, activeTeamId),
          eq(invitations.status, "pending"),
          eq(invitations.invitedByMemberId, callerMemberId),
        );

    const rows = await db
      .select({
        id: invitations.id,
        teamId: invitations.teamId,
        invitedEmail: invitations.invitedEmail,
        invitedByMemberId: invitations.invitedByMemberId,
        invitedByName: members.name,
        role: invitations.role,
        token: invitations.token,
        status: invitations.status,
        expiresAt: invitations.expiresAt,
        createdAt: invitations.createdAt,
      })
      .from(invitations)
      .leftJoin(members, eq(invitations.invitedByMemberId, members.id))
      .where(whereConditions)
      .orderBy(desc(invitations.createdAt));

    const now = new Date();
    const enriched = rows.map((r) => {
      const expired = r.expiresAt && new Date(r.expiresAt) < now;
      const inviteUrl = buildInviteUrl(req, r.token!);
      return { ...r, status: expired ? "expired" : r.status, inviteUrl };
    });

    res.json(enriched);
  } catch (e) {
    req.log.error(e);
    res.status(500).json({ error: "Failed to fetch invitations" });
  }
});

appRouter.get("/invites/:token", async (req: any, res) => {
  try {
    const { token } = req.params;

    const rows = await db
      .select({
        id: invitations.id,
        teamId: invitations.teamId,
        invitedEmail: invitations.invitedEmail,
        invitedByName: members.name,
        invitedByAvatar: members.avatar,
        role: invitations.role,
        token: invitations.token,
        status: invitations.status,
        expiresAt: invitations.expiresAt,
        orgName: teams.name,
      })
      .from(invitations)
      .leftJoin(members, eq(invitations.invitedByMemberId, members.id))
      .leftJoin(teams, eq(invitations.teamId, teams.id))
      .where(eq(invitations.token, token));

    if (!rows.length) {
      res.status(404).json({ error: "Convite não encontrado" });
      return;
    }

    const inv = rows[0];
    const expired = inv.expiresAt && new Date(inv.expiresAt) < new Date();
    const status = expired && inv.status === "pending" ? "expired" : inv.status;

    res.json({ ...inv, status });
  } catch (e) {
    req.log.error(e);
    res.status(500).json({ error: "Failed to fetch invitation" });
  }
});

appRouter.post("/invites/:token/accept", requireAuth, async (req: any, res) => {
  try {
    const { token } = req.params;
    const clerkUser = await clerkClient.users.getUser(req.clerkUserId);
    const callerEmail = clerkUser.emailAddresses[0]?.emailAddress?.toLowerCase();

    if (!callerEmail) {
      res.status(400).json({ error: "No email address found for this account" });
      return;
    }

    const rows = await db.select().from(invitations).where(eq(invitations.token, token));
    if (!rows.length) {
      res.status(404).json({ error: "Convite não encontrado" });
      return;
    }

    const inv = rows[0];

    if (inv.status === "cancelled") {
      res.status(410).json({ error: "Este convite foi cancelado" });
      return;
    }

    if (inv.status === "accepted") {
      res.status(409).json({ error: "Este convite já foi aceito" });
      return;
    }

    if (isInviteExpired(inv.expiresAt)) {
      await db.update(invitations).set({ status: "expired" }).where(eq(invitations.token, token));
      res.status(410).json({ error: "Este convite expirou" });
      return;
    }

    if (inv.invitedEmail.toLowerCase() !== callerEmail) {
      res.status(403).json({ error: `Este convite é para ${inv.invitedEmail}. Você está autenticado como ${callerEmail}.` });
      return;
    }

    const result = await db.transaction(async (tx) => {
      let memberRow;
      const existing = await tx.select().from(members).where(eq(members.email, callerEmail));
      if (existing.length > 0) {
        memberRow = existing[0];
      } else {
        const clerkName = [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(" ") || callerEmail.split("@")[0];
        const [created] = await tx
          .insert(members)
          .values({ name: clerkName, email: callerEmail, availableKudos: 5 })
          .returning();
        memberRow = created;
      }

      await tx
        .insert(teamMembers)
        .values({ memberId: memberRow.id, teamId: inv.teamId, role: inv.role ?? "Membro", positionId: null })
        .onConflictDoUpdate({
          target: [teamMembers.memberId, teamMembers.teamId],
          set: { role: inv.role ?? "Membro" },
        });

      await tx.update(invitations).set({ status: "accepted" }).where(eq(invitations.token, token));

      return { member: memberRow, teamId: inv.teamId };
    });

    res.json({ success: true, memberId: result.member.id, teamId: result.teamId });
  } catch (e) {
    req.log.error(e);
    res.status(500).json({ error: "Failed to accept invitation" });
  }
});

appRouter.delete("/invites/:id", requireTeamAuth, async (req: any, res) => {
  try {
    const { id } = req.params;
    const activeTeamId: number = req.activeTeamEntry.teamId;

    const rows = await db.select().from(invitations).where(eq(invitations.id, id));
    if (!rows.length) {
      res.status(404).json({ error: "Convite não encontrado" });
      return;
    }

    if (rows[0].teamId !== activeTeamId) {
      res.status(403).json({ error: "Você não tem permissão para cancelar este convite" });
      return;
    }

    if (rows[0].status !== "pending") {
      res.status(409).json({ error: "Apenas convites pendentes podem ser cancelados" });
      return;
    }

    await db.update(invitations).set({ status: "cancelled" }).where(eq(invitations.id, id));
    res.status(204).end();
  } catch (e) {
    req.log.error(e);
    res.status(500).json({ error: "Failed to cancel invitation" });
  }
});

export { appRouter };
