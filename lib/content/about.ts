import type { LegalDocument } from "./types"

export const ABOUT: LegalDocument = {
  title: "About MyKaggo",
  intro: [
    "We exist because millions of Nigerians send packages without knowing where they are.",
  ],
  sections: [
    {
      blocks: [
        {
          type: "p",
          text: "Across Nigeria, people rely on local buses and transport companies to send packages between cities. Once a package is handed over, both the sender and receiver are left guessing until it arrives.",
        },
        {
          type: "p",
          text: "MyKaggo is bringing transparency to the system by giving real-time updates on the package location, no matter the route or bus used.",
        },
      ],
    },
    {
      heading: "MyKaggo Works For Everyone",
      blocks: [
        {
          type: "ul",
          items: [
            "Everyday Senders",
            "Dropshippers & SMEs",
            "Drivers & Transport Companies",
            "Corporates & Students",
          ],
        },
        {
          type: "p",
          text: "Built on transparency that protects everyone, MyKaggo brings trust to Nigeria's logistics.",
          strong: true,
        },
      ],
    },
  ],
}
