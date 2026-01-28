export type EventItem = {
    id: string;
    title: string;
    date: string;            // ISO
    country: "Sri Lanka" | "China";
    city: string;
    venue: string;
    poster: string;          // full URL
    tags?: string[];
  };
  
  // Stable poster generator (no API key, super reliable)
  const poster = (seed: string, w = 900, h = 600) =>
    `https://picsum.photos/seed/${encodeURIComponent(seed)}/${w}/${h}`;
  
  export const EVENTS: EventItem[] = [
    {
      id: "sl-webinar-01",
      title: "Digital Docs & E-AWB Best Practices",
      date: "2025-08-30",
      country: "Sri Lanka",
      city: "Colombo",
      venue: "Online",
      poster: poster("e-awb-webinar"),
      tags: ["Webinar"],
    },
    {
      id: "cn-expo-01",
      title: "Shanghai Logistics Expo",
      date: "2025-09-22",
      country: "China",
      city: "Shanghai",
      venue: "NECC Shanghai",
      poster: poster("shanghai-logistics-expo"),
      tags: ["Expo", "Exhibition"],
    },
    {
      id: "cn-workshop-02",
      title: "Cold Chain Masterclass",
      date: "2025-10-03",
      country: "China",
      city: "Shanghai",
      venue: "Jingan Center",
      poster: poster("cold-chain-masterclass"),
      tags: ["Training"],
    },
    {
      id: "sl-conf-01",
      title: "GLS Regional Meetup – South Asia",
      date: "2025-10-18",
      country: "Sri Lanka",
      city: "Colombo",
      venue: "Shangri-La Ballroom",
      poster: poster("regional-meetup-colombo"),
      tags: ["Networking", "Panel"],
    },
    {
      id: "sl-workshop-01",
      title: "Customs & Compliance Workshop",
      date: "2025-11-05",
      country: "Sri Lanka",
      city: "Colombo",
      venue: "BMICH Hall B",
      poster: poster("customs-compliance"),
      tags: ["Training"],
    },
    {
      id: "cn-meetup-01",
      title: "East Asia Forwarders Meetup",
      date: "2025-12-02",
      country: "China",
      city: "Shenzhen",
      venue: "Futian Convention Center",
      poster: poster("east-asia-meetup"),
      tags: ["Networking"],
    },
  ];
  
  // Months present in EVENTS (e.g. "2025-09")
  export const EVENT_MONTHS = Array.from(
    new Set(
      EVENTS.map((e) => {
        const d = new Date(e.date);
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      })
    )
  ).sort();
  