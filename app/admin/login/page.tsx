"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function LoginPage() {
    const [password, setPassword] = useState("")
    const router = useRouter()

    function handleLogin() {
        if (password === "sheik123") {
            document.cookie = "admin=true; path=/"
            router.push("/admin")
        } else {
            alert("Senha incorreta")
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="space-y-4">
                <h1 className="text-xl font-bold">Admin</h1>

                <input
                    type="password"
                    placeholder="Senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border p-2"
                />

                <button onClick={handleLogin}>
                    Entrar
                </button>
            </div>
        </div>
    )
}