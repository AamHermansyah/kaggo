/**
 * Content model for the About, Terms and Privacy pages.
 *
 * The client supplied these as prose. Keeping them as data rather than JSX
 * means one renderer styles all three consistently, and a copy revision is a
 * text edit instead of a markup edit.
 *
 * The source document spells the brand "MyKagggo" in body copy while its own
 * title, the app and the domain use "MyKaggo". Display copy here is normalised
 * to "MyKaggo"; contact details are reproduced exactly as supplied.
 */

export type Block =
  | { type: "p"; text: string; strong?: boolean }
  | { type: "ul"; items: string[] }
  | { type: "h3"; text: string }

export interface Section {
  heading?: string
  blocks: Block[]
}

export interface LegalDocument {
  title: string
  /** Rendered under the title, e.g. "Dated: 25 August 2026 - Version 1.0". */
  meta?: string
  intro?: string[]
  sections: Section[]
}
