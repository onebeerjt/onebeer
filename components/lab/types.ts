export type LabStatus = {
  id?: string;
  type: "event" | "vibe" | "drop" | "open-invite";
  title: string;
  subtitle?: string;
  time?: string;
  location?: string;
  ctaLabel?: string;
  ctaUrl?: string;
  emoji?: string;
  startsAtIso?: string;
};

export type StatusInput =
  | string
  | {
      type?: LabStatus["type"];
      title?: string;
      message?: string;
      text?: string;
      subtitle?: string;
      time?: string;
      location?: string;
      ctaLabel?: string;
      ctaUrl?: string;
      emoji?: string;
      startsAtIso?: string;
    };

export type LabOnTapItem = {
  tag: "link" | "note" | "drop" | "watch";
  title: string;
  url: string;
  commentary: string;
};

export type LabWritingItem = {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  publishedAt?: string | null;
};

export type LabFilmItem = {
  title: string;
  rating?: string;
  posterUrl?: string;
  letterboxdUrl: string;
};

export type LabTrackItem = {
  track: string;
  artist: string;
  albumArt?: string;
  url?: string;
  isPlaying?: boolean;
  playedAt?: string;
};

export type LabData = {
  liveTrack: LabTrackItem | null;
  lastFilm: LabFilmItem | null;
  thinking: string;
  status: LabStatus;
  statusHistory: LabStatus[];
  onTap: LabOnTapItem[];
  writing: LabWritingItem[];
  films: LabFilmItem[];
};
