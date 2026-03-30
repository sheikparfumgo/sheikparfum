import ClosetCard from "@/components/lista/ClosetCard"
import { Perfume } from "@/types/perfume"

type Props = {
    title: string
    perfumes: Perfume[]
}

export default function ClosetSection({ title, perfumes }: Props) {

    return (
        <div className="space-y-4">

            <h2 className="text-lg font-bold">
                {title}
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-4">

                {perfumes.map((p) => (
                    <ClosetCard key={p.id} perfume={p} />
                ))}

            </div>

        </div>
    )
}