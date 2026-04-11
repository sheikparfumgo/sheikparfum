"use client"

type Props = {
    id: string
    name: string
    brand?: string
    image: string

    selected: boolean
    disabled: boolean

    onSelect: () => void
}

export default function ClubPerfumeCard({
    name,
    brand,
    image,
    selected,
    disabled,
    onSelect
}: Props) {

    return (
        <div
            className={`
                min-w-[220px] max-w-[220px]
                flex-shrink-0
                rounded-xl
                border
                bg-zinc-900
                overflow-hidden
                transition-all duration-200
                ${selected
                    ? "border-[#D4AF37] ring-2 ring-[#D4AF37] shadow-[0_0_12px_rgba(212,175,55,0.5)] scale-[1.03]"
                    : "border-zinc-800"}
               ${disabled
                    ? "opacity-30 grayscale cursor-not-allowed"
                    : "hover:scale-[1.02] cursor-pointer"}
            `}
        >

            {/* IMAGEM */}
            <div className="relative aspect-square overflow-hidden">

                <img
                    src={image || "/placeholder.png"}
                    alt={name}
                    className="object-cover w-full h-full"
                />

                {/* BADGE SELECIONADO */}
                {selected && (
                    <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                        ✓ Selecionado
                    </div>
                )}

            </div>

            {/* INFO */}
            <div className="p-3 space-y-1">

                <p className="text-[10px] text-zinc-400 uppercase">
                    {brand}
                </p>

                <h3 className="text-sm font-medium leading-tight line-clamp-2">
                    {name}
                </h3>

                {/* BOTÃO */}
                <button
                    onClick={onSelect}
                    className={`
        mt-3 w-full py-2 text-xs rounded-lg font-semibold transition-all duration-200
        ${selected
                            ? "bg-[#D4AF37] text-black border border-[#D4AF37]"
                            : "bg-transparent border border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37]/10"}
    `}
                >
                    {selected ? "Selecionado" : "Selecionar"}
                </button>

            </div>

        </div>
    )
}