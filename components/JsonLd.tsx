/**
 * Renders schema.org JSON-LD as a server-rendered <script> tag.
 * "<" is escaped so that product text can never break out of the script element.
 */
export default function JsonLd({ data }: { data: Record<string, unknown> | Array<Record<string, unknown>> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  );
}
