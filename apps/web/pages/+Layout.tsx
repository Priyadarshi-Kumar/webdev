import { AppearanceSync, ScrollHints } from "@webdev/components";
import { Footer, Header, ReadProgress } from "@webdev/widgets";
import { usePageContext } from "vike-react/usePageContext";
import "./tailwind.css";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { urlPathname } = usePageContext();
  const isHome = urlPathname === "/";

  return (
    <div className="relative flex h-dvh flex-col overflow-hidden">
      <AppearanceSync />
      <div className="page-atmosphere pointer-events-none absolute inset-0" aria-hidden />
      <ReadProgress />
      <Header />
      <ScrollHints
        id="page-content"
        frameClassName="z-10 flex min-h-0 flex-1 flex-col"
        className="rail-scroll min-h-0 flex-1 overflow-x-hidden overflow-y-auto overscroll-contain lg:flex lg:flex-col"
      >
        <main
          className={`mx-auto w-full min-w-0 max-w-6xl overflow-x-hidden px-3 pb-6 sm:px-6 sm:pb-8 lg:flex-1 ${
            isHome ? "pt-5 sm:pt-10" : "pt-0 lg:pt-10"
          }`}
        >
          {children}
        </main>
        <Footer />
      </ScrollHints>
    </div>
  );
}
