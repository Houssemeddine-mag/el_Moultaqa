// ============================================================================
// Default sponsors — always displayed for every conference.
//
// 1. The conference itself (organizer): name + logo from the event.
// 2. El Moultaqa (platform): hardcoded logo + info.
//
// These are injected at the display layer (never written to the database),
// so they show up no matter what the conference is. Mark with isDefault so
// UIs can lock them (no edit/delete).
// ============================================================================

export const ELMOULTAQA_SPONSOR = {
  id: "default-elmoultaqa",
  name: "El Moultaqa",
  website: "https://elmoultaqa.com",
  tier: "platform",
  order: -1,
  isDefault: true,
};

export function getDefaultSponsors({
  conferenceName = "",
  conferenceLogo = "",
  conferenceWebsite = "",
  platformLogo = "",
} = {}) {
  return [
    {
      id: "default-conference",
      name: conferenceName || "Organizing Committee",
      website: conferenceWebsite || "",
      logoData: conferenceLogo || "",
      tier: "organizer",
      order: -2,
      isDefault: true,
    },
    {
      ...ELMOULTAQA_SPONSOR,
      logoData: platformLogo || "",
    },
  ];
}
