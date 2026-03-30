import { Perfume } from "@/types/perfume"

export const perfumes: Perfume[] = [
    {
        id: "CHANEL_BLEU_DE_CHANEL",
        slug: "bleu-de-chanel",

        name: "Bleu de Chanel",
        brand: "Chanel",

        image: "https://images.unsplash.com/photo-1594035910387-fea47794261f",

        availableInStore: true,
        decantAvailable: true,
        bottleAvailable: true,

        volumes: [
            { volume: "5ml", price: 39 },
            { volume: "10ml", price: 69 },
            { volume: "100ml", price: 890 }
        ]
    },

    {
        id: "TOMFORD_OUD_WOOD",
        slug: "oud-wood",

        name: "Oud Wood",
        brand: "Tom Ford",

        image: "https://images.unsplash.com/photo-1541643600914-78b084683601",

        availableInStore: false
    }
]