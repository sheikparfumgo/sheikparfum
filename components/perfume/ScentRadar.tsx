"use client"

type ProfileKey =
    | "sweetness"
    | "wood"
    | "spice"
    | "freshness"
    | "citrus"
    | "projection"

type NoteLayer = {
    top?: string[]
    heart?: string[]
    base?: string[]
}

const scentProfile: Record<string, Partial<Record<ProfileKey, number>>> = {
    // ESPECIARIAS
    "Cardamomo": { spice: 3, freshness: 1 },
    "Pimenta Rosa": { spice: 3, freshness: 1 },
    "Pimenta": { spice: 4 },
    "Especiarias": { spice: 4 },
    "Canela": { spice: 4, sweetness: 2 },
    "Noz-moscada": { spice: 3 },
    "Cravo": { spice: 4, projection: 1 },

    // MADEIRAS (BUFFADAS)
    "Oud": { wood: 5, projection: 5 },
    "Sândalo": { wood: 4, sweetness: 1 },
    "Vetiver": { wood: 4, freshness: 2 },
    "Cedro": { wood: 3 },
    "Patchouli": { wood: 5, projection: 2 },
    "Madeira": { wood: 4 },
    "Madeiras": { wood: 4 },
    "Madeira clara": { wood: 2, freshness: 1 },

    // DOCES
    "Baunilha": { sweetness: 5, projection: 2 },
    "Tonka": { sweetness: 4 },
    "Âmbar": { projection: 4, sweetness: 2 },
    "Resinas": { projection: 4 },
    "Caramelo": { sweetness: 5 },
    "Chocolate": { sweetness: 5 },
    "Mel": { sweetness: 4 },
    "Açúcar": { sweetness: 4 },
    "Coco": { sweetness: 3, freshness: 1 },
    "Café": { sweetness: 2, projection: 2 },

    // CÍTRICOS (CORRIGIDO)
    "Bergamota": { citrus: 5 },
    "Limão": { citrus: 5 },
    "Laranja": { citrus: 4 },
    "Tangerina": { citrus: 4 },
    "Grapefruit": { citrus: 5 },
    "Cítrico": { citrus: 4 },
    "Cítricos": { citrus: 4 },

    // FLORAIS
    "Rosa": { sweetness: 2 },
    "Jasmim": { sweetness: 2, projection: 1 },
    "Flor de Laranjeira": { sweetness: 2, freshness: 1 },
    "Ylang-Ylang": { sweetness: 3 },
    "Lírio": { freshness: 2 },

    // FRESCOS
    "Lavanda": { freshness: 3 },
    "Notas verdes": { freshness: 4 },
    "Hortelã": { freshness: 5 },
    "Alecrim": { freshness: 3 },
    "Manjericão": { freshness: 3 },

    "Notas aquáticas": { freshness: 5 },
    "Aquático": { freshness: 5 },
    "Marinho": { freshness: 4 },

    // BASE / FIXAÇÃO
    "Almíscar": { projection: 3 },
    "Musk branco": { projection: 3 },
    "Sabão": { freshness: 3 },

    "Couro": { wood: 4, projection: 3 },
    "Fumaça": { projection: 4 },
    "Incenso": { projection: 4 },

    // 🔥 FRUTA NEUTRA (INTELIGENTE)
    "Frutas": { freshness: 1 },
    "Frutas vermelhas": { freshness: 2, citrus: 1 },

    "Tâmara": { sweetness: 4 },
    "Praliné": { sweetness: 5 },

    "Notas alcoólicas": { projection: 2 },
    "Tabaco": { wood: 3, projection: 2 },
    "Notas esfumaçadas": { projection: 4 }
}

// NORMALIZAÇÃO
function normalize(note: string) {
    return note
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim()
}

// PERFIL NORMALIZADO
const normalizedProfile: Record<string, Partial<Record<ProfileKey, number>>> = {}

Object.entries(scentProfile).forEach(([key, value]) => {
    normalizedProfile[normalize(key)] = value
})

// DOMINANTES
const dominantNotes = [
    "oud",
    "ambar",
    "resinas",
    "baunilha",
    "caramelo",
    "couro",
    "incenso"
]

function calculateProfile({ top = [], heart = [], base = [] }: NoteLayer) {

    const result: Record<ProfileKey, number> = {
        sweetness: 0,
        wood: 0,
        spice: 0,
        freshness: 0,
        citrus: 0,
        projection: 0
    }

    const allNotes = [...top, ...heart, ...base].map(normalize)

    // 🔥 CONTEXTO INTELIGENTE
    const hasSweet = allNotes.some(n =>
        ["baunilha", "caramelo", "tonka", "praline", "mel"].includes(n)
    )

    const hasCitrus = allNotes.some(n =>
        ["bergamota", "limao", "limão", "laranja", "grapefruit", "citrico"].includes(n)
    )

    const hasFresh = allNotes.some(n =>
        ["hortela", "aquatico", "marinho", "notas verdes"].includes(n)
    )

    const apply = (notes: string[], weight: number) => {
        notes.forEach(note => {

            const key = normalize(note)
            let profile = normalizedProfile[key]

            if (!profile) return

            // 🔥 INTELIGÊNCIA NAS FRUTAS
            if (key.includes("fruta")) {

                if (hasSweet) profile = { sweetness: 2 }
                else if (hasCitrus) profile = { citrus: 2 }
                else if (hasFresh) profile = { freshness: 2 }
                else profile = { freshness: 1 }
            }

            const isDominant = dominantNotes.includes(key)

            Object.entries(profile).forEach(([k, v]) => {
                const prop = k as ProfileKey
                result[prop] += (v ?? 0) * weight * (isDominant ? 1.8 : 1)
            })
        })
    }

    // 🔥 PESOS AJUSTADOS
    apply(top, 0.8)
    apply(heart, 1.4)
    apply(base, 2.4)

    // 🔥 NORMALIZAÇÃO FINAL
    Object.keys(result).forEach(key => {
        const k = key as ProfileKey
        result[k] = Math.min(5, Math.round(result[k] / 1.6))
    })

    return result
}

type Props = {
    top?: string[]
    heart?: string[]
    base?: string[]
}

export default function ScentRadar({ top = [], heart = [], base = [] }: Props) {

    const profile = calculateProfile({ top, heart, base })

    const items = [
        { label: "Cítrico", value: profile.citrus },
        { label: "Frescura", value: profile.freshness },
        { label: "Doçura", value: profile.sweetness },
        { label: "Amadeirado", value: profile.wood },
        { label: "Especiado", value: profile.spice },
        { label: "Projeção", value: profile.projection }
    ]

    return (
        <div className="space-y-4">
            {items.map(item => (
                <div key={item.label} className="space-y-1">

                    <div className="flex justify-between text-xs text-zinc-400">
                        <span>{item.label}</span>
                        <span>{item.value}/5</span>
                    </div>

                    <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-[#d4af37] to-[#f1d27a]"
                            style={{ width: `${item.value * 20}%` }}
                        />
                    </div>

                </div>
            ))}
        </div>
    )
}