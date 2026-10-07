import { Component, type ReactNode } from "react";

export class ErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() {
    if (this.state.failed) return (
      <main className="min-h-screen p-8 flex flex-col justify-center items-center text-center gap-5">
        <h1 className="text-3xl font-bold">This page could not be loaded</h1>
        <p>Please reload the page, or contact us by phone or email.</p>
        <a className="underline" href={import.meta.env.BASE_URL}>Return to the home page</a>
        <a className="underline" href="tel:+61421833372">0421 833 372</a>
        <a className="underline" href="mailto:bevan@entirefs.com.au">bevan@entirefs.com.au</a>
      </main>
    );
    return this.props.children;
  }
}