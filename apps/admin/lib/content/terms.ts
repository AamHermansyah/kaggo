import type { LegalDocument } from "./types"

export const TERMS: LegalDocument = {
  title: "Terms and Conditions",
  meta: "Dated 25 August 2026 · Version 1.0",
  sections: [
    {
      heading: "1. Introduction",
      blocks: [
        { type: "p", text: "Welcome to MyKaggo." },
        {
          type: "p",
          text: 'These Terms and Conditions ("Terms") govern your access to and use of MyKaggo, including our web application, mobile-responsive website, APIs, notifications, and any related services, features, updates, or future developments (collectively, the "Platform" or "Service").',
        },
        {
          type: "p",
          text: "MyKaggo is a logistics coordination and tracking platform designed to help users list packages, track package movement, and monitor trips at city or town level using shared transport systems such as buses, vehicles, and drivers operating within Nigeria.",
        },
        {
          type: "p",
          text: "By accessing or using MyKaggo, you agree to be bound by these Terms. If you do not agree, you must not access or use the Platform.",
        },
      ],
    },
    {
      heading: "2. Definitions",
      blocks: [
        {
          type: "ul",
          items: [
            '"MyKaggo", "we", "us", "our" refers to Rovasoft Tech Solutions Ltd and its affiliates.',
            '"User", "you", "your" refers to any individual or business registered on MyKaggo.',
            '"Package" means any permitted item listed on MyKaggo for tracking.',
            '"Trip" refers to a vehicle journey identified by a number plate and route.',
            '"Driver" refers to a person operating a vehicle whose trip is tracked on MyKaggo.',
            '"Third-Party Transport" means buses, vehicles, or transport services not owned or operated by MyKaggo.',
            '"Territory" means the Federal Republic of Nigeria, unless stated otherwise.',
          ],
        },
      ],
    },
    {
      heading: "3. Nature of MyKaggo Service",
      blocks: [
        { type: "p", text: "MyKaggo DOES NOT:", strong: true },
        {
          type: "ul",
          items: [
            "Own vehicles or buses",
            "Employ drivers or passengers",
            "Carry, store, handle, or physically transport packages",
            "Guarantee delivery, speed, safety, or condition of packages",
          ],
        },
        { type: "p", text: "MyKaggo ONLY:", strong: true },
        {
          type: "ul",
          items: [
            "Provides a digital tracking, listing, and trip-monitoring platform",
            "Aggregates trip data based on vehicle movement and clustering",
            "Notifies users of estimated progress and city-level arrival events",
          ],
        },
        {
          type: "p",
          text: "All physical transportation is conducted independently by third-party drivers, passengers, or transport operators.",
        },
      ],
    },
    {
      heading: "4. Eligibility to Use MyKaggo",
      blocks: [
        { type: "h3", text: "4.1 Individual Users" },
        { type: "p", text: "You must:" },
        {
          type: "ul",
          items: [
            "Be at least 18 years old",
            "Provide accurate registration information",
            "Consent to location and notification access where required",
          ],
        },
        { type: "h3", text: "4.2 Business Users" },
        { type: "p", text: "If registering as a business, you confirm:" },
        {
          type: "ul",
          items: [
            "You are legally registered",
            "You have authority to act on behalf of the business",
            "You comply with all applicable laws relating to logistics and customer data",
          ],
        },
        {
          type: "p",
          text: "MyKaggo may suspend or deny access at its sole discretion.",
        },
      ],
    },
    {
      heading: "5. User Accounts & Responsibilities",
      blocks: [
        {
          type: "ul",
          items: [
            "You are responsible for all activities under your account",
            "You must keep your login credentials secure",
            "You may only maintain one account unless expressly approved",
            "MyKaggo is not liable for unauthorized access caused by your negligence",
          ],
        },
      ],
    },
    {
      heading: "6. Package Listing Rules",
      blocks: [
        { type: "p", text: "When listing a package, you confirm that:" },
        {
          type: "ul",
          items: [
            "The package does not contain prohibited items",
            "The destination is entered at city or town level only",
            "The package is legally transferable under Nigerian law",
            "You understand MyKaggo does not verify package contents",
          ],
        },
        {
          type: "p",
          text: "Prohibited items include (but are not limited to):",
          strong: true,
        },
        {
          type: "ul",
          items: [
            "Currency, negotiable instruments, or securities",
            "Firearms, ammunition, explosives",
            "Drugs, narcotics, or controlled substances",
            "Hazardous, flammable, or radioactive materials",
            "Human remains, organs, or biological waste",
            "Pornographic or illegal materials",
          ],
        },
        {
          type: "p",
          text: "MyKaggo reserves the right to remove listings that violate these rules.",
        },
      ],
    },
    {
      heading: "7. Tracking & Location Data",
      blocks: [
        { type: "p", text: "By using MyKaggo, you consent to:" },
        {
          type: "ul",
          items: [
            "Collection of location data from drivers or devices linked to a trip",
            "City-level geofencing and movement detection",
            "Sharing limited trip status with relevant users",
          ],
        },
        {
          type: "p",
          text: "MyKaggo uses mapping services (Google Maps, Mapbox, OpenStreetMap) only to provide tracking insights, not precise navigation or delivery guarantees.",
        },
      ],
    },
    {
      heading: "8. Trips, Clustering & Estimates",
      blocks: [
        {
          type: "ul",
          items: [
            "Trips may involve multiple users tracking the same vehicle",
            "Tracking is based on vehicle movement patterns, not constant GPS precision",
            "Estimated arrival times and locations are indicative only",
            "Delays, route changes, or trip termination may occur without notice",
          ],
        },
        { type: "p", text: "MyKaggo does not guarantee:", strong: true },
        {
          type: "ul",
          items: [
            "Exact arrival time",
            "Continuous location accuracy",
            "Completion of any trip",
          ],
        },
      ],
    },
    {
      heading: "9. Drivers",
      blocks: [
        { type: "p", text: "Drivers using MyKaggo:" },
        {
          type: "ul",
          items: [
            "Consent to movement-based tracking",
            "Acknowledge MyKaggo does not control routes or behavior",
          ],
        },
        {
          type: "p",
          text: "Drivers remain solely responsible for compliance with traffic, safety, and transport laws.",
        },
      ],
    },
    {
      heading: "10. Fees & Payments",
      blocks: [
        {
          type: "ul",
          items: [
            "Certain features may attract fees",
            "Refunds are subject to system rules and eligibility",
            "MyKaggo is not a bank or financial institution",
          ],
        },
      ],
    },
    {
      heading: "11. Data Privacy",
      blocks: [
        {
          type: "p",
          text: "Your data is processed in accordance with the MyKaggo Privacy Policy, applicable Nigerian data protection laws, and NDPR guidelines.",
        },
      ],
    },
    {
      heading: "12. Limitation of Liability",
      blocks: [
        {
          type: "p",
          text: "To the fullest extent permitted by law, MyKaggo shall not be liable for:",
        },
        {
          type: "ul",
          items: [
            "Loss, damage, theft, or delay of packages",
            "Actions or omissions of drivers, passengers, or transport operators",
            "Indirect, incidental, or consequential damages",
            "Business losses, missed opportunities, or reputational harm",
          ],
        },
      ],
    },
    {
      heading: "13. Indemnity",
      blocks: [
        { type: "p", text: "You agree to indemnify MyKaggo against all claims arising from:" },
        {
          type: "ul",
          items: [
            "Your misuse of the Platform",
            "Illegal package contents",
            "Breach of these Terms",
            "Third-party disputes related to trips or transport",
          ],
        },
      ],
    },
    {
      heading: "14. Termination",
      blocks: [
        { type: "p", text: "MyKaggo may suspend or terminate access:" },
        {
          type: "ul",
          items: [
            "For breach of these Terms",
            "For suspected fraud or misuse",
            "To comply with legal obligations",
          ],
        },
        { type: "p", text: "You may stop using MyKaggo at any time." },
      ],
    },
    {
      heading: "15. Changes to These Terms",
      blocks: [
        {
          type: "p",
          text: "We may update these Terms from time to time. Continued use of MyKaggo after updates constitutes acceptance.",
        },
      ],
    },
    {
      heading: "16. Governing Law",
      blocks: [
        {
          type: "p",
          text: "These Terms are governed by the laws of the Federal Republic of Nigeria. Disputes shall be subject to Nigerian courts.",
        },
      ],
    },
  ],
}
