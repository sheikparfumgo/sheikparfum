import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"

type CartItem = {
    id: string
    name: string
    price: number
    quantity: number
    image?: string
    size?: number
}

type Shipping = {
    id: number
    name: string
    price: number
    deadline: number
}

type Address = {
    cep: string
    street?: string
    city?: string
    state?: string
    number?: string
    complement?: string
}

type CartStore = {
    items: CartItem[]
    shipping: Shipping | null
    address: Address | null

    addItem: (item: CartItem) => void
    removeItem: (id: string) => void
    updateQuantity: (id: string, quantity: number) => void
    clearCart: () => void

    setShipping: (shipping: Shipping | null) => void
    setAddress: (address: Address) => void
    clearAddress: () => void

    getTotal: () => number
    getTotalWithShipping: () => number
}

export const useCart = create<CartStore>()(
    persist(
        (set, get) => ({
            items: [],
            shipping: null,
            address: null,

            // 🛒 ADD
            addItem: (item) =>
                set((state) => {
                    const existing = state.items.find((i) => i.id === item.id)

                    if (existing) {
                        return {
                            items: state.items.map((i) =>
                                i.id === item.id
                                    ? { ...i, quantity: i.quantity + item.quantity }
                                    : i
                            )
                        }
                    }

                    return {
                        items: [...state.items, item]
                    }
                }),

            // ❌ REMOVE
            removeItem: (id) =>
                set((state) => ({
                    items: state.items.filter((item) => item.id !== id)
                })),

            // 🔄 UPDATE QTD
            updateQuantity: (id, quantity) =>
                set((state) => ({
                    items: state.items.map((item) =>
                        item.id === id
                            ? { ...item, quantity: Math.max(1, quantity) }
                            : item
                    )
                })),

            // 🧹 CLEAR
            clearCart: () =>
                set({
                    items: [],
                    shipping: null,
                    address: null
                }),

            // 🚚 SHIPPING
            setShipping: (shipping) => set({ shipping }),

            // 📍 ADDRESS (INTELIGENTE)
            setAddress: (address) =>
                set((state) => {
                    const currentCep = state.address?.cep

                    // 🔥 se mudou o CEP → reseta frete automaticamente
                    const shouldResetShipping =
                        currentCep && currentCep !== address.cep

                    return {
                        address,
                        shipping: shouldResetShipping ? null : state.shipping
                    }
                }),

            clearAddress: () =>
                set({
                    address: null,
                    shipping: null
                }),

            // 💰 TOTAL
            getTotal: () =>
                get().items.reduce(
                    (total, item) => total + item.price * item.quantity,
                    0
                ),

            // 💰 TOTAL + FRETE
            getTotalWithShipping: () => {
                const { items, shipping } = get()

                const productsTotal = items.reduce(
                    (acc, item) => acc + item.price * item.quantity,
                    0
                )

                return productsTotal + (shipping?.price || 0)
            }
        }),
        {
            name: "sheik-cart",
            storage: createJSONStorage(() => localStorage)
        }
    )
)