import http from "./http";

export type ContactDetailsResponse = {
  success: boolean;
  status: number;
  message: string;
  data: {
    who_we_are: { title: string; description: string };
    vision: { title: string; description: string };
    mission: { title: string; description: string };

    global_contact: {
      phones: string[];
      emails: string[];
    };

    offices: Array<{
      id: number;
      office_name: string;
      company_name: string;
      address_lines: string[];
      phones: string[];
      emails: string[];
    }>;

    registered_office: {
      title: string;
      address: string[];
    };
  };
};

export async function getContactDetails() {
  const res = await http.get<ContactDetailsResponse>("/contact-details");
  return res.data;
}
