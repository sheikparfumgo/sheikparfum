"use client";

import { useState } from "react";

export default function EditPerfumeTab({ perfumes }: any) {

    const [selectedId, setSelectedId] = useState<string>("");

    const [form, setForm] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [isEditingName, setIsEditingName] = useState(false);
    const [tempName, setTempName] = useState("");
    const [originalForm, setOriginalForm] = useState<any>(null);
    const hasChanges = JSON.stringify(form) !== JSON.stringify(originalForm);

    const [removeTypes, setRemoveTypes] = useState<string[]>([]);

    const [newImages, setNewImages] = useState({
        main: "",
        bottle: "",
        lifestyle: ""
    });

    // 🔥 carregar perfume completo
    async function loadPerfume(id: string) {

        if (!id || id === "undefined") return; // 🔥 proteção

        setLoading(true);

        const res = await fetch(`/api/admin/perfumes/${id}`);
        if (!res.ok) {
            const text = await res.text();
            console.error("Erro API:", text);
            alert("Erro ao salvar");
            return;
        }

        const json = await res.json();

        if (!json.success) {
            alert(json.error);
            setLoading(false);
            return;
        }

        setForm({
            ...json.data,
            top_notes: json.data.top_notes || [],
            heart_notes: json.data.heart_notes || [],
            base_notes: json.data.base_notes || []
        });
        const normalized = {
            ...json.data,
            top_notes: json.data.top_notes || [],
            heart_notes: json.data.heart_notes || [],
            base_notes: json.data.base_notes || []
        };

        setForm(normalized);
        setOriginalForm(normalized);
        setLoading(false);
    }

    async function handleSave() {

        if (!form?.id) return;

        const payload = {
            ...form,
            name: form.name?.trim() // 🔥 garante envio correto
        };

        const res = await fetch("/api/admin/perfumes/update-perfume", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        const json = await res.json();

        if (!json.success) {
            alert(json.error);
            return;
        }

        alert("Perfume atualizado 🚀");

        // 🔥 atualizar estado original (IMPORTANTE pro botão)
        setOriginalForm(payload);
    }

    // 🖼️ atualizar imagens
    async function handleUpdateImages() {

        const res = await fetch("/api/admin/perfumes/update-images", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                perfume_id: form.id,
                remove_types: removeTypes,
                new_images: newImages
            })
        });

        const json = await res.json();

        if (!json.success) {
            alert(json.error);
            return;
        }

        setForm((prev: any) => ({
            ...prev,
            images: json.images
        }));

        // ✅ RESET CORRETO
        setNewImages({
            main: "",
            bottle: "",
            lifestyle: ""
        });

        setRemoveTypes([]);

        alert("Imagens atualizadas 🚀");
    }

    return (
        <div className="space-y-4">

            <h2 className="text-xl font-semibold">
                ✏️ Editar Perfume
            </h2>

            {/* SELECT */}
            <select
                className="input-admin"
                value={selectedId}
                onChange={(e) => {
                    const id = e.target.value;
                    setSelectedId(id);
                    if (id) loadPerfume(id);
                }}
            >
                <option value="">Selecione</option>

                {perfumes.map((p: any) => (
                    <option key={p.id} value={String(p.id)}>
                        {p.perfume_name}
                    </option>
                ))}
            </select>

            {loading && <p>Carregando...</p>}

            {form && !loading && (
                <div className="space-y-4">

                    {/* TEXTOS */}
                    <div className="flex items-center gap-2">

                        {!isEditingName ? (
                            <>
                                <h3 className="text-lg font-semibold">
                                    {form.name}
                                </h3>

                                <button
                                    onClick={() => {
                                        setTempName(form.name);
                                        setIsEditingName(true);
                                    }}
                                    className="text-sm bg-zinc-800 px-2 py-1 rounded hover:bg-zinc-700"
                                >
                                    ✏️
                                </button>
                            </>
                        ) : (
                            <>
                                <input
                                    className="input-admin"
                                    value={tempName}
                                    onChange={(e) => setTempName(e.target.value)}
                                />

                                <button
                                    onClick={() => {
                                        setForm((prev: any) => ({
                                            ...prev,
                                            name: tempName.trim()
                                        }));
                                        setIsEditingName(false);
                                    }}
                                    className="bg-green-600 px-2 py-1 rounded text-sm"
                                >
                                    Salvar
                                </button>

                                <button
                                    onClick={() => {
                                        setIsEditingName(false);
                                        setTempName("");
                                    }}
                                    className="bg-zinc-700 px-2 py-1 rounded text-sm"
                                >
                                    Cancelar
                                </button>
                            </>
                        )}

                    </div>

                    <textarea
                        className="input-admin"
                        placeholder="Descrição"
                        value={form.description || ""}
                        onChange={(e) =>
                            setForm({ ...form, description: e.target.value })
                        }
                    />

                    <input
                        className="input-admin"
                        placeholder="Família olfativa"
                        value={form.olfactive_family || ""}
                        onChange={(e) =>
                            setForm({ ...form, olfactive_family: e.target.value })
                        }
                    />

                    <input
                        className="input-admin"
                        placeholder="Categoria"
                        value={form.category || ""}
                        onChange={(e) =>
                            setForm({ ...form, category: e.target.value })
                        }
                    />

                    <button
                        onClick={handleSave}
                        disabled={!hasChanges}
                        className="bg-white text-black px-4 py-2 rounded-xl disabled:opacity-50"
                    >
                        Salvar dados
                    </button>

                    {/* 🖼️ IMAGENS */}
                    <div className="space-y-3">

                        <h3 className="font-semibold">Imagens</h3>

                        <div className="flex gap-3 flex-wrap">
                            {form.images?.map((img: string) => {

                                const fileName = img.split("/").pop() || "";

                                const type =
                                    fileName.startsWith("main")
                                        ? "main"
                                        : fileName.startsWith("bottle")
                                            ? "bottle"
                                            : fileName.startsWith("lifestyle")
                                                ? "lifestyle"
                                                : "unknown";

                                const isRemoved = removeTypes.includes(type);

                                return (
                                    <div key={img} className="relative">

                                        <img
                                            src={img}
                                            className={`w-24 h-24 object-cover rounded transition
                    ${isRemoved ? "opacity-30 grayscale" : ""}
                `}
                                        />

                                        <button
                                            onClick={() =>
                                                setRemoveTypes(prev =>
                                                    prev.includes(type)
                                                        ? []
                                                        : [type]
                                                )
                                            }
                                            className={`absolute top-1 right-1 text-xs px-2 py-1 rounded
                    ${isRemoved ? "bg-red-600" : "bg-black/70"}
                `}
                                        >
                                            {isRemoved ? "Remover" : "X"}
                                        </button>

                                    </div>
                                );
                            })}
                        </div>

                        {/* INPUTS */}
                        <input
                            className="input-admin"
                            placeholder="Main URL"
                            value={newImages.main}
                            onChange={(e) =>
                                setNewImages({ ...newImages, main: e.target.value })
                            }
                        />

                        <input
                            className="input-admin"
                            placeholder="Bottle URL"
                            value={newImages.bottle}
                            onChange={(e) =>
                                setNewImages({ ...newImages, bottle: e.target.value })
                            }
                        />

                        <input
                            className="input-admin"
                            placeholder="Lifestyle URL"
                            value={newImages.lifestyle}
                            onChange={(e) =>
                                setNewImages({ ...newImages, lifestyle: e.target.value })
                            }
                        />

                        <button
                            onClick={handleUpdateImages}
                            disabled={
                                !removeTypes.length &&
                                !newImages.main &&
                                !newImages.bottle &&
                                !newImages.lifestyle
                            }
                            className="bg-blue-500 text-white px-4 py-2 rounded-xl disabled:opacity-50"
                        >
                            Atualizar imagens
                        </button>

                    </div>

                </div>
            )}

        </div>
    );
}