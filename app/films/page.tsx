import type { Metadata } from "next";
import CopyFilmTitlesButton from "@/components/copy-film-titles-button";
import { CriterionShelf } from "@/components/criterion-shelf";
import { getCatalogue } from "@/lib/letterboxd/catalogue";

export const metadata: Metadata = {
  title: "The Collection",
  description: "Every film JT has logged on Letterboxd."
};

export const revalidate = 3600;

const PER_SHELF = 20;

export default async function FilmsPage() {
  const films = await getCatalogue();
  const shelves = Array.from({ length: Math.ceil(films.length / PER_SHELF) }, (_, i) => films.slice(i * PER_SHELF, (i + 1) * PER_SHELF));

  return (
    <div className="py-12">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <span className="holo-bg inline-block border border-ink px-2 py-0.5 font-pixel text-[10px] uppercase">Arts &amp; culture</span>
          <h1 className="mt-4 text-[clamp(44px,7vw,88px)] font-bold leading-[0.95] tracking-[-0.02em]">The Collection</h1>
          <p className="mt-3 max-w-[52ch] text-[20px] italic text-graphite">
            {films.length} films from the Letterboxd diary, newest on the top shelf. Hover a spine to pull it out.
          </p>
        </div>
        <CopyFilmTitlesButton titles={films.map((film) => film.title)} />
      </div>

      {films.length === 0 ? (
        <p className="mt-12 border-y-2 border-ink py-10 text-center text-[20px] italic text-graphite">The shelf is empty.</p>
      ) : (
        <div className="-mx-4 mt-10 space-y-12 bg-ink px-4 py-12 sm:-mx-8 sm:px-8">
          {shelves.map((shelf, index) => (
            <div key={index}>
              <CriterionShelf films={shelf} showCatalogueLink={false} />
              <div aria-hidden className="holo-bg -mt-6 h-2" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
