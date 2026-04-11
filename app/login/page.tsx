"use client"

import { useState, useEffect, Suspense } from "react"
import { useAuth } from "@/hooks/useAuth"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase/client"
import { Chrome, Mail, Lock, LogIn, UserPlus, ArrowRight, AlertCircle, Loader2 } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { toast } from "sonner"

function LoginContent() {
    const { user, toggleFavorite, loading: authLoading } = useAuth()
    const router = useRouter()
    const searchParams = useSearchParams()
    const redirectTo = searchParams.get("redirect") || "/perfil"
    const [mode, setMode] = useState<"login" | "register">("login")
    const [loading, setLoading] = useState(false)
    const [socialLoading, setSocialLoading] = useState(false)


    // Form states
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const handleGoogleLogin = async () => {
        setSocialLoading(true)
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: "google",
                options: {
                    redirectTo: `${window.location.origin}${redirectTo}`,
                    queryParams: {
                        prompt: "select_account"
                    }
                }
            })
            if (error) throw error
        } catch (err: any) {
            toast.error(err.message)
            setSocialLoading(false)
        }
    }

    const handleForgotPassword = async () => {
        if (!email) {
            toast.error("Digite seu e-mail primeiro.")
            return
        }

        setLoading(true)

        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/reset-password`
        })

        if (error) {
            toast.error(error.message)
        } else {
            toast.success("Enviamos um link para seu e-mail")
        }

        setLoading(false)
    }

    const handleEmailAuth = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            if (mode === "login") {
                const { error: loginError } = await supabase.auth.signInWithPassword({
                    email,
                    password
                })

                if (loginError) {
                    console.warn("Login automático falhou, mas usuário pode já estar autenticado")
                }

                toast.success("Login realizado!")

                router.push(redirectTo)
                router.refresh()
            } else {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                })

                if (error) throw error

                // login automático
                await supabase.auth.signInWithPassword({
                    email,
                    password
                })

                toast.success("Conta criada com sucesso!")

                router.push(redirectTo)
                router.refresh()
            }
        } catch (err: any) {
            toast.error(
                err.message === "Invalid login credentials"
                    ? "E-mail ou senha incorretos."
                    : err.message
            )
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        const pending = localStorage.getItem("pending_favorite")

        if (pending && user) {
            toggleFavorite(pending)
            localStorage.removeItem("pending_favorite")
        }
    }, [user])

    return (
        <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 animate-fade-in">

            {/* Background Decorative Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[#c9a34a]/5 rounded-full blur-[120px]" />
            </div>

            <div className="w-full max-w-[440px] z-10">

                {/* Header Copy */}
                <div className="text-center mb-10 space-y-3">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent">
                        Acesse o universo Sheik
                    </h1>
                    <p className="text-zinc-400 text-sm md:text-base max-w-[320px] mx-auto">
                        Descubra perfumes exclusivos, monte sua coleção e aproveite o Clube Sheik
                    </p>
                </div>

                {/* Auth Card */}
                <div className="glass p-8 relative group overflow-hidden border-[#2a2a2a] hover:border-[#c9a34a]/30 transition-all duration-500 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">

                    {/* Golden Glow Effect */}
                    <div className="absolute -top-px left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#c9a34a]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    <div className="space-y-8">

                        {/* Orientation */}
                        <p className="text-center text-xs font-semibold uppercase tracking-widest text-[#c9a34a]">
                            Escolha como deseja acessar sua conta
                        </p>

                        {/* Social Login */}
                        <div className="space-y-3">
                            <button
                                onClick={handleGoogleLogin}
                                disabled={socialLoading || loading}
                                className="w-full h-14 flex items-center justify-center gap-3 bg-white text-black font-bold rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg hover:shadow-white/10 disabled:opacity-50 disabled:hover:scale-100"
                            >
                                {socialLoading ? (
                                    <Loader2 className="animate-spin" size={20} />
                                ) : (
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M23.766 12.2764C23.766 11.4607 23.6999 10.6406 23.5588 9.83807H12.24V14.4591H18.7217C18.4528 15.9105 17.5885 17.1825 16.3542 18.0106V21.0039H20.1793C22.4249 18.9271 23.766 15.8821 23.766 12.2764Z" fill="#4285F4" />
                                        <path d="M12.24 24C15.4834 24 18.2111 22.9227 20.1839 21.0039L16.3588 18.0106C15.3023 18.7181 13.8827 19.1267 12.2446 19.1267C9.10862 19.1267 6.4529 17.02 5.50343 14.1893H1.54846V17.2549C3.51862 21.1717 7.59251 24 12.24 24Z" fill="#34A853" />
                                        <path d="M5.4988 14.1893C5.25001 13.4593 5.10892 12.6841 5.10892 11.8966C5.10892 11.1091 5.25001 10.3339 5.4988 9.60395V6.53833H1.54846C0.709927 8.16333 0.222656 9.9866 0.222656 11.8966C0.222656 13.8066 0.709927 15.6299 1.54846 17.2549L5.4988 14.1893Z" fill="#FBBC05" />
                                        <path d="M12.24 4.87325C14.0075 4.87325 15.5947 5.47467 16.8402 6.671L20.2645 3.24675C18.2065 1.328 15.4789 0.222656 12.24 0.222656C7.59251 0.222656 3.51862 3.05096 1.54846 6.96759L5.50343 10.0332C6.4529 7.20251 9.10862 5.09583 12.24 4.87325Z" fill="#EA4335" />
                                    </svg>
                                )}
                                <span>Continuar com Google</span>
                            </button>
                            <p className="text-center text-[11px] text-zinc-500">
                                Mais rápido e sem precisar criar senha
                            </p>
                        </div>

                        {/* Divider */}
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-[#2a2a2a]"></div>
                            </div>
                            <div className="relative flex justify-center text-xs">
                                <span className="bg-[#111112] px-4 text-zinc-500">ou continue com seu e-mail</span>
                            </div>
                        </div>

                        {/* Email Form */}
                        <form onSubmit={handleEmailAuth} className="space-y-4">

                            <div className="space-y-4">
                                <div className="space-y-1">
                                    <div className="relative">
                                        <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-500 peer-focus:text-[#c9a34a]" />

                                        <input
                                            type="email"
                                            required
                                            placeholder="Seu melhor e-mail"
                                            className="input-premium pl-14 h-14 bg-[#111112] relative z-10 peer"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <div className="relative">
                                        <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-500 z-0" size={16} />

                                        <input
                                            type="password"
                                            required
                                            placeholder="Sua senha secreta"
                                            className="input-premium pl-14 h-14 bg-[#111112] relative z-10"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                    </div>
                                    <div className="flex justify-end">
                                        <button
                                            type="button"
                                            onClick={handleForgotPassword}
                                            className="text-[11px] text-[#c9a34a] hover:underline"
                                        >
                                            Esqueci minha senha
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading || socialLoading || !email || !password}
                                className="btn-primary hover:scale-[1.02] active:scale-[0.98] transition-all h-14 flex items-center justify-center gap-2 text-sm uppercase tracking-widest disabled:opacity-50"
                            >
                                {loading ? (
                                    <Loader2 className="animate-spin" size={20} />
                                ) : (
                                    <>
                                        {mode === "login" ? "Entrar" : "Criar conta"}
                                        <ArrowRight size={16} />
                                    </>
                                )}
                            </button>
                        </form>

                        {/* Footer Toggle */}
                        <div className="text-center">
                            <button
                                onClick={() => setMode(mode === "login" ? "register" : "login")}
                                className="text-sm text-zinc-500 hover:text-white transition"
                            >
                                {mode === "login" ? (
                                    <>Ainda não tem conta? <span className="text-[#c9a34a] font-semibold">Criar agora</span></>
                                ) : (
                                    <>Já possui uma conta? <span className="text-[#c9a34a] font-semibold">Fazer login</span></>
                                )}
                            </button>
                        </div>

                    </div>
                </div>

                {/* Secure Trust */}
                <p className="mt-8 text-center text-[10px] text-zinc-600 flex items-center justify-center gap-1">
                    <Lock size={10} />
                    Sua segurança é nossa prioridade. Dados 100% criptografados.
                </p>

            </div>
        </div>
    )
}

export default function LoginPage() {
    return (
        <Suspense fallback={
            <div className="min-h-[80vh] flex items-center justify-center">
                <Loader2 className="animate-spin text-[#c9a34a]" size={40} />
            </div>
        }>
            <LoginContent />
        </Suspense>
    )
}