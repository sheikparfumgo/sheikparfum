"use client"

import useEmblaCarousel from "embla-carousel-react"
import { useCallback, useEffect, useState, useRef } from "react"
import Image from "next/image"
import { useAuth } from "@/hooks/useAuth"
import Link from "next/link"
import confetti from "canvas-confetti"
import PerfumeCard from "@/components/perfume/PerfumeCard"
import { supabase } from "@/lib/supabase/client"

type Slide = {
    title?: string
    subtitle?: string
    description?: string
    image: string
    href?: string
    cta?: string
    overlay?: boolean
    action?: "link" | "quiz"
}

const slides: Slide[] = [
    {
        title: "Descubra perfumes que combinam com você",
        subtitle: "Teste olfativo",
        description: "Faça o teste e encontre fragrâncias ideais para seu estilo.",
        image: "/banners/teste-olfativo.png",
        action: "quiz", // ✅ NOVO
        cta: "Fazer teste",
        overlay: true
    },
    {
        title: "Receba perfumes exclusivos todo mês",
        subtitle: "Clube do Sheik",
        description: "Assine o clube e explore novas fragrâncias todos os meses.",
        image: "/banners/clube-do-sheik.png",
        href: "/clube",
        cta: "Conhecer o clube",
        overlay: true
    },
    {
        title: "Experimente antes de comprar",
        subtitle: "Decants",
        description: "Teste perfumes exclusivos antes de investir no frasco.",
        image: "/banners/decants.png",
        href: "/loja",
        cta: "Explorar decants",
        overlay: true
    }
]

