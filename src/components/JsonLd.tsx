// Renders a JSON-LD structured-data block. Server-safe; injected into <head>-
// adjacent body per Next.js guidance. `data` is any schema.org object/graph.
export function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  return (
    <script
      type="application/ld+json"
      // JSON.stringify output is safe inside a script tag; escape the closing
      // sequence defensively in case any copy contains it.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
