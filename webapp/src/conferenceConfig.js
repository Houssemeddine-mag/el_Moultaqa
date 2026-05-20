export const conferenceConfig = {
  brand: "ElMoultaqa",
  brandInitials: "EM",
  tagline: "Conference platform for modern hybrid events",
  name: "ElMoultaqa Conference 2026",
  primaryColor: "#614F96",
  logoUrl: "",
  streamUrl: "https://example.com/stream.m3u8",
  dates: "December 12-14, 2026",
  location: "Algiers · Hybrid",
  description:
    "ElMoultaqa brings together attendees, speakers, and organizers in one polished conference experience.",
  sponsors: [
    { label: "Global Events", color: "#9b4d9e" },
    { label: "LiveStream Pro", color: "#6d2a85" },
    { label: "Hybrid Works", color: "#8f5da8" },
  ],
  schedule: [
    {
      label: "Day 1",
      date: "Dec 12",
      sessions: [
        { time: "09:00", title: "Opening keynote", speaker: "Leila Haddad" },
        {
          time: "10:30",
          title: "Hybrid event design",
          speaker: "Samir Youssef",
        },
        {
          time: "14:00",
          title: "Community engagement",
          speaker: "Nadia Bensaid",
        },
      ],
    },
    {
      label: "Day 2",
      date: "Dec 13",
      sessions: [
        { time: "09:30", title: "Event analytics", speaker: "Amine Cherif" },
        { time: "11:00", title: "Speaker studio tips", speaker: "Farah Kacem" },
        { time: "15:00", title: "Networking labs", speaker: "Omar Benali" },
      ],
    },
    {
      label: "Day 3",
      date: "Dec 14",
      sessions: [
        {
          time: "10:00",
          title: "Scaling experiences",
          speaker: "Yasmine Djaffar",
        },
        { time: "11:30", title: "Roadmap reveal", speaker: "Karim Boudiaf" },
        {
          time: "16:00",
          title: "Closing conversation",
          speaker: "Sarah Delilah",
        },
      ],
    },
  ],
};
