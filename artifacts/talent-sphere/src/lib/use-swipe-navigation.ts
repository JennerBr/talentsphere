import { RefObject, useEffect, useRef, useState, useCallback } from "react";
import { useLocation } from "wouter";

export interface SwipePage {
  href: string;
  label: string;
}

export interface SwipeNavState {
  hintDirection: "left" | "right" | null;
  hintLabel: string;
  progress: number;
}

const OVERSCROLL_TRIGGER_PX = 20;
const HINT_DELAY_MS = 300;
const CONFIRM_DELAY_MS = 700;
const WHEEL_IDLE_MS = 120;

function findCurrentIndex(location: string, pages: SwipePage[]): number {
  const sorted = [...pages]
    .map((p, i) => ({ ...p, originalIndex: i }))
    .sort((a, b) => b.href.length - a.href.length);

  for (const page of sorted) {
    if (location === page.href || location.startsWith(page.href + "/")) {
      return page.originalIndex;
    }
  }
  return -1;
}

export function useSwipeNavigation(
  scrollRef: RefObject<HTMLElement | null>,
  pages: SwipePage[],
  onNavigate: (href: string) => void
): SwipeNavState {
  const [location] = useLocation();
  const [state, setState] = useState<SwipeNavState>({
    hintDirection: null,
    hintLabel: "",
    progress: 0,
  });

  const hintTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const confirmTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const progressRafRef = useRef<number | null>(null);
  const wheelIdleRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const overscrollStartedRef = useRef(false);
  const activeDirectionRef = useRef<"left" | "right" | null>(null);
  const overscrollAccRef = useRef(0);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const touchActiveRef = useRef(false);
  const startTimeRef = useRef<number>(0);

  const currentIndexRef = useRef(-1);
  currentIndexRef.current = findCurrentIndex(location, pages);

  const getTargetPage = useCallback(
    (direction: "left" | "right") => {
      const idx = currentIndexRef.current;
      if (idx === -1) return null;
      if (direction === "right" && idx < pages.length - 1) return pages[idx + 1];
      if (direction === "left" && idx > 0) return pages[idx - 1];
      return null;
    },
    [pages]
  );

  const reset = useCallback(() => {
    if (hintTimerRef.current) { clearTimeout(hintTimerRef.current); hintTimerRef.current = null; }
    if (confirmTimerRef.current) { clearTimeout(confirmTimerRef.current); confirmTimerRef.current = null; }
    if (progressRafRef.current) { cancelAnimationFrame(progressRafRef.current); progressRafRef.current = null; }
    if (wheelIdleRef.current) { clearTimeout(wheelIdleRef.current); wheelIdleRef.current = null; }
    overscrollStartedRef.current = false;
    overscrollAccRef.current = 0;
    activeDirectionRef.current = null;
    touchStartRef.current = null;
    touchActiveRef.current = false;
    setState({ hintDirection: null, hintLabel: "", progress: 0 });
  }, []);

  const beginOverscroll = useCallback(
    (direction: "left" | "right") => {
      if (overscrollStartedRef.current) return;
      const target = getTargetPage(direction);
      if (!target) return;

      overscrollStartedRef.current = true;
      activeDirectionRef.current = direction;
      startTimeRef.current = Date.now();

      hintTimerRef.current = setTimeout(() => {
        setState({ hintDirection: direction, hintLabel: target.label, progress: 0 });

        const animateProgress = () => {
          const elapsed = Date.now() - startTimeRef.current;
          const p = Math.min(elapsed / CONFIRM_DELAY_MS, 1);
          setState((prev) => ({ ...prev, progress: p }));
          if (p < 1) {
            progressRafRef.current = requestAnimationFrame(animateProgress);
          }
        };
        progressRafRef.current = requestAnimationFrame(animateProgress);
      }, HINT_DELAY_MS);

      confirmTimerRef.current = setTimeout(() => {
        onNavigate(target.href);
        reset();
      }, CONFIRM_DELAY_MS);
    },
    [getTargetPage, onNavigate, reset]
  );

  const isAtScrollStart = (el: HTMLElement) => el.scrollLeft <= 1;
  const isAtScrollEnd = (el: HTMLElement) =>
    el.scrollLeft + el.clientWidth >= el.scrollWidth - 1;

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const handleWheel = (e: WheelEvent) => {
      const absX = Math.abs(e.deltaX);
      const absY = Math.abs(e.deltaY);
      if (absX < 2 || absY > absX * 1.5) return;

      const direction = e.deltaX > 0 ? "right" : "left";

      if (activeDirectionRef.current !== null && activeDirectionRef.current !== direction) {
        reset();
        return;
      }

      if (direction === "right" && !isAtScrollEnd(el)) return;
      if (direction === "left" && !isAtScrollStart(el)) return;

      if (currentIndexRef.current === -1) return;

      overscrollAccRef.current += absX;

      if (overscrollAccRef.current >= OVERSCROLL_TRIGGER_PX) {
        beginOverscroll(direction);
      }

      if (wheelIdleRef.current) clearTimeout(wheelIdleRef.current);
      wheelIdleRef.current = setTimeout(() => {
        reset();
      }, WHEEL_IDLE_MS);
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length !== 1) return;
      touchStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      touchActiveRef.current = false;
      overscrollAccRef.current = 0;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!touchStartRef.current || e.touches.length !== 1) return;
      if (currentIndexRef.current === -1) return;

      const dx = e.touches[0].clientX - touchStartRef.current.x;
      const dy = e.touches[0].clientY - touchStartRef.current.y;

      if (!touchActiveRef.current) {
        if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return;
        if (Math.abs(dy) > Math.abs(dx) * 0.8) return;
        touchActiveRef.current = true;
      }

      const direction = dx < 0 ? "right" : "left";

      if (activeDirectionRef.current !== null && activeDirectionRef.current !== direction) {
        reset();
        return;
      }

      if (direction === "right" && !isAtScrollEnd(el)) return;
      if (direction === "left" && !isAtScrollStart(el)) return;

      overscrollAccRef.current += Math.abs(dx) * 0.6;
      touchStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };

      if (overscrollAccRef.current >= OVERSCROLL_TRIGGER_PX) {
        beginOverscroll(direction);
      }
    };

    const handleTouchEnd = () => {
      if (overscrollStartedRef.current) {
        reset();
      } else {
        touchStartRef.current = null;
        touchActiveRef.current = false;
        overscrollAccRef.current = 0;
      }
    };

    el.addEventListener("wheel", handleWheel, { passive: true });
    el.addEventListener("touchstart", handleTouchStart, { passive: true });
    el.addEventListener("touchmove", handleTouchMove, { passive: true });
    el.addEventListener("touchend", handleTouchEnd, { passive: true });
    el.addEventListener("touchcancel", handleTouchEnd, { passive: true });

    return () => {
      el.removeEventListener("wheel", handleWheel);
      el.removeEventListener("touchstart", handleTouchStart);
      el.removeEventListener("touchmove", handleTouchMove);
      el.removeEventListener("touchend", handleTouchEnd);
      el.removeEventListener("touchcancel", handleTouchEnd);
      reset();
    };
  }, [scrollRef, beginOverscroll, reset]);

  return state;
}
