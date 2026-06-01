---
name: Skills catalog pattern
description: How skills catalog and member skills relate; bulk update strategy; icon suggestion approach.
---

## Structure
- `skills` table (migration 0010): `id, name, category_id FK → skill_categories(id) ON DELETE SET NULL, icon text`
- `member_skills` table: free text `(id, memberId, name, type, level, desired)` — no FK to skills catalog
- Skill types/categories live in `skill_categories` table

## PUT /members/:id/skills (bulk)
Accepts `{ skills: Array<{name, type}> }`.
- Matches existing records by `name.toLowerCase()` 
- Keeps (preserves level/desired) for skills still in the new list
- Deletes records not in the new list
- Inserts new ones with `level=null, desired=null`

**Why:** Member skills store chart-level data (level/desired). On bulk edit we must not lose levels for skills kept in the selection.

**How to apply:** Any profile edit that removes/adds skills should use PUT /members/:id/skills rather than DELETE + POST per skill.

## Icon suggestion (admin)
`suggestSkillIcon(name)` in admin-habilidades.tsx maps normalized keyword patterns → emoji. Called live as user types; result stored in `skills.icon` column as emoji text.

**Why:** Stored as plain text (emoji) so it renders anywhere without importing a specific icon library.

## Profile edit mode — skills card
Edit mode: catalog badges toggleable by name, grouped by skill_category; uncategorized in "Outros" group. Free-text input at bottom adds custom name to `editSkillNames` (not to catalog). On save calls `useUpdateMemberSkills`.

## Profile edit mode — hobbies card  
Added free-text input that calls `createHobbyMutation` (POST /hobbies) to auto-create in catalog first, then appends resulting ID to `editHobbyIds`. POST /hobbies uses `requireTeamAuth` so any logged-in member can call it.
