import { Perfume } from "@/types/perfume"

type Props = {
    perfumes: Perfume[]
}

export default function ClosetLowAlert({ perfumes }: Props) {

    const low = perfumes.filter(
        p => p.availableInStore === false
    )

    if (low.length === 0) return null

    return (

        <div className="space-y-3">

            {low.map(p => (
                <div
                    key={p.id}
                    className="bg-[#2a1f0d] border border-[#c9a34a]/40 rounded-xl p-4 flex justify-between items-center"
                >

                    <div>
                        <p className="text-[#c9a34a] font-semibold">
                            ⚠ {p.name} indisponível
                        </p>

                        <p className="text-sm text-gray-400">
                            Verifique opções disponíveis
                        </p>
                    </div>

                    <div className="flex gap-2">

                        {p.decantAvailable && (
                            <button className="bg-[#c9a34a] text-black px-3 py-1 rounded-lg text-sm">
                                Decant
                            </button>
                        )}

                        {p.bottleAvailable && (
                            <button className="bg-[#1c1c1e] border border-[#c9a34a]/30 px-3 py-1 rounded-lg text-sm">
                                Frasco
                            </button>
                        )}

                    </div>

                </div>
            ))}

        </div>

    )
}