import { Eyebrow } from "@webdev/components";
import { usePageContext } from "vike-react/usePageContext";

export default function Page() {
  const { is404 } = usePageContext();
  if (is404) {
    return (
      <section>
        <Eyebrow>404</Eyebrow>
        <h1 className="page-title">Page not found</h1>
        <p className="page-lead">That URL is not part of this site.</p>
        <a href="/" className="btn-primary mt-8">
          Back home
        </a>
      </section>
    );
  }
  return (
    <section>
      <h1 className="page-title">Something went wrong</h1>
      <p className="page-lead">Try again, or go back home.</p>
    </section>
  );
}
