import { useEffect, useState } from "react"

export function useLiveViewers() {
    const [viewers, setViewers] = useState(() => {
        // valor inicial aleatório
        return Math.floor(Math.random() * (18 - 5 + 1)) + 5
    })

    useEffect(() => {
        const interval = setInterval(() => {
            setViewers((prev) => {
                // variação suave (não fake)
                const change = Math.random() < 0.5 ? -1 : 1
                let next = prev + change

                if (next < 5) next = 5
                if (next > 18) next = 18

                return next
            })
        }, 4000 + Math.random() * 4000) // intervalo variável (4s a 8s)

        return () => clearInterval(interval)
    }, [])

    return viewers
}