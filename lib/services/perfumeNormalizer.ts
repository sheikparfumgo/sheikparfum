export function normalizePerfumeData(data: any) {

    return {
        description: data.description || "Fragrância envolvente e bem construída, com excelente equilíbrio entre notas.",

        notes: {
            top: data.notes?.top?.length ? data.notes.top : ["Bergamota"],
            heart: data.notes?.heart?.length ? data.notes.heart : ["Jasmim"],
            base: data.notes?.base?.length ? data.notes.base : ["Âmbar"],
        },

        olfactive_family: data.olfactive_family || "Amadeirado",

        category: data.category || "Versátil",

        gender: normalizeGender(data.gender),
    };
}

function normalizeGender(gender?: string) {

    if (!gender) return "unissex";

    const g = gender.toLowerCase();

    if (g.includes("masc")) return "masculino";
    if (g.includes("fem")) return "feminino";
    if (g.includes("uni")) return "unissex";

    return "unissex";
}