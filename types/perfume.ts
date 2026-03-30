export type Perfume = {

    id: string

    slug: string

    name: string
    brand: string

    image: string

    notes?: string[]

    availableInStore: boolean
    decantAvailable?: boolean
    bottleAvailable?: boolean

    volumes?: {
        volume: string
        price: number
    }[]

}

export type UserPerfume = {
    perfumeId: string

    status:
    | "tenho"
    | "quero_testar"
    | "quero_comprar"
    | "ja_usei"

    level: number
}