// src/components/Resources/UsefulLinksSection.tsx
import React from "react";
import { FiExternalLink } from "react-icons/fi";
import { FaBookOpen, FaShieldAlt, FaTools, FaGlobeAsia } from "react-icons/fa";

type LinkItem = {
  label: string;
  href: string;
};

type LinkGroup = {
  title: string;
  icon: React.ReactNode;
  items: LinkItem[];
};

const groups: LinkGroup[] = [
  {
    title: "Shipping & Trade Information",
    icon: <FaBookOpen className="text-[var(--color-accent)] text-lg" />,
    items: [
      { label: "Acronyms", href: "https://www.wcaworld.com/ResourceCenter/Detail/1" },
      { label: "Glossary of Shipping Terms", href: "https://www.oocl.com/eng/resourcecenter/shippinglossary/Pages/default.aspx" },
      { label: "Incoterms", href: "https://www.wcaworld.com/ResourceCenter/Detail/13" },
      { label: "Forwarder Law", href: "https://www.forwarderlaw.com" },
      { label: "Hazmat Definitions", href: "https://www.wcaworld.com/ResourceCenter/Detail/12" },
      { label: "Freighters", href: "https://www.avcodes.co.uk" },
      { label: "WTO World Trade Statistics", href: "https://www.wto.org" },
      { label: "Trade Information Resources", href: "https://www.wcaworld.com/ResourceCenter/Detail/18" },
    ],
  },
  {
    title: "Regulatory & Compliance",
    icon: <FaShieldAlt className="text-[var(--color-accent)] text-lg" />,
    items: [
      { label: "Customs", href: "https://www.wcaworld.com/ResourceCenter/Detail/6" },
      { label: "Federal Maritime Commission (FMC)", href: "https://www.fmc.gov" },
      { label: "Office of Foreign Asset Control (OFAC)", href: "https://sanctionssearch.ofac.treas.gov" },
      { label: "U.S. Government CSL Search", href: "https://www.trade.gov/data-visualization/csl-search" },
      { label: "Visa & Health (IATA Travel Centre)", href: "https://www.iatatravelcentre.com" },
    ],
  },
  {
    title: "Converters & Utilities",
    icon: <FaTools className="text-[var(--color-accent)] text-lg" />,
    items: [
      { label: "Currencies Converter (XE)", href: "https://www.xe.com/currencyconverter/" },
      { label: "Metric Converter", href: "https://www.worldwidemetric.com" },
      { label: "World Clock", href: "https://www.timeanddate.com/worldclock" },
      { label: "Weather", href: "https://www.weather.com" },
      { label: "World Map", href: "https://www.wcaworld.com/ResourceCenter/Detail/25" },
      { label: "Industry News", href: "https://www.wcaworld.com/ResourceCenter/Detail/14" },
      { label: "News and Current Events", href: "https://www.wcaworld.com/ResourceCenter/Detail/17" },
      { label: "World Holiday", href: "https://www.earthcalendar.net" },
    ],
  },
  {
    title: "Country & Contact Tools",
    icon: <FaGlobeAsia className="text-[var(--color-accent)] text-lg" />,
    items: [
      { label: "Internet Country Codes (IANA)", href: "https://www.iana.org/cctld/cctld-whois.htm" },
      { label: "World Airports", href: "https://www.airportinformation.com" },
      { label: "Worldwide Phone Directory", href: "https://www.the-acr.com" },
      { label: "Embassy Worldwide", href: "https://embassyworld.com" },
      { label: "AMS Port Name", href: "https://www.wcaworld.com/ResourceCenter/Detail/4" },
      { label: "Air/Ocean Freight Container", href: "https://www.wcaworld.com/ResourceCenter/Detail/2" },
      { label: "Airfreight Container", href: "https://www.wcaworld.com/ResourceCenter/Detail/3" },
    ],
  },
];

export const UsefulLinksSection: React.FC = () => {
  const isExternal = (href: string) => href.startsWith("http");

  return (
    <section className="bg-[var(--color-primary)]">
      <div className="container py-12 md:py-16">
        <header className="mb-8 md:mb-10">
          <h2 className="text-3xl md:text-4xl font-semibold text-[#111]">
            Useful Links
          </h2>
          <p className="mt-3 max-w-2xl text-[var(--color-muted)]">
            Quick access to external tools and references commonly used in day-to-day
            freight forwarding and logistics.
          </p>
        </header>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {groups.map((group) => (
            <div
              key={group.title}
              className="rounded-2xl border border-black/10 bg-white shadow-sm hover:shadow-md transition overflow-hidden"
            >
              <div className="flex items-start justify-between gap-4 p-6 border-b border-black/5">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-white/70 border border-black/10 flex items-center justify-center">
                    {group.icon}
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-[#111] leading-snug">
                      {group.title}
                    </h3>
                    <p className="text-sm text-[var(--color-muted)] mt-1">
                      {group.items.length} resources
                    </p>
                  </div>
                </div>

                <span className="h-2 w-2 rounded-full bg-[var(--color-accent)] mt-2" />
              </div>

              <ul className="p-4 md:p-5 grid grid-cols-1 sm:grid-cols-2 gap-2">
                {group.items.map((item) => {
                  const external = isExternal(item.href);
                  return (
                    <li key={item.label}>
                      <a
                        href={item.href}
                        target={external ? "_blank" : "_self"}
                        rel={external ? "noreferrer" : undefined}
                        className="group flex items-center justify-between gap-3 rounded-xl px-3 py-2
                                   text-[var(--color-muted)] hover:text-[var(--color-accent)]
                                   hover:bg-black/5 transition"
                      >
                        <span className="text-sm font-medium">{item.label}</span>
                        {external && (
                          <FiExternalLink className="opacity-60 group-hover:opacity-100 transition" />
                        )}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
