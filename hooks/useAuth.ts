import { create } from "zustand"
import { supabase } from "@/lib/supabase/client"

type Profile = {
    id: string
    full_name: string | null
    avatar_url: string | null
    email: string
    role: "user" | "admin"
}

type AuthStore = {
    user: any | null
    profile: Profile | null
    favorites: string[] // Array de UUIDs dos produtos favoritados
    loading: boolean
    initialized: boolean

    initialize: () => Promise<void>
    setUser: (user: any) => void
    fetchProfile: (userId: string) => Promise<void>
    updateProfile: (updates: Partial<Profile>) => Promise<void>
    fetchFavorites: (userId: string) => Promise<void>
    toggleFavorite: (productId: string) => Promise<void>
    signOut: () => Promise<void>
}

export const useAuth = create<AuthStore>((set, get) => ({
    user: null,
    profile: null,
    favorites: [],
    loading: true,
    initialized: false,

    initialize: async () => {
        if (get().initialized) return

        set({ loading: true })

        const { data: { session } } = await supabase.auth.getSession()
        const user = session?.user

        if (user) {
            set({ user })
            await get().fetchProfile(user.id)
            await get().fetchFavorites(user.id)
        } else {
            set({ user: null, profile: null, favorites: [] })
        }

        set({ loading: false, initialized: true })

        supabase.auth.onAuthStateChange(async (_, session) => {
            if (session?.user) {
                set({ user: session.user, loading: true })
                await get().fetchProfile(session.user.id)
                await get().fetchFavorites(session.user.id)
                set({ loading: false })
            } else {
                set({ user: null, profile: null, favorites: [], loading: false })
            }
        })
    },

    setUser: (user) => set({ user }),

    fetchProfile: async (userId) => {
        const { data, error } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", userId)
            .single()

        if (error || !data) {
            // Primeiro login: criar perfil com dados do Google/Email
            const { data: userData } = await supabase.auth.getUser()
            const user = userData.user

            if (user) {
                const newProfile = {
                    id: user.id,
                    email: user.email!,
                    full_name: user.user_metadata?.full_name || user.email?.split("@")[0],
                    avatar_url: user.user_metadata?.avatar_url || null,
                    role: "user"
                }

                const { data: createdProfile } = await supabase
                    .from("profiles")
                    .insert([newProfile])
                    .select()
                    .single()

                if (createdProfile) set({ profile: createdProfile })
            }
        } else {
            set({
                profile: {
                    ...data,
                    role: data.role || "user"
                }
            })
        }
    },

    updateProfile: async (updates) => {
        const user = get().user
        if (!user) return

        const { data, error } = await supabase
            .from("profiles")
            .update(updates)
            .eq("id", user.id)
            .select()
            .single()

        if (!error && data) {
            set({ profile: data })
        }
    },

    fetchFavorites: async (userId) => {
        const { data, error } = await supabase
            .from("favorites")
            .select("product_id")
            .eq("user_id", userId)

        if (!error && data) {
            set({ favorites: data.map(f => f.product_id) })
        }
    },

    toggleFavorite: async (productId) => {
        const user = get().user
        if (!user) return

        const favorites = get().favorites
        const isFavorite = favorites.includes(productId)

        if (isFavorite) {
            const { error } = await supabase
                .from("favorites")
                .delete()
                .eq("user_id", user.id)
                .eq("product_id", productId)

            if (!error) {
                set({ favorites: favorites.filter(id => id !== productId) })
            }
        } else {
            const { error } = await supabase
                .from("favorites")
                .insert([{ user_id: user.id, product_id: productId }])

            if (!error) {
                set({ favorites: [...favorites, productId] })
            }
        }
    },

    signOut: async () => {
        await supabase.auth.signOut()
        set({ user: null, profile: null, favorites: [] })
        window.location.href = "/"
    }
}))
