import { useEffect, useState } from "react"

const names = [
    "Mariana", "Lucas", "Fernanda", "Rafael", "Juliana",
    "Bruno", "Camila", "Gustavo", "Amanda", "Diego"
]

const cities = [
    "São Paulo", "Rio de Janeiro", "Belo Horizonte",
    "Curitiba", "Salvador", "Brasília",
    "Fortaleza", "Porto Alegre", "Recife"
]

function randomItem(arr: any[]) {
    return arr[Math.floor(Math.random() * arr.length)]
}

function randomTime() {
    const minutes = Math.floor(Math.random() * 360)

    if (minutes < 60) return `há ${minutes}min`
    return `há ${Math.floor(minutes / 60)}h`
}

function randomSize() {
    const sizes = ["5ml", "10ml", "100ml"]
    return randomItem(sizes)
}

export function useRecentPurchase(perfumes: any[] = []) {
    const [visible, setVisible] = useState(false)
    const [data, setData] = useState<any>(null)

    useEffect(() => {

        function generate() {
            const perfume = perfumes.length > 0
                ? randomItem(perfumes)
                : {
                    perfume_name: "Perfume",
                    image_main: "/placeholder.png"
                }

            setData({
                name: randomItem(names),
                city: randomItem(cities),
                time: randomTime(),
                perfume: perfume.perfume_name || "Perfume",
                image: perfume.image_main || "/placeholder.png",
                size: randomSize()
            })
        }

        function show() {
            generate()
            setVisible(true)

            // ⏱️ tempo visível maior (melhor leitura)
            setTimeout(() => {
                setVisible(false)
            }, 6000) // 6 segundos
        }

        // ⏱️ primeira aparição (3–5s)
        const first = setTimeout(show, 3000 + Math.random() * 2000)

        // ⏱️ intervalo REALISTA (1 a 3 minutos)
        const interval = setInterval(() => {
            show()
        }, 60000 + Math.random() * 120000)

        return () => {
            clearTimeout(first)
            clearInterval(interval)
        }

    }, [perfumes])

    return { visible, data }
}