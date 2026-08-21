import { AppearanceSync, ScrollHints } from "@webdev/components";
import { Footer, Header, ReadProgress } from "@webdev/widgets";
import "./tailwind.css";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex h-dvh flex-col overflow-hidden">
      <AppearanceSync />
      <div className="page-atmosphere pointer-events-none absolute inset-0" aria-hidden />
      <ReadProgress />
      <Header />
      <ScrollHints
        id="page-content"
        frameClassName="z-10 flex min-h-0 flex-1 flex-col"
        className="flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain"
      >
        <main className="mx-auto w-full min-w-0 max-w-6xl flex-1 px-3 py-5 pb-6 sm:px-6 sm:py-10 sm:pb-8">{children}</main>
        <Footer />
      </ScrollHints>
    </div>
  );
}
