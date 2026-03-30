import { Perfume } from "@/types/perfume"

type Props = {
    perfumes: Perfume[]
}

export default function ClosetStats({ perfumes }: Props) {

    const total = perfumes.length

    return (
        <div className="grid grid-cols-3 gap-4">

            <div className="bg-[#1c1c1e] p-4 rounded-xl">
                <p className="text-xs text-gray-400">Perfumes</p>
                <p className="text-xl font-bold">{total}</p>
            </div>

            <div className="bg-[#1c1c1e] p-4 rounded-xl">
                <p className="text-xs text-gray-400">Frascos</p>
                <p className="text-xl font-bold">3</p>
            </div>

            <div className="bg-[#1c1c1e] p-4 rounded-xl">
                <p className="text-xs text-gray-400">Decants</p>
                <p className="text-xl font-bold">5</p>
            </div>

        </div>
    )
}