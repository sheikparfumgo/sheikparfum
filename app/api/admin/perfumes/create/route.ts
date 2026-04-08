import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { resolveBrand } from "@/lib/services/brand";
import { checkPerfumeExists } from "@/lib/services/perfume";
import { generateSlug } from "@/lib/utils/slug";
import { fetchPerfumeData } from "@/lib/services/fetchPerfumeData";
import { downloadPerfumeImages } from "@/lib/services/imageDownloader";
import { normalizePerfumeData } from "@/lib/services/perfumeNormalizer";
import { generateProducts } from "@/lib/services/productGenerator";
import { validateNotes } from "@/lib/services/noteValidator";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        const supabase = await createServerSupabase();

        const { name, brand, image_urls, cost } = body;

        // 🚨 validações básicas
        if (!name || !brand) {
            return NextResponse.json({
                success: false,
                error: "Nome e marca são obrigatórios",
            });
        }

        if (!image_urls || image_urls.length < 3) {
            return NextResponse.json({
                success: false,
                error: "Envie 3 imagens",
            });
        }

        if (!cost || isNaN(cost)) {
            return NextResponse.json({
                success: false,
                error: "Custo inválido",
            });
        }

        // 🧠 1. Brand
        const brandId = await resolveBrand(brand);

        // 🚫 2. Duplicidade
        const exists = await checkPerfumeExists(name, brandId);

        if (exists) {
            return NextResponse.json({
                success: false,
                error: "Perfume já existe",
            });
        }

        // 🌿 3. Dados (scraping + IA)
        const scraped = await fetchPerfumeData(name, brand);

        // 🔥 4. Normalização
        const normalized = normalizePerfumeData(scraped);

        // 🔥 5. Validação REAL (AGORA CORRETO)
        const validation = validateNotes(normalized);

        if (validation.score < 50) {
            return NextResponse.json({
                success: false,
                error: "Perfume com baixa qualidade de dados",
                details: validation.errors,
                score: validation.score
            });
        }

        // 🖼️ 6. Imagens
        const imagesData = await downloadPerfumeImages(name, image_urls);

        // 🔗 7. Slug
        const slug = generateSlug(name);

        // 💾 8. Insert
        const { data, error } = await supabase
            .from("perfumes")
            .insert({
                name,
                name_normalized: name.toLowerCase().trim(),

                brand_id: brandId,
                slug,

                description: normalized.description,

                image_main: imagesData.image_main,
                images: imagesData.images,

                top_notes: normalized.notes.top,
                heart_notes: normalized.notes.heart,
                base_notes: normalized.notes.base,

                olfactive_family: normalized.olfactive_family,
                category: normalized.category,
                gender: normalized.gender,
            })
            .select()
            .single();

        if (error) {
            throw new Error(error.message);
        }

        // 🔥 9. Products
        await generateProducts(data.id, cost);

        return NextResponse.json({
            success: true,
            data,
        });

    } catch (err: any) {
        return NextResponse.json({
            success: false,
            error: err.message,
        });
    }
}