export type HomePost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  publishedAt: string | null;
  subject?: string;
  preview?: string;
  imageUrl?: string;
};

export type HomeFilm = {
  title: string;
  year?: string;
  rating?: string;
  letterboxdUrl: string;
  watchedAt?: string;
  posterUrl?: string;
  reviewSnippet?: string;
};

export type HomeTrack = {
  track: string;
  artist: string;
  album?: string;
  albumArt?: string;
  isPlaying: boolean;
  playedAt?: string;
};

export type HomeData = {
  posts: HomePost[];
  films: HomeFilm[];
  tracks: HomeTrack[];
};
