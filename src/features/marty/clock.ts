export interface Clock {
  setTimeout(cb: () => void, ms: number): () => void;
  now(): number;
}

export class RealClock implements Clock {
  setTimeout(cb: () => void, ms: number): () => void {
    const id = setTimeout(cb, ms);
    return () => clearTimeout(id);
  }
  now(): number {
    return Date.now();
  }
}

interface Pending {
  cb: () => void;
  due: number;
}

export class FakeClock implements Clock {
  private current = 0;
  private pending: Pending[] = [];
  setTimeout(cb: () => void, ms: number): () => void {
    const item: Pending = { cb, due: this.current + ms };
    this.pending = [...this.pending, item];
    return () => {
      this.pending = this.pending.filter((p) => p !== item);
    };
  }
  now(): number {
    return this.current;
  }
  advance(ms: number): void {
    this.current += ms;
    const ready = this.pending.filter((p) => p.due <= this.current);
    this.pending = this.pending.filter((p) => p.due > this.current);
    ready.forEach((p) => p.cb());
  }
}
