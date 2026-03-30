"use client"

import { Flame, Wind, Sparkles, Gem } from "lucide-react"
import { useState } from "react"

const categories = [
    {
        label: "Elogiados",
        icon: Flame
    },
    {
        label: "Deixam rastro",
        icon: Wind
    },
    {
        label: "Femininos poderosos",
        icon: Sparkles
    },
    {
        label: "Árabes virais",
        icon: Gem
    }
]

export default function RadarCategoryTabs() {

    const [active, setActive] = useState("Elogiados")

    return (
        <div className="w-full overflow-x-auto no-scrollbar">

            <div className="flex gap-3 pb-2">

                {categories.map((cat) => {

                    const Icon = cat.icon
                    const isActive = active === cat.label

                    return (
                        <button
                            key={cat.label}
                            onClick={() => setActive(cat.label)}
                            className={`
              flex items-center gap-2
              px-4 py-2.5
              rounded-lg
              text-sm
              whitespace-nowrap
              border
              transition-all
              duration-200
              ${isActive
                                    ? "bg-[#c9a34a] text-black border-[#c9a34a] shadow-md"
                                    : "bg-[#1a1a1a] text-gray-300 border-[#2a2a2a] hover:border-[#c9a34a]/40 hover:text-white"
                                }
              `}
                        >

                            <Icon size={16} />

                            {cat.label}

                        </button>
                    )
                })}

            </div>

        </div>
    )
}