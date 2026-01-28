// Extra details shown on the company inner page
export type ForwarderDetail = {
    id: string;
    overview?: string;
    enrolledSince?: string; // ISO date
    memberships?: Array<{
      code: string;        // short chip (e.g., "WCA")
      name: string;        // full name
      logo?: string;       // optional logo URL
      expires?: string;    // ISO date
    }>;
    address?: string[];    // multi-line address
    contacts?: {
      phone?: string;
      fax?: string;
      emergency?: string;
      website?: string;
      email?: string;
    };
    officeContacts?: Array<{
      name: string;
      title?: string;
      email?: string;
      phone?: string;
      mobile?: string;
      directLine?: string;
    }>;
    services?: string[];
    core?: string[];
    sectors?: string[];
  };
  
  export const FORWARDER_DETAILS: Record<string, ForwarderDetail> = {
    // Demo: one fully filled profile
    "cn-shanghai-star": {
      id: "cn-shanghai-star",
      overview:
        "Shanghai Star Logistics is a time-critical logistics specialist serving OEMs, airlines and MROs. We handle airfreight, OBC/charter, sea freight (FCL/LCL, tanktainer & break-bulk) and domestic freight (rail, trucking).",
      enrolledSince: "2017-01-28",
      memberships: [
        {
          code: "WCA",
          name: "WCA China Global",
          logo: "https://www.wcaworld.com/WCAlogo.png", // optional, any logo URL
          expires: "2026-01-27",
        },
        { code: "IFC", name: "International Freight Co-op" },
      ],
      address: [
        "Room 1208, Tower A, Pudong Logistics Center",
        "Jinxiu Road, Pudong",
        "Shanghai 200120, China",
      ],
      contacts: {
        phone: "+86 21 5555 1234",
        fax: "+86 21 5555 5678",
        emergency: "+86 139 0000 0000",
        website: "http://www.shstarlogistics.cn",
        email: "info@shstarlogistics.cn",
      },
      officeContacts: [
        {
          name: "Lina Wang",
          title: "Managing Director",
          email: "lina.wang@shstarlogistics.cn",
          phone: "+86 21 5555 1234",
          mobile: "+86 138 0000 0001",
          directLine: "+86 21 5555 0901",
        },
        {
          name: "Kevin Zhou",
          title: "Operations Manager",
          email: "kevin.zhou@shstarlogistics.cn",
          phone: "+86 21 5555 2233",
          mobile: "+86 139 0000 0002",
        },
      ],
      services: [
        "Airfreight",
        "OBC / Charter",
        "Sea Freight (FCL, LCL, Tanktainer, Break-bulk)",
        "Domestic Freight (Rail & Trucking)",
      ],
      core: ["Import", "Export", "Door-to-Door"],
      sectors: ["Aerospace", "Automotive", "Industrial"],
    },
  };
  