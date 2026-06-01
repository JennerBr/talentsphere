import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface SwipeNavIndicatorProps {
  direction: "left" | "right" | null;
  label: string;
  progress: number;
}

export function SwipeNavIndicator({ direction, label, progress }: SwipeNavIndicatorProps) {
  if (!direction) return null;

  const isRight = direction === "right";

  return (
    <div
      className={cn(
        "fixed top-1/2 -translate-y-1/2 z-50 flex flex-col items-center gap-2 pointer-events-none",
        "transition-all duration-200 ease-out",
        isRight ? "right-3" : "left-3"
      )}
      style={{ opacity: 0.4 + progress * 0.6 }}
    >
      <div
        className={cn(
          "flex flex-col items-center gap-2 px-3 py-4 rounded-2xl",
          "bg-card border border-border shadow-lg",
          isRight ? "items-end" : "items-start"
        )}
        style={{ transform: `scale(${0.85 + progress * 0.15})` }}
      >
        {isRight ? (
          <ChevronRight className="h-5 w-5 text-primary" />
        ) : (
          <ChevronLeft className="h-5 w-5 text-primary" />
        )}

        <p
          className="text-xs font-medium text-foreground max-w-[72px] text-center leading-tight"
          style={{ writingMode: "vertical-rl", transform: isRight ? "none" : "rotate(180deg)" }}
        >
          {label}
        </p>

        <div className="w-1.5 h-16 bg-muted rounded-full overflow-hidden">
          <div
            className="w-full bg-primary rounded-full transition-none"
            style={{
              height: `${progress * 100}%`,
              marginTop: isRight ? "auto" : undefined,
              ...(isRight ? { marginTop: `${(1 - progress) * 100}%` } : {}),
            }}
          />
        </div>
      </div>
    </div>
  );
}
