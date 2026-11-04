import { Facebook, Instagram, Music2, Youtube } from "lucide-react";

const destinations = [
  { name: "Instagram", href: "https://www.instagram.com/", Icon: Instagram },
  { name: "Facebook", href: "https://www.facebook.com/", Icon: Facebook },
  { name: "TikTok", href: "https://www.tiktok.com/upload", Icon: Music2 },
  { name: "YouTube", href: "https://www.youtube.com/upload", Icon: Youtube },
];

/**
 * Opens the selected social platform's own posting surface.
 * The user uploads the downloaded creative there; direct publishing requires
 * separately approved OAuth/API integrations for each platform.
 */
export function SocialPostLinks() {
  return (
    <div className="mt-3 border-t pt-3">
      <p className="text-xs font-semibold text-muted-foreground">Post your ad</p>
      <div className="mt-2 flex items-center gap-2">
        {destinations.map(({ name, href, Icon }) => (
          <a
            key={name}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Open ${name} to post your ad`}
            title={`Open ${name}`}
            className="grid size-9 place-items-center rounded-full border bg-background text-muted-foreground transition-colors hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <Icon className="size-4" />
          </a>
        ))}
      </div>
      <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">
        Download your creative first, then upload it on the platform. Automatic publishing will be available after account authorization and platform approval.
      </p>
    </div>
  );
}
