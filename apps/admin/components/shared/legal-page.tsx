import { SupportLink } from "@/components/shared/support-link"
import { Separator } from "@/components/ui/separator"
import { COMPANY, SUPPORT } from "@/lib/site-config"
import type { Block, LegalDocument } from "@/lib/content/types"

function renderBlock(block: Block, key: number) {
  if (block.type === "h3") {
    return (
      <h3
        key={key}
        className="mt-4 text-[15px] font-semibold text-foreground"
      >
        {block.text}
      </h3>
    )
  }

  if (block.type === "ul") {
    return (
      <ul
        key={key}
        className="flex list-disc flex-col gap-1.5 ps-5 text-[14px] leading-relaxed text-foreground/75"
      >
        {block.items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    )
  }

  return (
    <p
      key={key}
      className={
        block.strong
          ? "text-[14px] leading-relaxed font-semibold text-foreground"
          : "text-[14px] leading-relaxed text-foreground/75"
      }
    >
      {block.text}
    </p>
  )
}

/**
 * One renderer for About, Terms and Privacy.
 *
 * All three are long-form prose in the same visual language, so they share a
 * layout rather than each page repeating heading and list styling.
 */
export function LegalPage({ document }: { document: LegalDocument }) {
  return (
    <article className="relative flex flex-1 flex-col overflow-x-hidden overflow-y-auto px-5 pt-6 pb-10">
      <header className="mb-6 flex shrink-0 flex-col gap-2">
        <h1 className="text-[24px] font-bold tracking-tight text-foreground">
          {document.title}
        </h1>
        {document.meta ? (
          <p className="text-[12px] text-muted-foreground">{document.meta}</p>
        ) : null}
        {document.intro?.map((line) => (
          <p
            key={line}
            className="text-[15px] leading-relaxed font-medium text-foreground/85"
          >
            {line}
          </p>
        ))}
      </header>

      <div className="flex flex-col gap-7">
        {document.sections.map((section, index) => (
          <section
            key={section.heading ?? index}
            className="flex flex-col gap-3"
          >
            {section.heading ? (
              <h2 className="text-[17px] font-semibold tracking-tight text-foreground">
                {section.heading}
              </h2>
            ) : null}
            {section.blocks.map(renderBlock)}
          </section>
        ))}
      </div>

      <Separator className="my-8" />

      <section className="flex flex-col gap-2">
        <h2 className="text-[15px] font-semibold text-foreground">Contact</h2>
        <p className="text-[14px] leading-relaxed text-foreground/75">
          {COMPANY.legalName}, {COMPANY.country}
        </p>
        <a
          href={`mailto:${SUPPORT.email}`}
          className="text-[14px] font-medium text-primary hover:underline"
        >
          {SUPPORT.email}
        </a>
        <p className="text-[14px] text-foreground/75">{SUPPORT.phone}</p>
        <p className="text-[13px] text-muted-foreground">
          Office hours: {COMPANY.officeHours}
        </p>
        <SupportLink className="mt-2 self-start" />
      </section>
    </article>
  )
}
