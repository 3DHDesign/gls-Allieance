// src/types/event.ts (new file)
export type EventItemUI = {
    id: number;
    slug: string;
    title: string;
    venue: string;
    city: string;
    country: string;
    date: string; // start_date
    poster: string; // banner image or fallback
    tags?: string[];
    intro?: string;
    dateRange?: string;
    timeRange?: string;
    fullAddress?: string;
    registrationUrl?: string;
    website?: string;
    contactEmail?: string;
    contactPhone?: string;
    description?: string;
  };
  