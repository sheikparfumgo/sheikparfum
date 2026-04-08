import axios from "axios";
import * as cheerio from "cheerio";
import { generatePerfumeData } from "@/lib/services/aiPerfume";
import { validateNotes } from "@/lib/services/noteValidator";

export async function fetchPerfumeData(name: string, brand: string) {

    async function getValidatedAI() {
        const aiData = await generatePerfumeData(name, brand);

        const validation = validateNotes(aiData);

        if (!validation.valid) {
            console.warn("IA RUIM:", validation);

            // 🔁 retry
            const retry = await generatePerfumeData(name, brand);
            const retryValidation = validateNotes(retry);

            return {
                ...retry,
                score: retryValidation.score,
                quality: retryValidation.valid ? "medium" : "low",
                source: "ai_retry"
            };
        }

        return {
            ...aiData,
            score: validation.score,
            quality: "high",
            source: "ai"
        };
    }

    try {
        const query = `${name} ${brand} fragrantica`;

        const googleUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;

        const googleRes = await axios.get(googleUrl, {
            headers: { "User-Agent": "Mozilla/5.0" },
        });

        const $g = cheerio.load(googleRes.data);

        let url: string | null = null;

        $g("a").each((_, el) => {
            const href = $g(el).attr("href");

            if (href?.includes("fragrantica.com") && href.includes("/perfume/")) {
                const match = href.match(/https?:\/\/[^&]+/);
                if (match) {
                    url = match[0];
                    return false;
                }
            }
        });

        // 🚨 fallback total → IA
        if (!url) {
            return await getValidatedAI();
        }

        // 🌐 Página do perfume
        const res = await axios.get(url, {
            headers: { "User-Agent": "Mozilla/5.0" },
        });

        const $ = cheerio.load(res.data);

        const description =
            $("div[itemprop='description']").text().trim() ||
            $(".fragrantica-description").text().trim() ||
            "";

        const top: string[] = [];
        const heart: string[] = [];
        const base: string[] = [];

        $(".pyramid .note").each((_, el) => {
            const note = $(el).text().trim();

            if ($(el).closest(".top").length) top.push(note);
            if ($(el).closest(".middle").length) heart.push(note);
            if ($(el).closest(".base").length) base.push(note);
        });

        let gender = "";

        const pageText = $("body").text().toLowerCase();

        if (pageText.includes("for men")) gender = "masculino";
        else if (pageText.includes("for women")) gender = "feminino";
        else if (pageText.includes("unisex")) gender = "unissex";

        // 🚨 fallback parcial → IA VALIDADA
        if (!description || (top.length === 0 && heart.length === 0 && base.length === 0)) {
            return await getValidatedAI();
        }

        return {
            description,
            notes: {
                top,
                heart,
                base,
            },
            olfactive_family: "",
            category: "",
            gender,
            score: 100,
            quality: "high",
            source: "scraped"
        };

    } catch (err) {
        return await getValidatedAI();
    }
}