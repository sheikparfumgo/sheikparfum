import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { downloadPerfumeImages } from "@/lib/services/imageDownloader";

function getTypeFromUrl(url: string) {
    const fileName = url.split("/").pop() || "";

    if (fileName.startsWith("main")) return "main";
    if (fileName.startsWith("bottle")) return "bottle";
    if (fileName.startsWith("lifestyle")) return "lifestyle";

    return "unknown";
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        const {
            perfume_id,
            remove_types = [],
            new_images = {}
        } = body;

        if (!perfume_id) {
            return NextResponse.json({
                success: false,
                error: "perfume_id obrigatório"
            });
        }

        // 🔍 buscar perfume
        const { data: perfume, error } = await supabaseAdmin
            .from("perfumes")
            .select("id, name, images")
            .eq("id", perfume_id)
            .single();

        if (error) throw error;

        let currentImages: string[] = perfume.images || [];

        // 🗑️ remover imagens pelo tipo
        currentImages = currentImages.filter((img) => {
            const type = getTypeFromUrl(img);
            return !remove_types.includes(type);
        });

        // 🔥 montar URLs NA ORDEM CORRETA
        const urls: string[] = [
            new_images.main || "",
            new_images.bottle || "",
            new_images.lifestyle || ""
        ];

        let downloadedImages: string[] = [];

        // ⬇️ baixar novas imagens
        if (urls.length > 0) {
            const result = await downloadPerfumeImages(
                perfume.name,
                urls
            );

            downloadedImages = result.images || [];
        }

        // 🔥 remover duplicação por tipo (seguro)
        downloadedImages.forEach((newImg) => {
            const type = getTypeFromUrl(newImg);

            currentImages = currentImages.filter((img) => {
                return getTypeFromUrl(img) !== type;
            });
        });

        const finalImages = [...currentImages, ...downloadedImages];

        const imageMain =
            finalImages.find((img) => img.includes("main")) ||
            finalImages[0] ||
            null;

        // 💾 salvar
        const { error: updateError } = await supabaseAdmin
            .from("perfumes")
            .update({
                images: finalImages,
                image_main: imageMain
            })
            .eq("id", perfume_id);

        if (updateError) throw updateError;

        return NextResponse.json({
            success: true,
            images: finalImages
        });

    } catch (err: any) {
        return NextResponse.json({
            success: false,
            error: err.message
        });
    }
}