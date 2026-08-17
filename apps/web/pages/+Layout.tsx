import { Footer, Header } from "@webdev/widgets";
import "./tailwind.css";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div id="page-content" className="flex-1">
        <main className="mx-auto w-full min-w-0 max-w-6xl px-4 py-8 sm:px-6 sm:py-12">{children}</main>
      </div>
      <Footer />
    </div>
  );
}
