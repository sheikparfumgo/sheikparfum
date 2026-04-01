// /store/auth.ts

import { create } from "zustand"
import { supabase } from "@/lib/supabase/client"
import { User } from "@supabase/supabase-js"

type Profile = {
    id: string
    full_name: string | null
    avatar_url: string | null
    email: string
}

interface AuthStore {
    user: User | null
    profile: Profile | null
    loading: boolean
    initialized: boolean

    initialize: () => Promise<void>
    fetchProfile: (userId: string) => Promise<void>
    updateProfile: (updates: Partial<Profile>) => Promise<void>
    signOut: () => Promise<void>
}

let authListener: any = null

export const useAuth = create<AuthStore>((set, get) => ({

    user: null,
    profile: null,
    loading: true,
    initialized: false,

    // 🔹 INIT GLOBAL AUTH
    initialize: async () => {
        if (get().initialized) return

        const { data: { session } } = await supabase.auth.getSession()

        if (session?.user) {
            set({ user: session.user })
            await get().fetchProfile(session.user.id)
        }

        set({ loading: false, initialized: true })

        // 🔹 LISTENER (evita duplicação)
        if (!authListener) {
            const { data } = supabase.auth.onAuthStateChange(async (_event, session) => {

                if (session?.user) {
                    set({ user: session.user })
                    await get().fetchProfile(session.user.id)
                } else {
                    set({ user: null, profile: null })
                }

                set({ loading: false })
            })

            authListener = data.subscription
        }
    },

    // 🔹 FETCH PROFILE
    fetchProfile: async (userId) => {
        const { data, error } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", userId)
            .single()

        // 👉 Se deu erro real
        if (error && error.code !== "PGRST116") {
            console.error("Erro ao buscar profile:", error)
            return
        }

        // 👉 Se NÃO existe profile → cria (primeiro login)
        if (!data) {
            const { data: userData } = await supabase.auth.getUser()
            const user = userData.user

            if (!user) return

            const newProfile: Profile = {
                id: user.id,
                email: user.email!,
                full_name:
                    user.user_metadata?.full_name ||
                    user.email?.split("@")[0] ||
                    "Usuário",
                avatar_url: user.user_metadata?.avatar_url || null,
            }

            const { data: createdProfile, error: createError } = await supabase
                .from("profiles")
                .insert([newProfile])
                .select()
                .single()

            if (createError) {
                console.error("Erro ao criar profile:", createError)
                return
            }

            set({ profile: createdProfile })
        } else {
            set({ profile: data })
        }
    },

    // 🔹 UPDATE PROFILE
    updateProfile: async (updates) => {
        const user = get().user
        if (!user) return

        const { data, error } = await supabase
            .from("profiles")
            .update(updates)
            .eq("id", user.id)
            .select()
            .single()

        if (error) {
            console.error("Erro ao atualizar profile:", error)
            return
        }

        set({ profile: data })
    },

    // 🔹 LOGOUT
    signOut: async () => {
        await supabase.auth.signOut()
        set({ user: null, profile: null })

        // 🔥 importante pra limpar estado visual
        window.location.href = "/"
    },

}))