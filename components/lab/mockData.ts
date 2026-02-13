import type { LabData } from "@/components/lab/types";

export const mockLabData: LabData = {
  liveTrack: {
    track: "Marksmen (feat. Ka)",
    artist: "Roc Marciano",
    albumArt: "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/9c/1a/7a/9c1a7a63-bc84-bf6f-5d3e-7cc317f6a262/196588248004.jpg/600x600bb.jpg",
    url: "#",
    isPlaying: true,
    playedAt: "2026-02-13T00:40:00-05:00"
  },
  lastFilm: {
    title: "Ex Machina",
    rating: "★★★★",
    posterUrl: "https://a.ltrbxd.com/resized/film-poster/5/3/4/6/6/53466-ex-machina-0-1000-0-1500-crop.jpg?v=da8f3af9a5",
    letterboxdUrl: "https://letterboxd.com/film/ex-machina/"
  },
  thinking: "how to make personal websites feel alive without feeling noisy.",
  status: {
    type: "event",
    title: "Knicks watch tonight",
    subtitle: "Pulling up with laptop + notes in hand.",
    time: "Tonight 8:00 PM",
    location: "Lower East Side",
    ctaLabel: "Say hi",
    ctaUrl: "#",
    emoji: "🍺",
    startsAtIso: "2026-02-13T20:00:00-05:00"
  },
  onTap: [
    {
      tag: "watch",
      title: "Mann summer in full effect",
      url: "https://letterboxd.com/",
      commentary: "Dialing in a run of precision, heat, and city-light paranoia."
    },
    {
      tag: "link",
      title: "A clean systems note",
      url: "https://www.robinsloan.com/",
      commentary: "Reference architecture for writing that still feels human."
    },
    {
      tag: "drop",
      title: "Quiet deploy philosophy",
      url: "#",
      commentary: "Ship small, watch real behavior, then widen the aperture."
    }
  ],
  writing: [
    {
      id: "1",
      title: "More To Come",
      slug: "more-to-come",
      excerpt: "Skii yeee. Building the archive in public and tightening the signal.",
      publishedAt: "2026-02-10"
    },
    {
      id: "2",
      title: "One Beer Blogs",
      slug: "one-beer-blogs",
      excerpt: "Coming SOOOON",
      publishedAt: "2026-02-04"
    }
  ],
  films: [
    {
      title: "Ex Machina",
      rating: "★★★★",
      posterUrl: "https://a.ltrbxd.com/resized/film-poster/5/3/4/6/6/53466-ex-machina-0-1000-0-1500-crop.jpg?v=da8f3af9a5",
      letterboxdUrl: "https://letterboxd.com/film/ex-machina/"
    },
    {
      title: "Vanilla Sky",
      rating: "★★★★",
      posterUrl: "https://a.ltrbxd.com/resized/film-poster/4/8/5/7/9/48579-vanilla-sky-0-1000-0-1500-crop.jpg?v=2bd04377fd",
      letterboxdUrl: "https://letterboxd.com/film/vanilla-sky/"
    },
    {
      title: "After Hours",
      rating: "★★★½",
      posterUrl: "https://a.ltrbxd.com/resized/sm/upload/4f/wr/xy/7n/afterhours-0-1000-0-1500-crop.jpg?v=2f2bd5549e",
      letterboxdUrl: "https://letterboxd.com/film/after-hours/"
    },
    {
      title: "Shiva Baby",
      rating: "★★★",
      posterUrl: "https://a.ltrbxd.com/resized/film-poster/5/5/8/6/0/2/558602-shiva-baby-0-1000-0-1500-crop.jpg?v=11f3d2643d",
      letterboxdUrl: "https://letterboxd.com/film/shiva-baby/"
    }
  ]
};
