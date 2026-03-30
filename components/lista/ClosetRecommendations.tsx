import { Perfume } from "@/types/perfume"
import ClosetCard from "@/components/lista/ClosetCard"

type Props = {
    perfumes?: Perfume[]
}

export default function ClosetRecommendations({ perfumes = [] }: Props) {

    if (!perfumes.length) {
        return (
            <div className="space-y-4">

                <h2 className="text-lg font-bold">
                    Recomendações
                </h2>

                <div className="bg-[#1c1c1e] p-6 rounded-xl text-sm text-gray-400">
                    Estamos aprendendo seu gosto.

                    Adicione mais perfumes ao closet
                    para receber recomendações personalizadas.
                </div>

            </div>
        )
    }

    return (
        <div className="space-y-4">

            <h2 className="text-lg font-bold">
                Recomendações
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-4">

                {perfumes.map((p) => (
                    <ClosetCard key={p.id} perfume={p} />
                ))}

            </div>

        </div>
    )
}