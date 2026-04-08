type Notes = {
    top: string[];
    heart: string[];
    base: string[];
};

const NOTE_CATEGORIES: Record<string, string> = {

    // Especiado
    "Cardamomo": "Especiado",
    "Pimenta Rosa": "Especiado",
    "Pimenta": "Especiado",
    "Canela": "Especiado",
    "Cravo": "Especiado",
    "Noz-moscada": "Especiado",

    // Amadeirado
    "Oud": "Amadeirado",
    "Sândalo": "Amadeirado",
    "Vetiver": "Amadeirado",
    "Cedro": "Amadeirado",
    "Patchouli": "Amadeirado",
    "Madeira": "Amadeirado",
    "Madeiras": "Amadeirado",
    "Madeira clara": "Amadeirado",

    // Gourmand
    "Baunilha": "Gourmand",
    "Tonka": "Gourmand",
    "Caramelo": "Gourmand",
    "Chocolate": "Gourmand",
    "Mel": "Gourmand",
    "Açúcar": "Gourmand",
    "Coco": "Gourmand",
    "Café": "Gourmand",
    "Frutas vermelhas": "Gourmand",

    // Cítrico
    "Limão": "Cítrico",
    "Laranja": "Cítrico",
    "Tangerina": "Cítrico",
    "Grapefruit": "Cítrico",
    "Bergamota": "Cítrico",
    "Cítrico": "Cítrico",

    // Floral
    "Rosa": "Floral",
    "Jasmim": "Floral",
    "Ylang-Ylang": "Floral",
    "Flor de Laranjeira": "Floral",
    "Lírio": "Floral",

    // Aromático
    "Lavanda": "Aromático",
    "Hortelã": "Aromático",
    "Alecrim": "Aromático",
    "Manjericão": "Aromático",
    "Notas verdes": "Aromático",

    // Aquático
    "Notas aquáticas": "Aquático",
    "Aquático": "Aquático",
    "Marinho": "Aquático",

    // Musk
    "Almíscar": "Musk",
    "Musk branco": "Musk",
    "Sabão": "Musk",

    // Resinoso / Extra
    "Âmbar": "Resinoso",
    "Resinas": "Resinoso",
    "Incenso": "Resinoso",
    "Fumaça": "Resinoso",
    "Couro": "Couro"
};

function getCategory(note: string) {
    return NOTE_CATEGORIES[note] || "Desconhecido";
}

export function validateNotes(data: {
    notes: Notes;
    olfactive_family: string;
}) {

    const allNotes = [
        ...data.notes.top,
        ...data.notes.heart,
        ...data.notes.base
    ];

    const categories = allNotes.map(getCategory);

    let errors: string[] = [];

    const has = (cat: string) => categories.includes(cat);

    // 🔥 REGRA 1 — GOURMAND
    if (has("Gourmand")) {

        if (has("Aromático")) {
            errors.push("Gourmand não combina com notas aromáticas (ex: lavanda)");
        }

        if (has("Aquático")) {
            errors.push("Gourmand não combina com notas aquáticas");
        }

        if (has("Cítrico") && !has("Gourmand")) {
            errors.push("Cítrico isolado não faz sentido com gourmand dominante");
        }
    }

    // 🔥 REGRA 2 — CÍTRICO / FRESCO
    if (has("Cítrico") || has("Aquático")) {

        if (has("Gourmand")) {
            errors.push("Perfume fresco não combina com notas gourmand pesadas");
        }

        if (has("Resinoso") && !has("Amadeirado")) {
            errors.push("Fresco com resinoso pesado é incoerente");
        }
    }

    // 🔥 REGRA 3 — CONTRASTE EXTREMO
    if (
        has("Gourmand") &&
        (has("Aquático") || has("Aromático"))
    ) {
        errors.push("Mistura incoerente: doce + fresco/aromático");
    }

    // 🔥 REGRA 4 — PIRÂMIDE LÓGICA
    if (data.notes.base.length === 0) {
        errors.push("Base vazia (sem fixação)");
    }

    if (data.notes.top.length === 0) {
        errors.push("Topo vazio");
    }

    // 🔥 REGRA 5 — NOTAS DESCONHECIDAS
    const unknown = allNotes.filter(n => getCategory(n) === "Desconhecido");

    if (unknown.length > 0) {
        errors.push(`Notas desconhecidas: ${unknown.join(", ")}`);
    }

    let score = 100;

    // penalidades
    score -= errors.length * 20;

    if (score < 0) score = 0;

    return {
        valid: score >= 60,
        score,
        errors
    };
}