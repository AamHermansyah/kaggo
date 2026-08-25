import type { LegalDocument } from "./types"

export const PRIVACY: LegalDocument = {
  title: "Privacy Policy",
  meta: "Dated 25 August 2026 · Version 1.0",
  sections: [
    {
      heading: "1. Introduction",
      blocks: [
        {
          type: "p",
          text: 'MyKaggo ("MyKaggo", "we", "us", or "our") is committed to protecting your privacy and ensuring the security of your personal data.',
        },
        {
          type: "p",
          text: 'This Privacy Policy explains how we collect, use, disclose, store, and protect personal information when you access or use the MyKaggo platform, including our web application, mobile interfaces, APIs, notifications, and related services (collectively, the "Platform").',
        },
        {
          type: "p",
          text: 'This Policy applies to all users ("Users", "you", or "your") located in Nigeria or otherwise accessing MyKaggo services.',
        },
        {
          type: "p",
          text: "By using MyKaggo, you consent to the practices described in this Privacy Policy.",
        },
      ],
    },
    {
      heading: "2. Regulatory Compliance",
      blocks: [
        { type: "p", text: "MyKaggo processes personal data in compliance with:" },
        {
          type: "ul",
          items: [
            "The Nigeria Data Protection Regulation (NDPR)",
            "Applicable Nigerian laws and regulations",
            "International best practices for data protection and privacy",
          ],
        },
      ],
    },
    {
      heading: "3. Information We Collect",
      blocks: [
        { type: "h3", text: "3.1 Information You Provide Directly" },
        {
          type: "p",
          text: "When you register or use MyKaggo, we may collect:",
        },
        {
          type: "ul",
          items: [
            "Full name",
            "Phone number",
            "Email address",
            "Account role (User / Driver / Business)",
            "Vehicle information (e.g. number plate)",
            "Package listing details (city, destination, reference IDs)",
            "Customer support communications",
          ],
        },
        { type: "h3", text: "3.2 Location & Trip Data" },
        { type: "p", text: "To provide tracking services, we may collect:" },
        {
          type: "ul",
          items: [
            "Approximate or real-time GPS location data",
            "City-level and sub-city movement data",
            "Trip start and end timestamps",
            "Vehicle movement patterns and clustering data",
          ],
        },
        {
          type: "p",
          text: "MyKaggo focuses on city-level and route-level tracking, not continuous personal surveillance.",
        },
        { type: "h3", text: "3.3 Automatically Collected Information" },
        { type: "p", text: "We may automatically collect:" },
        {
          type: "ul",
          items: [
            "IP address",
            "Device type, operating system, browser",
            "Log data (access times, API usage)",
            "Cookies and similar technologies",
          ],
        },
        { type: "h3", text: "3.4 Third-Party Data Sources" },
        { type: "p", text: "We may receive limited data from:" },
        {
          type: "ul",
          items: [
            "Mapping providers (Google Maps, Mapbox, OpenStreetMap)",
            "Payment providers (if wallet features are enabled)",
            "Notification services (SMS, email, push notifications)",
          ],
        },
      ],
    },
    {
      heading: "4. How We Use Your Information",
      blocks: [
        { type: "p", text: "We use personal data to:" },
        {
          type: "ul",
          items: [
            "Create and manage user accounts",
            "Enable package listing and tracking",
            "Monitor trips and vehicle movement",
            "Power clustering and geofencing logic",
            "Send notifications and alerts",
            "Improve platform performance and security",
            "Comply with legal and regulatory obligations",
          ],
        },
        { type: "p", text: "We do not sell your personal data.", strong: true },
      ],
    },
    {
      heading: "5. Location Data Usage",
      blocks: [
        {
          type: "p",
          text: "By using MyKaggo, you acknowledge and consent that:",
        },
        {
          type: "ul",
          items: [
            "Location data may be collected during trips",
            "Location is used to determine movement, city entry, and arrival status",
            "Location data may be shared with relevant users for tracking visibility",
          ],
        },
        {
          type: "p",
          text: "MyKaggo does not track users outside active trips.",
        },
      ],
    },
    {
      heading: "6. Sharing of Information",
      blocks: [
        { type: "p", text: "We may share your data only with:" },
        { type: "h3", text: "6.1 Other Users" },
        {
          type: "ul",
          items: [
            'Limited trip status (e.g. "bus has entered Yaba")',
            "No personal contact details without consent",
          ],
        },
        { type: "h3", text: "6.2 Service Providers" },
        {
          type: "ul",
          items: [
            "Cloud hosting providers",
            "Mapping and geolocation services",
            "Notification and communication platforms",
          ],
        },
        { type: "h3", text: "6.3 Legal & Regulatory Authorities" },
        {
          type: "ul",
          items: ["Where required by law, court order, or regulation"],
        },
      ],
    },
    {
      heading: "7. Third-Party Services",
      blocks: [
        {
          type: "p",
          text: "MyKaggo integrates with third-party services including:",
        },
        {
          type: "ul",
          items: [
            "Google Maps (geocoding)",
            "Mapbox (routes and static maps)",
            "OpenStreetMap (geofencing and parks data)",
          ],
        },
        {
          type: "p",
          text: "These providers process data under their own privacy policies. MyKaggo is not responsible for third-party privacy practices.",
        },
      ],
    },
    {
      heading: "8. Data Retention",
      blocks: [
        {
          type: "p",
          text: "We retain personal data only for as long as necessary to:",
        },
        {
          type: "ul",
          items: [
            "Provide the Service",
            "Fulfil legal and regulatory obligations",
            "Resolve disputes and enforce agreements",
          ],
        },
        {
          type: "p",
          text: "Location and trip data may be anonymised or aggregated after use.",
        },
      ],
    },
    {
      heading: "9. Data Security",
      blocks: [
        { type: "p", text: "We implement appropriate safeguards including:" },
        {
          type: "ul",
          items: [
            "Encrypted data transmission",
            "Secure cloud infrastructure",
            "Role-based access control",
            "Regular system monitoring",
          ],
        },
        { type: "p", text: "Despite our efforts, no system is 100% secure." },
      ],
    },
    {
      heading: "10. Your Data Rights",
      blocks: [
        { type: "p", text: "Subject to applicable law, you may:" },
        {
          type: "ul",
          items: [
            "Request access to your personal data",
            "Request correction of inaccurate data",
            "Request deletion of your data",
            "Withdraw consent (where applicable)",
            "Object to certain processing activities",
          ],
        },
        {
          type: "p",
          text: "Requests can be made via the contact details below.",
        },
      ],
    },
    {
      heading: "11. Cookies & Tracking Technologies",
      blocks: [
        { type: "p", text: "MyKaggo uses cookies to:" },
        {
          type: "ul",
          items: [
            "Maintain sessions",
            "Improve performance",
            "Analyse usage trends",
          ],
        },
        { type: "p", text: "You may control cookies via your browser settings." },
      ],
    },
    {
      heading: "12. Children's Privacy",
      blocks: [
        {
          type: "p",
          text: "MyKaggo is not intended for users under 18 years. We do not knowingly collect data from minors.",
        },
      ],
    },
    {
      heading: "13. International Data Transfers",
      blocks: [
        {
          type: "p",
          text: "Where necessary, data may be processed on servers outside Nigeria, subject to appropriate safeguards and NDPR compliance.",
        },
      ],
    },
    {
      heading: "14. Changes to This Privacy Policy",
      blocks: [
        {
          type: "p",
          text: "We may update this Privacy Policy periodically. Updates will be communicated via the Platform. Continued use constitutes acceptance.",
        },
      ],
    },
    {
      heading: "15. Disclaimer",
      blocks: [
        {
          type: "p",
          text: "MyKaggo is a tracking and coordination platform only. We are not responsible for:",
        },
        {
          type: "ul",
          items: [
            "Physical handling of packages",
            "Conduct of drivers or transport operators",
            "Loss, theft, or damage during transport",
          ],
        },
      ],
    },
  ],
}
