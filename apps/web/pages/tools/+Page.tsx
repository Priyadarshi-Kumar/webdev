import { Card, Eyebrow } from "@webdev/components";
import { tools } from "@webdev/tools";

export default function Page() {
  return (
    <section>
      <Eyebrow>Tools</Eyebrow>
      <h1 className="page-title">Browser utilities</h1>
      <p className="page-lead">
        Small converters that run on your machine. Paste data, get a result — nothing is sent to a server.
      </p>
      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {tools.map((tool) => (
          <Card key={tool.slug} href={`/tools/${tool.slug}`}>
            <h2 className="text-lg font-semibold tracking-tight">{tool.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">{tool.description}</p>
          </Card>
        ))}
      </div>
    </section>
  );
}
