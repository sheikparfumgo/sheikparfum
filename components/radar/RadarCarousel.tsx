type RadarCarouselProps = {
    children: React.ReactNode
}

export default function RadarCarousel({
    children
}: RadarCarouselProps) {
    return (
        <div
            className="
      flex
      gap-4
      overflow-x-auto
      pb-2
      scrollbar-hide
      "
        >
            {children}
        </div>
    )
}