export default function HeroCarousel() {

    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true })
    const [selectedIndex, setSelectedIndex] = useState(0)
    const [openQuiz, setOpenQuiz] = useState(false)
    const [step, setStep] = useState(1)
    const [answers, setAnswers] = useState<any>({})
    const [quizFinished, setQuizFinished] = useState(false)
    const { user } = useAuth()

    const onSelect = useCallback(() => {
        if (!emblaApi) return
        setSelectedIndex(emblaApi.selectedScrollSnap())
    }, [emblaApi])

    useEffect(() => {
        if (!emblaApi) return
        onSelect()
        emblaApi.on("select", onSelect)
    }, [emblaApi, onSelect])

    useEffect(() => {
        if (!emblaApi) return
        const autoplay = setInterval(() => emblaApi.scrollNext(), 6000)
        return () => clearInterval(autoplay)
    }, [emblaApi])

    useEffect(() => {
        if (quizFinished) {

            const duration = 1500
            const end = Date.now() + duration

            const interval = setInterval(() => {
                if (Date.now() > end) return clearInterval(interval)

                confetti({
                    particleCount: 20,
                    spread: 100,
                    origin: {
                        x: Math.random(),
                        y: Math.random() - 0.2
                    }
                })
            }, 200)
        }
    }, [quizFinished])

    useEffect(() => {
        const handler = (e: any) => {
            setOpenQuiz(true)

            setQuizFinished(false)
            setAnswers({})
            setStep(e.detail?.step || 1)
        }

        window.addEventListener("openQuiz", handler)

        return () => window.removeEventListener("openQuiz", handler)
    }, [])

    useEffect(() => {
        if (quizFinished) {
            setTimeout(() => {
                window.scrollTo({
                    top: document.body.scrollHeight,
                    behavior: "smooth"
                })
            }, 300)
        }
    }, [quizFinished])

    function handleMultiAnswer(key: string, value: string) {

        const current = answers[key] || []

        const exists = current.includes(value)

        const updatedArray = exists
            ? current.filter((v: string) => v !== value)
            : [...current, value]

        const updated = { ...answers, [key]: updatedArray }

        setAnswers(updated)
    }

    function nextStep() {
        if (step < 4) {
            setStep(step + 1)
        } else {
            saveQuiz(answers)
        }
    }

    async function saveQuiz(result: any) {

        const {
            data: { session }
        } = await supabase.auth.getSession()

        await fetch("/api/profile/olfactive", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${session?.access_token}`
            },
            body: JSON.stringify({
                olfactive_profile: result
            })
        })

        setQuizFinished(true)

        window.dispatchEvent(
            new CustomEvent("quizCompleted", {
                detail: { completed: true }
            })
        )
    }

    return (
        <section className="mt-6">

            <div className="overflow-hidden rounded-2xl w-full" ref={emblaRef}>
                <div className="flex w-full max-w-full">

                    {slides.map((slide, i) => (
                        <div
                            key={i}
                            onClick={() => {
                                if (slide.action === "quiz") {

                                    if (!user) {
                                        window.location.href = "/login?redirect=/perfil"
                                        return
                                    }

                                    setOpenQuiz(true)

                                } else if (slide.href) {
                                    window.location.href = slide.href
                                }
                            }}
                            className="relative flex-[0_0_100%] h-[180px] sm:h-[220px] md:h-[260px] cursor-pointer"
                        >

                            <Image
                                src={slide.image}
                                alt={slide.title ?? slide.subtitle ?? "Banner Sheik Parfum"}
                                fill
                                priority={i === 0}
                                className="object-cover object-center md:object-[60%_center]"
                            />

                            {slide.overlay && (
                                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent flex flex-col justify-center px-4 sm:px-6 md:px-8 max-w-[85%] md:max-w-xl">

                                    {slide.subtitle && (
                                        <p className="text-[10px] sm:text-sm text-[#c9a34a] uppercase tracking-widest">
                                            {slide.subtitle}
                                        </p>
                                    )}

                                    {slide.title && (
                                        <h2 className="text-lg sm:text-2xl md:text-4xl font-bold text-white leading-tight">
                                            {slide.title}
                                        </h2>
                                    )}

                                    {slide.description && (
                                        <p className="text-gray-300 text-xs sm:text-sm md:text-base mt-1 md:mt-2">
                                            {slide.description}
                                        </p>
                                    )}

                                    {slide.cta && (
                                        <span className="mt-2 md:mt-4 bg-[#c9a34a] text-black font-bold text-xs sm:text-sm md:text-base px-4 md:px-5 py-2 rounded-xl w-fit hover:brightness-110 transition">
                                            {slide.cta}
                                        </span>
                                    )}

                                </div>
                            )}
                        </div>
                    ))}

                </div>
            </div>

            {/* DOTS */}
            <div className="flex justify-center gap-2 mt-4">
                {slides.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => emblaApi?.scrollTo(i)}
                        className={`h-2 rounded-full transition-all ${selectedIndex === i
                            ? "w-6 bg-[#c9a34a]"
                            : "w-2 bg-gray-600"
                            }`}
                    />
                ))}
            </div>
            {openQuiz && (
                <div
                    className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center"
                    onClick={() => setOpenQuiz(false)}
                >

                    <div
                        className="bg-zinc-900 p-6 rounded-xl w-[420px] space-y-4"
                        onClick={(e) => e.stopPropagation()}
                    >

                        {quizFinished ? (
                            <div className="space-y-4 py-6">

                                {/* HEADER */}
                                <div className="text-center">
                                    <h2 className="text-xl font-bold text-[#c9a34a]">
                                        🎉 Parabéns!
                                    </h2>

                                    <p className="text-sm text-zinc-300 mt-2">
                                        Você concluiu seu teste olfativo.
                                    </p>
                                </div>


                                {/* BOTÃO FINAL */}
                                <button
                                    onClick={() => {
                                        setOpenQuiz(false)
                                        setQuizFinished(false)
                                        setStep(1)
                                        setAnswers({})
                                    }}
                                    className="btn-primary w-full mt-2"
                                >
                                    Fechar
                                </button>

                            </div>
                        ) : (
                            <>
                                <h2 className="text-lg font-bold">
                                    Descubra seu perfume ideal
                                </h2>
                                <p className="text-xs text-zinc-500">
                                    Etapa {step} de 4
                                </p>
                                {step === 1 && (
                                    <>
                                        <p className="text-sm text-zinc-400">Quais aromas você gosta?</p>

                                        {[
                                            { value: "citrus", label: "Cítrico 🍋" },
                                            { value: "woody", label: "Amadeirado 🌳" },
                                            { value: "sweet", label: "Doce 🍬" },
                                            { value: "fresh", label: "Fresco 🌿" },
                                            { value: "spicy", label: "Especiado 🔥" }
                                        ].map((item) => (
                                            <button
                                                key={item.label}
                                                onClick={() => handleMultiAnswer("families", item.value)}
                                                className={`w-full p-2 rounded border ${(answers.families || []).includes(item.value)
                                                    ? "bg-[#c9a34a] text-black"
                                                    : "bg-zinc-800 text-white"
                                                    }`}
                                            >
                                                {item.label}
                                            </button>
                                        ))}

                                        <button
                                            onClick={nextStep}
                                            disabled={!answers.families?.length}
                                            className="btn-secondary w-full disabled:opacity-40"
                                        >
                                            Continuar
                                        </button>
                                    </>
                                )}

                                {step === 2 && (
                                    <>
                                        <p className="text-sm text-zinc-400">Quando você pretende usar?</p>

                                        {[
                                            { value: "day", label: "Dia a dia ☀️" },
                                            { value: "night", label: "Noite 🌙" },
                                            { value: "date", label: "Encontro ❤️" },
                                            { value: "work", label: "Trabalho 💼" },
                                            { value: "gym", label: "Academia 🏋️" }
                                        ].map((item) => (
                                            <button
                                                key={item.label}
                                                onClick={() => handleMultiAnswer("occasions", item.value)}
                                                className={`w-full p-2 rounded border ${(answers.occasions || []).includes(item.value)
                                                    ? "bg-[#c9a34a] text-black"
                                                    : "bg-zinc-800 text-white"
                                                    }`}
                                            >
                                                {item.label}
                                            </button>
                                        ))}

                                        <button
                                            onClick={nextStep}
                                            disabled={!answers.occasions?.length}
                                            className="btn-secondary w-full disabled:opacity-40"
                                        >
                                            Continuar
                                        </button>
                                    </>
                                )}

                                {step === 3 && (
                                    <>
                                        <p className="text-sm text-zinc-400">Qual intensidade?</p>

                                        {[
                                            { value: "light", label: "Suave 🌿" },
                                            { value: "medium", label: "Moderado ⚖️" },
                                            { value: "strong", label: "Marcante 🔥" }
                                        ].map((item) => (
                                            <button
                                                key={item.label}
                                                onClick={() =>
                                                    setAnswers({ ...answers, intensity: item.value })
                                                }
                                                className={`w-full p-2 rounded border ${answers.intensity === item.value
                                                    ? "bg-[#c9a34a] text-black"
                                                    : "bg-zinc-800 text-white"
                                                    }`}
                                            >
                                                {item.label}
                                            </button>
                                        ))}

                                        <button
                                            onClick={nextStep}
                                            disabled={!answers.intensity}
                                            className="btn-secondary w-full disabled:opacity-40"
                                        >
                                            Continuar
                                        </button>
                                    </>
                                )}

                                {step === 4 && (
                                    <>
                                        <p className="text-sm text-zinc-400">Clima ideal?</p>

                                        {[
                                            { value: "hot", label: "Calor ☀️" },
                                            { value: "cold", label: "Frio ❄️" },
                                            { value: "any", label: "Tanto faz 🔄" }
                                        ].map((item) => (
                                            <button
                                                key={item.label}
                                                onClick={() =>
                                                    setAnswers({ ...answers, weather: item.value })
                                                }
                                                className={`w-full p-2 rounded border ${answers.weather === item.value
                                                    ? "bg-[#c9a34a] text-black"
                                                    : "bg-zinc-800 text-white"
                                                    }`}
                                            >
                                                {item.label}
                                            </button>
                                        ))}

                                        <button
                                            onClick={nextStep}
                                            disabled={!answers.weather}
                                            className="btn-secondary w-full disabled:opacity-40"
                                        >
                                            Finalizar
                                        </button>
                                    </>
                                )}
                            </>
                        )}
                    </div>
                </div>
            )}
        </section>
    )
}