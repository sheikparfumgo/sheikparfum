"use client"

import { Search, ShoppingCart, User, Menu, X } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import Sidebar from "@/components/home/Sidebar"
import { useCart } from "@/store/cart"
import { useAuth } from "@/hooks/useAuth"
import { useRouter } from "next/navigation"

export default function Header() {
    const { user, profile, loading } = useAuth()
    const router = useRouter()
    const [scrolled, setScrolled] = useState(false)
    const [menuOpen, setMenuOpen] = useState(false)
    const [searchOpen, setSearchOpen] = useState(false)
    const [cartOpen, setCartOpen] = useState(false)

    const userDesktopRef = useRef<HTMLDivElement>(null)
    const userMobileRef = useRef<HTMLDivElement>(null)

    const [userMenuOpen, setUserMenuOpen] = useState(false)
    const userRef = useRef<HTMLDivElement>(null)

    const searchRef = useRef<HTMLDivElement>(null)
    const cartRef = useRef<HTMLDivElement>(null)

    const updateQuantity = useCart((state) => state.updateQuantity)
    const removeItem = useCart((state) => state.removeItem)
    const items = useCart((state) => state.items)

    const handleUserClick = () => {
        if (!user) {
            router.push("/login")
            return
        }

        setUserMenuOpen((prev) => !prev)
    }

    useEffect(() => {
        console.log("HEADER STATE →", { user, loading, profile })
    }, [user, loading, profile])

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10)
        }
        window.addEventListener("scroll", handleScroll)
        return () => {
            window.removeEventListener("scroll", handleScroll)
        }
    }, [])

    useEffect(() => {
        function handleClickOutside(e: any) {
            if (
                userDesktopRef.current &&
                !userDesktopRef.current.contains(e.target) &&
                userMobileRef.current &&
                !userMobileRef.current.contains(e.target)
            ) {
                setUserMenuOpen(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [])

    return (
        <>
            <header
                className={`
        relative
        h-16
        flex items-center justify-end
        px-3 sm:px-4 md:px-8
        fixed top-0 left-0 right-0 z-50 
        transition-all duration-300
        ${scrolled
                        ? "bg-[#111112]/90 border-b border-[#2a2a2a] shadow-[0_2px_8px_rgba(0,0,0,0.4)]"
                        : "bg-[#111112]"
                    }
      `}
            >

                {/* Menu mobile */}

                <button
                    onClick={() => setMenuOpen(true)}
                    className="
          md:hidden
          absolute left-3
          w-10 h-10
          flex items-center justify-center
          rounded-xl
          bg-[#1c1c1e]
          border border-[#2a2a2a]
          hover:border-[#c9a34a]/40
          hover:scale-105
          transition
        "
                >
                    <Menu size={20} className="text-[#c9a34a]" />
                </button>

                <div className="flex items-center gap-3">

                    {/* BUSCA EXPANSÍVEL */}

                    <div ref={searchRef} className="relative">

                        {!searchOpen ? (

                            <button
                                onClick={() => setSearchOpen(true)}
                                className="
                w-10 h-10
                flex items-center justify-center
                rounded-xl
                bg-[#1c1c1e]
                border border-[#2a2a2a]
                hover:border-[#c9a34a]/40
                hover:bg-[#202022]
                hover:scale-105
                transition
              "
                            >
                                <Search size={18} className="text-[#c9a34a]" />
                            </button>

                        ) : (

                            <div
                                className="
                flex items-center
                bg-[#1c1c1e]
                border border-[#2a2a2a]
                rounded-xl
                px-3
                h-10
                w-[240px]
                animate-in fade-in zoom-in
              "
                            >
                                <Search size={16} className="text-gray-400 mr-2" />

                                <input
                                    autoFocus
                                    placeholder="Buscar perfumes..."
                                    className="
                   bg-transparent
                   outline-none
                   text-sm
                   flex-1
                   placeholder:text-gray-500
                 "
                                />

                                <button onClick={() => setSearchOpen(false)}>
                                    <X size={16} className="text-gray-400" />
                                </button>

                            </div>

                        )}

                    </div>

                    {/* CARRINHO COM PREVIEW */}

                    <div ref={cartRef} className="relative">

                        <button
                            onClick={() => setCartOpen(!cartOpen)}
                            className="
               w-10 h-10
               flex items-center justify-center
               rounded-xl
               bg-[#1c1c1e]
               border border-[#2a2a2a]
               hover:border-[#c9a34a]/40
               hover:bg-[#202022]
               hover:scale-105
               transition
             "
                        >
                            <ShoppingCart size={18} className="text-[#c9a34a]" />
                        </button>

                        {/* Badge */}

                        {items.length > 0 && (
                            <span
                                className="
             absolute -top-1 -right-1
             text-[10px]
             bg-[#c9a34a]
             text-black
             px-1.5
             py-[2px]
             rounded-full
             font-bold
         "
                            >
                                {items.length}
                            </span>
                        )}

                        {/* Dropdown */}

                        {cartOpen && (

                            <div
                                className="
                 absolute right-0 mt-3
                 w-72
                 bg-[#1a1a1c]
                 border border-[#2a2a2a]
                 rounded-xl
                 shadow-xl
                 p-4
                 space-y-3
               "
                            >

                                <h4 className="text-sm font-semibold text-white">
                                    Seu carrinho
                                </h4>

                                {items.map((item) => (

                                    <div
                                        key={item.id}
                                        className="flex flex-col gap-2 text-sm border-b border-[#2a2a2a] pb-2"
                                    >

                                        {/* LINHA PRINCIPAL */}
                                        <div className="flex justify-between items-center">

                                            <span className="text-gray-300">
                                                {item.name} ({item.size}ml)
                                            </span>

                                            <span className="text-[#c9a34a] font-semibold">
                                                R$ {(item.price * item.quantity).toFixed(2)}
                                            </span>

                                        </div>

                                        {/* CONTROLES */}
                                        <div className="flex justify-between items-center">

                                            {/* QUANTIDADE */}
                                            <div className="flex items-center gap-2">

                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                    className="px-2 bg-zinc-800 rounded hover:bg-zinc-700"
                                                >
                                                    -
                                                </button>

                                                <span className="text-white text-xs">
                                                    {item.quantity}
                                                </span>

                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    className="px-2 bg-zinc-800 rounded hover:bg-zinc-700"
                                                >
                                                    +
                                                </button>

                                            </div>

                                            {/* REMOVER */}
                                            <button
                                                onClick={() => removeItem(item.id)}
                                                className="text-red-400 text-xs hover:underline"
                                            >
                                                remover
                                            </button>

                                        </div>

                                    </div>

                                ))}

                                {/* SUBTOTAL */}
                                <div className="border-t border-[#2a2a2a] pt-2 flex justify-between text-sm">
                                    <span className="text-gray-400">Subtotal</span>
                                    <span className="text-white font-semibold">
                                        R$ {items.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2)}
                                    </span>
                                </div>

                                {/* BOTÕES */}
                                <div className="flex flex-col gap-2 mt-2">

                                    <button
                                        onClick={() => window.location.href = "/cart"}
                                        className="w-full py-2 rounded-lg bg-[#c9a34a] text-black font-semibold hover:brightness-110 transition"
                                    >
                                        Ver carrinho
                                    </button>

                                    <button
                                        onClick={() => window.location.href = "/checkout"}
                                        className="w-full py-2 rounded-lg border border-[#c9a34a] text-[#c9a34a] font-semibold hover:bg-[#c9a34a] hover:text-black transition"
                                    >
                                        Finalizar compra
                                    </button>

                                </div>

                            </div>

                        )}

                    </div>

                    {/* USUÁRIO LOGADO */}

                    {user ? (

                        <div ref={userDesktopRef} className="relative">

                            {/* BOTÃO */}
                            <div
                                onClick={handleUserClick}
                                className={`
                hidden md:flex
                items-center gap-2
                px-2 py-1
                rounded-full
                bg-[#1c1c1e]
                border border-[#2a2a2a]
                hover:border-[#c9a34a]/40
                cursor-pointer
                transition
                ${loading || !profile ? "opacity-50 pointer-events-none" : ""}
            `}
                            >

                                <img
                                    src={profile?.avatar_url || "https://api.dicebear.com/7.x/avataaars/svg?seed=" + user?.email}
                                    className="w-7 h-7 rounded-full"
                                />

                                <span className="text-sm text-gray-300 pr-2">
                                    {profile?.full_name || user?.email}
                                </span>

                            </div>

                            {/* DROPDOWN */}
                            {userMenuOpen && (
                                <div className="
                absolute right-0 mt-3 w-48
                bg-[#1a1a1c]
                border border-[#2a2a2a]
                rounded-xl
                z-50
                shadow-xl
                overflow-hidden
            ">

                                    <button
                                        onClick={() => {
                                            setUserMenuOpen(false)
                                            setTimeout(() => router.push("/perfil"), 50)
                                        }}
                                        className="w-full text-left px-4 py-3 text-sm hover:bg-[#2a2a2a]"
                                    >
                                        Meu Perfil
                                    </button>

                                    {profile?.role === "admin" && (
                                        <button
                                            onClick={() => {
                                                setUserMenuOpen(false)
                                                setTimeout(() => router.push("/admin"), 50)
                                            }}
                                            className="w-full text-left px-4 py-3 text-sm hover:bg-[#2a2a2a]"
                                        >
                                            Painel Admin
                                        </button>
                                    )}

                                    <div className="h-px bg-[#2a2a2a]" />

                                    <button
                                        onClick={async () => {
                                            await useAuth.getState().signOut()
                                        }}
                                        className="w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-[#2a2a2a]"
                                    >
                                        Sair
                                    </button>

                                </div>
                            )}

                        </div>

                    ) : (

                        <button
                            onClick={handleUserClick}
                            className="
            hidden md:flex
            items-center
            px-6 py-2.5
            rounded-full
            font-semibold
            text-black
            bg-gradient-to-r from-[#c9a34a] to-[#e0b95b]
            shadow-lg shadow-[#c9a34a]/20
            hover:scale-105
            hover:shadow-[#c9a34a]/40
            transition
        "
                        >
                            Login / Cadastrar
                        </button>

                    )}

                    {user ? (

                        <div ref={userMobileRef} className="relative md:hidden">

                            {/* BOTÃO MOBILE */}
                            <button
                                onClick={handleUserClick}
                                className={`
                w-10 h-10
                flex items-center justify-center
                rounded-xl
                bg-[#1c1c1e]
                border border-[#2a2a2a]
                ${loading || !profile ? "opacity-50 pointer-events-none" : ""}
            `}
                            >
                                <img
                                    src={profile?.avatar_url || "https://api.dicebear.com/7.x/avataaars/svg?seed=" + user?.email}
                                    alt="avatar"
                                    className="w-8 h-8 rounded-full"
                                />
                            </button>

                            {/* DROPDOWN MOBILE */}
                            {userMenuOpen && (
                                <div className="
                absolute right-0 mt-3 w-48
                bg-[#1a1a1c]
                border border-[#2a2a2a]
                rounded-xl
                z-50
                shadow-xl
                overflow-hidden
            ">

                                    <button
                                        onClick={() => {
                                            setUserMenuOpen(false)
                                            setTimeout(() => router.push("/perfil"), 50)
                                        }}
                                        className="w-full text-left px-4 py-3 text-sm hover:bg-[#2a2a2a]"
                                    >
                                        Meu Perfil
                                    </button>

                                    {profile?.role === "admin" && (
                                        <button
                                            onClick={() => {
                                                setUserMenuOpen(false)
                                                setTimeout(() => router.push("/admin"), 50)
                                            }}
                                            className="w-full text-left px-4 py-3 text-sm hover:bg-[#2a2a2a]"
                                        >
                                            Painel Admin
                                        </button>
                                    )}

                                    <div className="h-px bg-[#2a2a2a]" />

                                    <button
                                        onClick={async () => {
                                            await useAuth.getState().signOut()
                                        }}
                                        className="w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-[#2a2a2a]"
                                    >
                                        Sair
                                    </button>

                                </div>
                            )}

                        </div>

                    ) : (

                        <button
                            onClick={() => router.push("/login")}
                            className="
            md:hidden
            w-10 h-10
            flex items-center justify-center
            rounded-xl
            bg-[#1c1c1e]
            border border-[#2a2a2a]
        "
                        >
                            <User size={18} className="text-[#c9a34a]" />
                        </button>

                    )}

                </div>

            </header>

            {/* Sidebar mobile */}

            {menuOpen && (

                <div className="fixed inset-0 z-50 flex">

                    <div
                        className="flex-1 bg-black/60 backdrop-blur-sm"
                        onClick={() => setMenuOpen(false)}
                    />

                    <Sidebar
                        mobile
                        open={menuOpen}
                        onClose={() => setMenuOpen(false)}
                    />

                </div>

            )}

        </>
    )
}