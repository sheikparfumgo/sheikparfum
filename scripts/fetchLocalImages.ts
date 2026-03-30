import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import fs from "fs";
import path from "path";
import axios from "axios";
import google from "googlethis";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("❌ ERRO: Variáveis do Supabase ausentes");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Baixar uma imagem para a máquina local
async function downloadImage(url: string, dest: string): Promise<boolean> {
    try {
        const response = await axios({
            url,
            method: 'GET',
            responseType: 'stream',
            timeout: 10000,
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
            }
        });
        
        return new Promise((resolve, reject) => {
            const writer = fs.createWriteStream(dest);
            response.data.pipe(writer);
            writer.on('finish', () => resolve(true));
            writer.on('error', () => {
                fs.unlink(dest, () => {});
                resolve(false);
            });
        });
    } catch (e) {
        return false;
    }
}

// Procurar imagem no Google usando a biblioteca `googlethis`
async function searchGoogleImage(query: string): Promise<string | null> {
    try {
        const images = await google.image(query, { safe: false });
        if (images && images.length > 0) {
            // Retorna o link da primeira imagem válida
            return images[0].url;
        }
        return null;
    } catch (e: any) {
        console.error(`⚠️ Falha na busca Google para "${query}":`, e.message);
        return null;
    }
}

// Transformar nomes em slugs se não tiver slud gerado
function generateSlug(name: string) {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
}

async function run() {
    console.log("🚀 Iniciando o robô de extração e salvamento de imagens locais...\n");

    const { data: perfumes, error } = await supabase
        .from('perfumes')
        .select('id, name, slug, image_url, brand_id, brands(name)');

    if (error) {
        console.error("❌ Erro ao buscar perfumes:", error.message);
        return;
    }

    if (!perfumes || perfumes.length === 0) {
        console.log("⚠️ Nenhum perfume encontrado.");
        return;
    }

    const publicImagesDir = path.join(process.cwd(), "public", "images", "perfumes");
    if (!fs.existsSync(publicImagesDir)) {
        fs.mkdirSync(publicImagesDir, { recursive: true });
    }

    let successCount = 0;

    for (const p of perfumes) {
        const brandName = p.brands?.[0]?.name || "perfume";
        const slug = p.slug || generateSlug(p.name);
        const perfumeDir = path.join(publicImagesDir, slug);

        // Cria a pasta para esse perfume, se não existir
        if (!fs.existsSync(perfumeDir)) {
            fs.mkdirSync(perfumeDir, { recursive: true });
        }

        console.log(`\n📦 Processando: ${p.name}`);

        const mainImagePath = path.join(perfumeDir, "main.jpg");
        const isolatedImagePath = path.join(perfumeDir, "2.jpg");
        const lifestyleImagePath = path.join(perfumeDir, "3.jpg");

        const localPaths = [];

        // 1. Packshot / Main Image
        // Já temos um URL oficial ou do Bucket em p.image_url que foi curado. 
        // Vamos baixar ELE diretamente como main.jpg, garantindo a curadoria anterior!
        if (p.image_url) {
            if (!fs.existsSync(mainImagePath)) {
                console.log(` ⬇️ Baixando Main Packshot...`);
                const success = await downloadImage(p.image_url, mainImagePath);
                if (success) localPaths.push(`/images/perfumes/${slug}/main.jpg`);
            } else {
                console.log(` ⏭️ Main Packshot já existe em cache.`);
                localPaths.push(`/images/perfumes/${slug}/main.jpg`);
            }
        }

        // 2. Frasco Isolado (2.jpg)
        if (!fs.existsSync(isolatedImagePath)) {
            console.log(` 🔍 Buscando Frasco Isolado...`);
            const isolatedUrl = await searchGoogleImage(`${p.name} ${brandName} perfume bottle white background isolated`);
            if (isolatedUrl) {
                const success = await downloadImage(isolatedUrl, isolatedImagePath);
                if (success) localPaths.push(`/images/perfumes/${slug}/2.jpg`);
            }
        } else {
            console.log(` ⏭️ Frasco isolado já existe em cache.`);
            localPaths.push(`/images/perfumes/${slug}/2.jpg`);
        }

        // 3. Imagem Lifestyle (3.jpg)
        if (!fs.existsSync(lifestyleImagePath)) {
            console.log(` 🔍 Buscando Lifestyle...`);
            const lifestyleUrl = await searchGoogleImage(`${p.name} ${brandName} perfume photography lifestyle aesthetic review`);
            if (lifestyleUrl) {
                const success = await downloadImage(lifestyleUrl, lifestyleImagePath);
                if (success) localPaths.push(`/images/perfumes/${slug}/3.jpg`);
            }
        } else {
            console.log(` ⏭️ Lifestyle já existe em cache.`);
            localPaths.push(`/images/perfumes/${slug}/3.jpg`);
        }

        // 4. Salvar as informações no Supabase (Atualizar colunas image_main e images)
        if (localPaths.length > 0) {
            const imageMain = localPaths[0]; // main.jpg
            
            const { error: updateError } = await supabase
                .from('perfumes')
                .update({ 
                    image_main: imageMain,
                    images: localPaths 
                })
                .eq('id', p.id);

            if (updateError) {
                console.error(` ❌ Falha ao atualizar o banco de dados para ${p.name}:`, updateError.message);
            } else {
                console.log(` ✅ Banco atualizado com ${localPaths.length} imagens locias exclusivas.`);
                successCount++;
            }
        } else {
            console.log(` ⚠️ Aviso: Nenhuma imagem conseguida para o perfume ${p.name}.`);
        }

        // Delay anti-bot
        await new Promise(r => setTimeout(r, 2000));
    }

    console.log(`\n🎉 Processo Finalizado! ${successCount} perfumes reconstruídos localmente nas novas colunas.`);
}

run();
