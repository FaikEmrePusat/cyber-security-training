import type { ReactNode } from "react";

export function Section({
  id,
  title,
  lead,
  children,
  as = "h2",
}: {
  id?: string;
  title: string;
  lead?: string;
  children: ReactNode;
  /** Page hero heading — prefer h1 once per route. */
  as?: "h1" | "h2";
}) {
  const Heading = as;
  return (
    <section id={id} className="section">
      <Heading className="section__title">{title}</Heading>
      {lead && <p className="section__lead section__lead--short">{lead}</p>}
      {children}
    </section>
  );
}
