import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import axios from "axios";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("❌ ERRO: Variáveis do Supabase ausentes");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
    console.log("🚀 Iniciando migração de imagens para o Supabase Storage...");

    // 1. Pega todos os perfumes que têm image_url
    const { data: perfumes, error } = await supabase
        .from('perfumes')
        .select('id, name, slug, image_url');

    if (error) {
        console.error("❌ Erro ao buscar perfumes:", error.message);
        return;
    }

    if (!perfumes || perfumes.length === 0) {
        console.log("⚠️ Nenhum perfume encontrado.");
        return;
    }

    let successCount = 0;

    for (const p of perfumes) {
        if (!p.image_url) {
            console.log(`⏭️ Ignorado (Sem imagem original): ${p.name}`);
            continue;
        }

        // Se a imagem já foi pro Supabase Storage, ignorar
        if (p.image_url.includes("supabase.co") || p.image_url.includes("supabase.in")) {
            console.log(`✅ Já está no Storage: ${p.name}`);
            continue;
        }

        console.log(`⬇️ Baixando: ${p.name} ...`);

        try {
            // 2. Faz o download da imagem em ArrayBuffer
            const response = await axios.get(p.image_url, { 
                responseType: 'arraybuffer',
                headers: {
                    "User-Agent": "Mozilla/5.0"
                }
            });
            
            const buffer = Buffer.from(response.data, 'binary');
            const contentType = response.headers['content-type'] || 'image/jpeg';
            
            // 3. Define a extensão e o nome de arquivo
            let ext = 'jpg';
            if (contentType.includes('png')) ext = 'png';
            if (contentType.includes('webp')) ext = 'webp';
            if (contentType.includes('gif')) ext = 'gif';
            
            // Usamos o slug (se existir) ou o id para evitar caracteres especiais
            const safeName = p.slug ? p.slug : p.id.toString();
            const fileName = `${safeName}.${ext}`;

            // 4. Upload para o bucket "perfumes"
            const { error: uploadError } = await supabase.storage
                .from('perfumes')
                .upload(fileName, buffer, {
                    contentType,
                    upsert: true
                });

            if (uploadError) {
                console.error(`❌ Erro no upload no Supabase (${p.name}):`, uploadError.message);
                continue;
            }

            // 5. Pega a Public URL
            const { data: publicUrlData } = supabase.storage
                .from('perfumes')
                .getPublicUrl(fileName);
            
            const publicUrl = publicUrlData.publicUrl;

            // 6. Atualiza no banco de dados
            const { error: updateError } = await supabase
                .from('perfumes')
                .update({ image_url: publicUrl })
                .eq('id', p.id);

            if (updateError) {
                console.error(`❌ Erro ao salvar log no banco (${p.name}):`, updateError.message);
            } else {
                console.log(`🎉 Migrado: ${p.name} -> ${publicUrl}`);
                successCount++;
            }

        } catch (err: any) {
            console.error(`❌ Falha ao processar (${p.name}):`, err.message);
        }
    }

    console.log(`\n✅ Sucesso! ${successCount} imagens baixadas diretamente para o bucket 'perfumes'!`);
}

run();
