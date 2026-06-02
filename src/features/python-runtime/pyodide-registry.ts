import type { PyodideInstance } from "./pyodide-service";

export class PyodideRegistry {
  private instance: PyodideInstance | null = null;
  getInstance(): PyodideInstance | null {
    return this.instance;
  }
  setInstance(i: PyodideInstance): void {
    this.instance = i;
  }
  reset(): void {
    this.instance = null;
  }
}
