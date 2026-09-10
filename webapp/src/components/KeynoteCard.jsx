import { useMemo } from "react";

function getInitials(name = "") {
  const parts = name.trim().split(" ").filter(Boolean);
  if (parts.length === 0) return "K";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
}

function getImageSrc(speaker) {
  // fetchKeynoteSpeakers provides `photo`; keep legacy aliases as fallback.
  const imageValue = speaker.photo || speaker.image || speaker.imageData || "";
  if (!imageValue || typeof imageValue !== "string") return null;
  if (
    imageValue.startsWith("data:") ||
    imageValue.startsWith("http") ||
    imageValue.startsWith("/")
  ) {
    return imageValue;
  }
  return `data:image/jpeg;base64,${imageValue}`;
}

export default function KeynoteCard({ speaker, onReadBio }) {
  const imageSrc = useMemo(() => getImageSrc(speaker), [speaker]);
  const title =
    speaker.title ||
    speaker.role ||
    speaker.position ||
    speaker.profession ||
    "";
  const institution =
    speaker.institution || speaker.affiliation || speaker.company || "";

  return (
    <article
      className="keynote-speaker-card"
      onClick={onReadBio}
      role="button"
      tabIndex={0}
      aria-label={`View biography of ${speaker.name || "speaker"}`}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onReadBio();
        }
      }}
    >
      <div className="keynote-card-cover" aria-hidden="true">
        <span className="keynote-card-orb keynote-card-orb-1" />
        <span className="keynote-card-orb keynote-card-orb-2" />
      </div>
      <div className="keynote-speaker-avatar">
        {imageSrc ? (
          <img src={imageSrc} alt={speaker.name || "Speaker image"} />
        ) : (
          <span>{getInitials(speaker.name || "Speaker")}</span>
        )}
      </div>

      <div className="keynote-speaker-copy">
        <h2>{speaker.name || "Unknown Speaker"}</h2>
        {title ? <p className="keynote-speaker-title">{title}</p> : null}
        {institution ? (
          <div className="keynote-speaker-institution">{institution}</div>
        ) : null}
      </div>
    </article>
  );
}
