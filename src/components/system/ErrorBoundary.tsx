"use client";
import { Component } from "react";
import type { ReactNode } from "react";
import type { ErrorReporter } from "@/lib/observability/types";

interface Props {
  readonly reporter: ErrorReporter;
  readonly fallback: ReactNode;
  readonly children: ReactNode;
}

interface State {
  readonly hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: unknown, info: unknown): void {
    this.props.reporter.report(error, { componentStack: String(info) });
  }

  render(): ReactNode {
    return this.state.hasError ? this.props.fallback : this.props.children;
  }
}
