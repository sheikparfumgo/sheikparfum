"use client";

import { useState } from "react";

export default function AddPerfumeTab() {

    const [name, setName] = useState("");
    const [brand, setBrand] = useState("");

    const [imageUrls, setImageUrls] = useState(["", "", ""]);
    const [cost, setCost] = useState("");

    const [loading, setLoading] = useState(false);
    const [preview, setPreview] = useState<any>(null);

    const pricing = cost ? calculatePreviewPricing(Number(cost)) : null;

    function calculatePreviewPricing(cost: number) {

        let multiplier = 2;

        if (cost <= 100) multiplier = 3;
        else if (cost <= 200) multiplier = 2.55;
        else if (cost <= 300) multiplier = 2.25;
        else if (cost <= 400) multiplier = 2;

        const full = cost * multiplier;

        const pricePerMl = full / 100;

        const decant5 = pricePerMl * 5 * 1.6;
        const decant10 = pricePerMl * 10 * 1.4;

        return {
            full: round(full),
            decant5: round(decant5),
            decant10: round(decant10),
        };
    }

    function round(value: number) {
        if (value < 100) return Math.floor(value) + 0.9;
        return Math.round(value / 10) * 10 - 1;
    }

    // 🔍 Buscar dados (scraping)
    async function handleFetch() {
        try {
            setLoading(true);

            const res = await fetch("/api/admin/perfumes/fetch-data", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ name, brand })
            });

            const json = await res.json();

            if (!json.success) {
                alert(json.error);
                return;
            }

            setPreview(json.data);

        } catch (err) {
            alert("Erro ao buscar dados");
        } finally {
            setLoading(false);
        }
    }

    // 💾 Criar perfume
    async function handleCreate() {
        try {

            // 🔥 VALIDAÇÕES
            if (!name || !brand) {
                alert("Preencha nome e marca");
                return;
            }

            if (!cost || Number(cost) <= 0) {
                alert("Informe o custo do perfume");
                return;
            }

            if (imageUrls.some(url => !url)) {
                alert("Preencha as 3 imagens");
                return;
            }

            // 🚀 CREATE
            const res = await fetch("/api/admin/perfumes/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name,
                    brand,
                    image_urls: imageUrls,
                    cost: Number(cost)
                })
            });

            const json = await res.json();

            if (!json.success) {
                alert(json.error);
                return;
            }

            alert("Perfume criado com sucesso 🚀");

            // 🔄 RESET
            setName("");
            setBrand("");
            setCost("");
            setImageUrls(["", "", ""]);
            setPreview(null);

        } catch (err) {
            alert("Erro ao criar perfume");
        }
    }

    return (
        <div className="space-y-6">

            <h2 className="text-xl font-semibold">
                Adicionar Perfume Inteligente
            </h2>

            {/* INPUTS */}
            <div className="grid md:grid-cols-2 gap-3">

                <input
                    placeholder="Nome do perfume"
                    className="input-admin"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />

                <input
                    placeholder="Marca"
                    className="input-admin"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                />

                <input
                    type="number"
                    placeholder="Custo do perfume (ex: 220)"
                    className="input-admin"
                    value={cost}
                    onChange={(e) => setCost(e.target.value)}
                />

            </div>

            {/* IMAGENS */}
            <div className="grid md:grid-cols-3 gap-3">

                {imageUrls.map((url, i) => (
                    <input
                        key={i}
                        placeholder={`URL imagem ${i + 1}`}
                        className="input-admin"
                        value={url}
                        onChange={(e) => {
                            const updated = [...imageUrls];
                            updated[i] = e.target.value;
                            setImageUrls(updated);
                        }}
                    />
                ))}

            </div>

            {/* BOTÕES */}
            <div className="flex gap-2">

                <button
                    onClick={handleFetch}
                    className="btn-primary"
                >
                    Buscar dados
                </button>

                <button
                    onClick={handleCreate}
                    className="btn-primary"
                >
                    Salvar perfume
                </button>

            </div>

            {loading && (
                <p className="text-zinc-400 text-sm">
                    Buscando dados...
                </p>
            )}

            {/* PREVIEW */}
            {preview && (
                <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-800 space-y-3">

                    <h3 className="font-semibold text-lg">
                        {name} - {brand}
                    </h3>

                    <p className="text-sm text-zinc-400">
                        {preview.description}
                    </p>

                    <div className="text-sm space-y-1">

                        <p>
                            <strong>Topo:</strong>{" "}
                            {preview.notes.top?.join(", ") || "-"}
                        </p>

                        <p>
                            <strong>Coração:</strong>{" "}
                            {preview.notes.heart?.join(", ") || "-"}
                        </p>

                        <p>
                            <strong>Base:</strong>{" "}
                            {preview.notes.base?.join(", ") || "-"}
                        </p>

                    </div>

                    {pricing && (
                        <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-800 space-y-2">

                            <h3 className="font-semibold text-lg">
                                💰 Preview de Preço
                            </h3>

                            <p>5ml: R$ {pricing.decant5}</p>
                            <p>10ml: R$ {pricing.decant10}</p>
                            <p>100ml: R$ {pricing.full}</p>

                        </div>
                    )}

                </div>
            )}

        </div>
    );
}