"use client";

import { useEffect, useState } from "react";

export default function AddReviewTab() {

    const [perfumes, setPerfumes] = useState<any[]>([]);
    const [selectedPerfume, setSelectedPerfume] = useState<any>(null);

    const [youtubeUrl, setYoutubeUrl] = useState("");
    const [instagramUrl, setInstagramUrl] = useState("");
    const [thumbnail, setThumbnail] = useState("");

    const [isFeatured, setIsFeatured] = useState(false);

    // 🔍 buscar perfumes
    useEffect(() => {
        async function fetchPerfumes() {
            const res = await fetch("/api/admin/perfumes");
            const json = await res.json();

            const sorted = (json.data || []).sort((a: any, b: any) =>
                a.perfume_name.localeCompare(b.perfume_name)
            );

            setPerfumes(sorted);
        }

        fetchPerfumes();
    }, []);

    async function handleCreateReview() {

        if (!selectedPerfume) {
            alert("Selecione um perfume");
            return;
        }

        if (!youtubeUrl && !instagramUrl) {
            alert("Adicione pelo menos um link (YouTube ou Instagram)");
            return;
        }

        const res = await fetch("/api/perfume-reviews", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                perfume_id: selectedPerfume.id,
                youtube_url: youtubeUrl || null,
                instagram_url: instagramUrl || null,
                thumbnail_url: thumbnail || null,
                is_featured: isFeatured
            })
        });

        const json = await res.json();

        if (!json.success) {
            alert(json.error);
            return;
        }

        alert("Review criada 🚀");

        // reset
        setSelectedPerfume(null);
        setYoutubeUrl("");
        setInstagramUrl("");
        setThumbnail("");
        setIsFeatured(false);
    }

    return (
        <div className="space-y-6">

            <h2 className="text-xl font-semibold">
                🎥 Adicionar Review
            </h2>

            {/* 🔍 busca perfume */}
            <select
                className="input-admin"
                value={selectedPerfume?.id || ""}
                onChange={(e) => {
                    const perfume = perfumes.find(p => p.id === e.target.value);
                    setSelectedPerfume(perfume);
                }}
            >
                <option value="">Selecione um perfume</option>

                {perfumes.map((p) => (
                    <option key={p.id} value={p.id}>
                        {p.perfume_name} — {p.brand}
                    </option>
                ))}
            </select>

            {/* selecionado */}
            {selectedPerfume && (
                <div className="bg-zinc-900 p-3 rounded-xl border border-zinc-800">
                    Selecionado: <strong>{selectedPerfume.perfume_name}</strong>
                </div>
            )}

            {/* inputs */}
            <input
                placeholder="YouTube URL"
                className="input-admin"
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
            />

            <input
                placeholder="Instagram URL"
                className="input-admin"
                value={instagramUrl}
                onChange={(e) => setInstagramUrl(e.target.value)}
            />

            <input
                placeholder="Thumbnail URL"
                className="input-admin"
                value={thumbnail}
                onChange={(e) => setThumbnail(e.target.value)}
            />

            {/* destaque */}
            <label className="flex items-center gap-2">
                <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                />
                Hoje no Radar (destaque)
            </label>

            {/* botão */}
            <button
                onClick={handleCreateReview}
                className="bg-white text-black px-4 py-2 rounded-xl"
            >
                Criar Review
            </button>
        </div>
    );
}