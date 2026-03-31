'use client'

import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function LoginPage() {

    async function loginWithGoogle() {
        await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: 'https://www.sheikparfum.com.br/admin'
            }
        })
    }

    return (
        <div style={{ padding: 20 }}>
            <h1>Login</h1>

            <button onClick={loginWithGoogle}>
                Entrar com Google
            </button>
        </div>
    )
}