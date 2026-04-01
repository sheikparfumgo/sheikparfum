"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Compass, Radar, Bookmark, Store, Crown, User } from "lucide-react"
import Image from "next/image"
import { useAuth } from "@/store/auth"

type SidebarProps = {
    mobile?: boolean
    open?: boolean
    onClose?: () => void
}

export default function Sidebar({ mobile = false, open = false, onClose }: SidebarProps) {

    const pathname = usePathname()
    const { user, profile } = useAuth()

    return (
        <aside
            className={`
      flex flex-col
      w-64
      h-screen
      bg-[#111112]
      border-r border-[#413a2a]
      p-6
      overflow-y-auto
      transition-transform duration-300 ease-out
      ${mobile
                    ? `fixed top-0 left-0 z-50 transform ${open ? "translate-x-0" : "-translate-x-full"}`
                    : "hidden md:flex fixed top-0 left-0 z-40"
                }
      `}
        >

            {/* Logo */}
            <div className="flex items-center gap-3 pb-6 mb-6 border-b border-[#413a2a]">

                <Image
                    src="/logo/logo.png"
                    alt="Sheik Parfum"
                    width={40}
                    height={40}
                    className="object-contain w-10 h-10 drop-shadow-[0_0_6px_rgba(201,163,74,0.5)]"
                />

                <span className="text-white font-bold text-lg tracking-tight">
                    Sheik Parfum
                </span>

            </div>

            {/* Navigation */}
            <nav className="flex flex-col gap-3 mt-2">

                <NavItem
                    href="/"
                    icon={<Compass size={20} />}
                    label="Início"
                    active={pathname === "/"}
                    onClick={onClose}
                />

                <NavItem
                    href="/novidades"
                    icon={<Radar size={20} />}
                    label="Novidades"
                    active={pathname === "/novidades"}
                    onClick={onClose}
                />

                <NavItem
                    href="/lista"
                    icon={<Bookmark size={20} />}
                    label={user ? "Minha Coleção" : "Lista do Sheik"}
                    active={pathname === "/lista"}
                    onClick={onClose}
                />

                <NavItem
                    href="/loja"
                    icon={<Store size={20} />}
                    label="Loja"
                    active={pathname === "/loja"}
                    onClick={onClose}
                />

                <NavItem
                    href="/clube"
                    icon={<Crown size={20} />}
                    label="Clube do Sheik"
                    active={pathname === "/clube"}
                    onClick={onClose}
                />

                {user && (
                    <NavItem
                        href="/perfil"
                        icon={<User size={20} />}
                        label="Perfil"
                        active={pathname === "/perfil"}
                        onClick={onClose}
                    />
                )}

            </nav>

        </aside>
    )
}

type NavItemProps = {
    icon: React.ReactNode
    label: string
    href: string
    active?: boolean
    onClick?: () => void
}

function NavItem({ icon, label, href, active, onClick }: NavItemProps) {

    return (
        <Link
            href={href}
            onClick={onClick}
            className={`
      flex items-center gap-3
      px-3 py-2
      rounded-lg
      text-sm
      transition
      ${active
                    ? "bg-[#2B2B2B] text-[#c9a34a]"
                    : "text-gray-300 hover:text-[#c9a34a] hover:bg-[#2B2B2B]"
                }
      `}
        >
            {icon}
            <span>{label}</span>
        </Link>
    )
}