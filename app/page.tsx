import PerfumeCard from "@/components/home/PerfumeCard"
import HeroSpotlight from "@/components/home/HeroSpotlight"
import InfoCarousel from "@/components/home/InfoCarousel"

export default function Home() {
  return (
    <div className="min-h-screen">

      <main className="mt-6 space-y-10">

        {/* HERO SPOTLIGHT */}
        <HeroSpotlight />

        {/* INFO CAROUSEL */}
        <InfoCarousel />

        {/* RECOMENDADOS */}
        <section>

          <div className="flex justify-between items-center mb-5">
            <h3 className="text-white font-bold text-lg">
              Recomendados para você
            </h3>
          </div>

          {/* Mobile scroll / Desktop grid */}
          <div className="relative">

            <div
              className="
    flex gap-4 overflow-x-auto pb-6
    snap-x snap-mandatory
    [-webkit-overflow-scrolling:touch]
    "
            >

              <div className="snap-start flex-shrink-0">
                <PerfumeCard
                  name="Interlude Black Iris"
                  brand="Amouage"
                  image="/perfume1.png"
                  notes={["Iris", "Oud", "Couro"]}
                  rating={4.8}
                  reviews={1243}
                  decantPrice={29}
                  bottlePrice={2450}
                  viral
                />
              </div>

              <div className="snap-start flex-shrink-0">
                <PerfumeCard
                  name="Alexandria II"
                  brand="Xerjoff"
                  image="/perfume2.png"
                  notes={["Lavanda", "Oud", "Rosa"]}
                  rating={4.9}
                  reviews={980}
                  decantPrice={35}
                  bottlePrice={3890}
                />
              </div>

            </div>

          </div>
        </section>

      </main>

    </div>
  )
}