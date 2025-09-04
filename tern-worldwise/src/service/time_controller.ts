// service/time_controller.ts
export type TimeSubscriber = (remainingFraction: number) => void;

export class TimeController {
  private durationMs: number;
  private rafId: number | null = null;
  private startTs = 0;
  private elapsed = 0;
  private subs = new Set<TimeSubscriber>();
  private onComplete?: () => void;

  constructor(durationMs: number, onComplete?: () => void) {
    this.durationMs = durationMs;
    this.onComplete = onComplete;
  }

  setOnComplete(fn?: () => void) {
    this.onComplete = fn;
  }

  start() {
    if (this.rafId !== null) return;
    this.startTs = performance.now() - this.elapsed;

    const tick = (now: number) => {
      this.elapsed = now - this.startTs;
      const remaining = Math.max(0, this.durationMs - this.elapsed);
      this.emit(remaining / this.durationMs);

      if (remaining <= 0) {
        this.stop();
        this.onComplete?.();   // ← aktuelles Callback
        return;
      }
      this.rafId = requestAnimationFrame(tick);
    };

    this.rafId = requestAnimationFrame(tick);
  }

  stop() {
    if (this.rafId !== null) cancelAnimationFrame(this.rafId);
    this.rafId = null;
  }

  reset() {
    this.stop();
    this.elapsed = 0;
    this.emit(1);
  }

  subscribe(fn: TimeSubscriber) {
    this.subs.add(fn);
    fn(1);
    return () => this.subs.delete(fn);
  }

  private emit(v: number) {
    this.subs.forEach((s) => s(v));
  }
}
