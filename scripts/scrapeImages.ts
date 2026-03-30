import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import axios from "axios";
import * as cheerio from "cheerio";
import { createClient } from "@supabase/supabase-js";

// 🔐 Supabase
const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;

const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("❌ ERRO: Variáveis do Supabase ausentes");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// ⏱ delay anti-bloqueio
const DELAY_MS = 3000;
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * 🔎 Busca imagem direto no Fragrantica (SEM GOOGLE)
 */
async function getFragranticaImage(
    perfumeName: string,
    brand: string
): Promise<string | null> {
    try {
        const query = `${perfumeName} ${brand}`;
        const searchUrl = `https://www.fragrantica.com/search/?query=${encodeURIComponent(
            query
        )}`;

        const searchRes = await axios.get(searchUrl, {
            headers: { "User-Agent": "Mozilla/5.0" },
        });

        const $ = cheerio.load(searchRes.data);

        const firstLink = $("a[href*='/perfume/']").first().attr("href");

        if (!firstLink) return null;

        const perfumeUrl = `https://www.fragrantica.com${firstLink}`;

        const perfumeRes = await axios.get(perfumeUrl, {
            headers: { "User-Agent": "Mozilla/5.0" },
        });

        const $$ = cheerio.load(perfumeRes.data);

        const image =
            $$("meta[property='og:image']").attr("content") ||
            $$("img[itemprop='image']").attr("src") ||
            null;

        return image;
    } catch (err) {
        return null;
    }
}

/**
 * 🚀 LOOP PRINCIPAL
 */
async function runScraper() {
    console.log("\n🚀 Iniciando scraping...\n");

    const { data: perfumes, error } = await supabase
        .from("perfumes")
        .select(`
      id,
      name,
      image_url,
      brand_id,
      brands (
        name
      )
    `);

    if (error) {
        console.error("❌ Erro ao buscar perfumes:", error.message);
        return;
    }

    if (!perfumes || perfumes.length === 0) {
        console.log("⚠️ Nenhum perfume encontrado");
        return;
    }

    console.log(`📦 ${perfumes.length} perfumes encontrados\n`);

    for (const p of perfumes) {
        const brandName = p.brands?.[0]?.name || "";

        // já tem imagem
        if (p.image_url) {
            console.log("⏭️ Já tem imagem:", p.name);
            continue;
        }

        if (!p.name) {
            console.log("⚠️ Sem nome:", p.id);
            continue;
        }

        console.log(`🔍 Buscando: ${p.name} (${brandName})`);

        const image = await getFragranticaImage(p.name, brandName);

        if (!image) {
            console.log("❌ Não encontrado:", p.name);
            continue;
        }

        const { error: updateError } = await supabase
            .from("perfumes")
            .update({ image_url: image })
            .eq("id", p.id);

        if (updateError) {
            console.log("❌ Erro ao salvar:", p.name);
        } else {
            console.log("✅ Salvo:", p.name);
        }

        await sleep(DELAY_MS);
    }

    console.log("\n🎉 Finalizado!\n");
}

runScraper();