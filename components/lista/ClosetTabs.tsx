"use client"

import { useState } from "react"

type Tab =
    | "todos"
    | "tenho"
    | "quero_testar"
    | "quero_comprar"
    | "ja_usei"

const tabs: { id: Tab; label: string }[] = [
    { id: "todos", label: "Todos" },
    { id: "tenho", label: "Tenho" },
    { id: "quero_testar", label: "Quero testar" },
    { id: "quero_comprar", label: "Quero comprar" },
    { id: "ja_usei", label: "Já usei" }
]

export default function ClosetTabs() {

    const [active, setActive] = useState<Tab>("todos")

    return (

        <div className="flex gap-2 overflow-x-auto pb-2">

            {tabs.map((tab) => (

                <button
                    key={tab.id}
                    onClick={() => setActive(tab.id)}
                    className={`
            px-4 py-2
            rounded-full
            text-sm
            font-semibold
            whitespace-nowrap
            border
            transition

            ${active === tab.id
                            ? "bg-[#c9a34a] text-black border-[#c9a34a]"
                            : "bg-[#1c1c1e] text-gray-300 border-[#2a2a2a] hover:border-[#c9a34a]/40"
                        }
          `}
                >
                    {tab.label}
                </button>

            ))}

        </div>

    )
}