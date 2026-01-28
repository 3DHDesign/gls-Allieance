// types + demo data for 2 countries

export type Forwarder = {
    id: string;
    name: string;
    country: "Sri Lanka" | "China";
    city: string;
    years?: number;           // membership age (optional)
    tags?: string[];          // e.g., ["WCA", "CASS", "PP", "QS"]
    url?: string;
  };
  
  export const FORWARDERS: Forwarder[] = [
    // —— Sri Lanka ——
    {
      id: "sl-advantis",
      name: "Advantis Freight (Pvt) Ltd.",
      country: "Sri Lanka",
      city: "Colombo",
      years: 5,
      tags: ["WCA", "CASS", "PP", "QS"],
      url: "#",
    },
    {
      id: "sl-aitken",
      name: "Aitken Spence Cargo (Pvt) Ltd.",
      country: "Sri Lanka",
      city: "Colombo",
      years: 7,
      tags: ["Affinity", "WCA"],
      url: "#",
    },
    {
      id: "sl-asb",
      name: "ASB Logistics (Private) Limited",
      country: "Sri Lanka",
      city: "Colombo",
      years: 2,
      tags: ["PP", "QS"],
      url: "#",
    },
  
    // —— China ——
    {
      id: "cn-shanghai-star",
      name: "Shanghai Star Logistics Co., Ltd.",
      country: "China",
      city: "Shanghai",
      years: 8,
      tags: ["WCA", "IFC"],
      url: "#",
    },
    {
      id: "cn-shenzhen-link",
      name: "Shenzhen Link Freight Co., Ltd.",
      country: "China",
      city: "Shenzhen",
      years: 4,
      tags: ["PP"],
      url: "#",
    },
  ];
  
  export const COUNTRIES = ["Sri Lanka", "China"] as const;
  
  export const CITY_MAP: Record<(typeof COUNTRIES)[number], string[]> = {
    "Sri Lanka": ["Colombo"],
    China: ["Shanghai", "Shenzhen"],
  };
  