import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import fs from "fs";
import path from "path";
import axios from "axios";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("❌ ERRO: Variáveis do Supabase ausentes");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const perfumesData = [
  { name: "Asad elixir", url2: "https://fimgs.net/mdimg/perfume-thumbs/375x500.117616.jpg", url3: "https://fimgs.net/himg/o.ZyQB0hDJlJE.jpg" },
  { name: "Asad tradicional", url2: "https://cdn.awsli.com.br/600x450/2639/2639447/produto/243428765/sem-t-tulo-4-b599mbl7bu.jpeg", url3: "https://m.magazineluiza.com.br/a-static/420x420/perfume-lattafa-asad-tradicional-edp-100ml-200-008/bugigangasecialtda/2080/59c30d03d5c13419ea9472f5c86fe0ff.jpeg" },
  { name: "Asad bourbon", url2: "https://cdn.awsli.com.br/2500x2500/2667/2667788/produto/370639105/c91232f2f9703a3f4afd60730c9e04cd-3o9ywqmvo8.jpg", url3: "https://klassey.com.br/cdn/shop/files/672e1d70b2bf86a82c9a31cd5660ca2f.jpg?v=1736172503&width=1000" },
  { name: "Asad Zanzibar", url2: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSDu5q199mav4EqhJjHVY_6CIOD6EF9H542Zg&s", url3: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYnlp-SRCP1srIRcoPpaun4FVes35bXGufFQ&s" },
  { name: "Khamrah", url2: "https://fimgs.net/mdimg/perfume/o.75805.jpg", url3: "https://i0.wp.com/fragranciasheik.com.br/hge4/2024/09/Khamrah-500x500-1.jpg?fit=500%2C500&ssl=1" },
  { name: "Khamrah Qahwa", url2: "https://fimgs.net/mdimg/perfume/o.88175.jpg", url3: "https://cdn.sistemawbuy.com.br/arquivos/76f18532ed6cbee3a4f3c773ef424967/produtos/68f9fd36d858e/khamrah-qahwa-100ml-edp-lattafa-68f9ff902fe92.jpg" },
  { name: "Khamrah Dukhan", url2: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTO3qDcHQB9d7_6dGgFlxYTkhBeLiSzh1A6rA&s", url3: "https://m.media-amazon.com/images/I/71VFXKnaEyL._AC_UF350,350_QL80_.jpg" },
  { name: "Ameer", url2: "https://fimgs.net/mdimg/perfume/o.82794.jpg", url3: "https://cdn.awsli.com.br/800x800/25/25674/produto/65216920/img-20230619-wa00261-7179f0365260e1332816872042457151-640-0-jiqofwlw9d.webp" },
  { name: "Wazeer", url2: "https://fimgs.net/mdimg/perfume/o.82796.jpg", url3: "https://acdn-us.mitiendanube.com/stores/002/954/202/products/211-b1466e5efa9a98eeee16872173120495-1024-1024.webp" },
  { name: "Safeer", url2: "https://fimgs.net/mdimg/perfume/o.82795.jpg", url3: "https://cdn.awsli.com.br/800x800/25/25674/produto/3766764/31-e1c090fd754aa762d216872175875670-1024-1024-9jb72q5xpw.webp" },
  { name: "Vintage Radio", url2: "https://fimgs.net/mdimg/perfume-thumbs/375x500.89454.jpg", url3: "https://acdn-us.mitiendanube.com/stores/004/420/260/products/design-sem-nome-3-9cc96c99a7038dcbe117119641908317-1024-1024.webp" },
  { name: "Fakhar Gold", url2: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRkQ7oSGsfa0itReyljXW_dC12RO00kfuD4DQ&s", url3: "https://cdn.awsli.com.br/2500x2500/25/25674/produto/12797384/20241017_112234-926bb167fd71ddc81417358446449011-1024-1024-0uyxjb3yfh.webp" },
  { name: "Fakhar Platin", url2: "https://fimgs.net/mdimg/perfume/o.107363.jpg", url3: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdSY1x6nLN95aAkKUzY_fMraUJ6eUs4oLwUQ&s" },
  { name: "Fakhar Black", url2: "https://fimgs.net/mdimg/perfume-thumbs/375x500.70465.jpg", url3: "https://cdn.sistemawbuy.com.br/arquivos/e9186325dab12539fcfd64d2d44e5faf/produtos/65c3dd2056d1f/original-65c3dd213e8b6.jpeg" },
  { name: "Club de nuit Intense Man", url2: "https://fimgs.net/mdimg/perfume/o.34696.jpg", url3: "https://epocacosmeticos.vteximg.com.br/arquivos/ids/1333839/17581388812032.jpg?v=639009681421200000" },
  { name: "Club de nuit urban man elixir", url2: "https://fimgs.net/mdimg/perfume-thumbs/375x500.77860.jpg", url3: "https://acdn-us.mitiendanube.com/stores/006/591/490/products/whatsapp-image-2025-09-16-at-10-40-57-1-ab86b28f32d2cc5df617580348030755-1024-1024.webp" },
  { name: "Club de nuit iconic", url2: "https://fimgs.net/mdimg/perfume-thumbs/375x500.78475.jpg", url3: "https://klassey.com.br/cdn/shop/files/armaf_club_de_nuit_iconic_eau_de_parfum_1080x-691338f780374.webp?v=1772762078&width=1080" },
  { name: "Club de nuit oud", url2: "https://fimgs.net/mdimg/perfume-thumbs/375x500.88825.jpg", url3: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQNrqO9kmS9PBTR418fyz_3FgGHzTLLqlpG6g&s" },
  { name: "Club de nuit Intense Man limited edition", url2: "https://fimgs.net/mdimg/perfume-thumbs/375x500.77861.jpg", url3: "https://aromedecapelin.cdn.magazord.com.br/img/2024/09/produto/5191/armaf-club-de-nuit-new-parfum-edition.jpg?ims=fit-in/600x600/filters:fill(fff)" },
  { name: "Alpine", url2: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQtKogglhxmZ6GAn4nj_MRhNRjXQAviDvEs8A&s", url3: "https://m.media-amazon.com/images/I/718GESeTSKL._AC_UF350,350_QL80_.jpg" },
  { name: "Perseus", url2: "https://fimgs.net/mdimg/perfume-thumbs/375x500.88603.jpg", url3: "https://down-br.img.susercontent.com/file/br-11134207-7r98o-lwu9bf9aoa0v55" },
  { name: "Salvo", url2: "https://fimgs.net/mdimg/perfume-thumbs/375x500.93538.jpg", url3: "https://images.tcdn.com.br/img/img_prod/1255365/perfume_salvo_maison_alhambra_eau_de_parfum_decant_ref_olfativa_sauvage_889_6_6bf92c0ab08bb361aff61aa3ff3b25a2.jpg" },
  { name: "Salvo intense", url2: "https://images.tcdn.com.br/img/img_prod/1144493/perfume_salvo_eau_de_parfum_maison_alhambra_100ml_masculino_6269_2_5a6e936f9c3aae9cd43822735eb41881.jpg", url3: "https://http2.mlstatic.com/D_NQ_NP_850176-MLB79484750092_102024-O.webp" },
  { name: "Yeah!", url2: "https://fimgs.net/mdimg/perfume/o.83061.jpg", url3: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQQwn4QEk22_E1hZ8ML2sMaZBabdqhrmaid-Q&s" },
  { name: "Avant", url2: "https://fimgs.net/mdimg/perfume-thumbs/375x500.92621.jpg", url3: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQroQVuxomTqpyfC4XS3JQ3JA_W3hN3ih3pfA&s" },
  { name: "Glacier", url2: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRlpwWQb31dV9eXk6-iOgfJ5jaBE8adjyHANQ&s", url3: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTwfGfd9qbmMrjBOEKaVefscY2Hc3jGvYqBQA&s" },
  { name: "Amber Oud Aqua Dubai", url2: "https://fimgs.net/mdimg/perfume/o.96482.jpg", url3: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ7F8l35d0YImS614qYrTEGpU6rqfbx31jl2A&s" },
  { name: "Amber Oud Aqua Night", url2: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTbin1sLl3f5T1uN4ZOQFBbYYvOq5Y2qKcX-g&s", url3: "https://m.media-amazon.com/images/I/51OoWy5-EuL._AC_UF350,350_QL80_.jpg" },
  { name: "Amber Oud Gold", url2: "https://fimgs.net/mdimg/perfume/o.51816.jpg", url3: "https://acdn-us.mitiendanube.com/stores/002/954/202/products/321-9e5099f350729fb29416807661708396-1024-1024.webp" },
  { name: "Liquid Brun", url2: "https://fimgs.net/mdimg/perfume-thumbs/375x500.94713.jpg", url3: "https://cdn.shoppub.io/cdn-cgi/image/w=1000,h=1000,q=80,f=auto/forman/media/uploads/produtos/foto/eeaxobnr/3dee85b7-f852-4716-8a6b-fe36c6fa5a5c.jpeg" },
  { name: "Ghost Spectre", url2: "https://fimgs.net/mdimg/perfume-thumbs/375x500.94697.jpg", url3: "https://http2.mlstatic.com/D_NQ_NP_690512-MLB78061728521_072024-O.webp" },
  { name: "Vulcan feu", url2: "https://fimgs.net/mdimg/perfume-thumbs/375x500.105520.jpg", url3: "https://http2.mlstatic.com/D_NQ_NP_618435-MLA86995741313_062025-O.webp" },
  { name: "Viking Dubai", url2: "https://klassey.com.br/cdn/shop/files/Design_sem_nome_-_2025-04-30T103016.690.png?v=1746019834", url3: "https://a-static.mlcdn.com.br/%7Bw%7Dx%7Bh%7D/bharara-viking-dubai-parfum-100ml-padrao/vitrinemasculina/2950050-227468-0/83f4033d56839fe0734b8ae31ca2a2d7.jpeg" },
  { name: "Viking Cairo", url2: "https://fimgs.net/mdimg/perfume/o.103876.jpg", url3: "https://img.olx.com.br/images/45/456663496689452.jpg" },
  { name: "Viking Beirut", url2: "https://fimgs.net/mdimg/perfume-thumbs/375x500.103875.jpg", url3: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTjIhqOwSTHFnQkG_3dxWJlYNbgccBHMdx-VQ&s" },
  { name: "Viking Kashmir", url2: "https://fimgs.net/mdimg/perfume-thumbs/375x500.96818.jpg", url3: "https://http2.mlstatic.com/D_NQ_NP_687363-MLB83680481478_042025-O.webp" },
  { name: "Nardo", url2: "https://http2.mlstatic.com/D_NQ_NP_787021-MLA95073064931_102025-O.webp", url3: "https://beijonapele.com.br/wp-content/uploads/2026/01/orientica-nardo-oud-extrait-de-parfum-perfume-unissex-6297001158456-bnp-04-800x800.webp" },
  { name: "Amber Noir", url2: "https://fimgs.net/mdimg/perfume-thumbs/375x500.87190.jpg", url3: "https://leloynparfums.com.br/cdn/shop/files/PRODUTOS_LELOYN_SITE_c6baab5b-ccb7-4002-b996-78b26dbcd422.png?v=1769572420&width=1024" },
  { name: "Azure fantasy", url2: "https://http2.mlstatic.com/D_NQ_NP_706247-MLB83184307324_042025-O.webp", url3: "https://jasminperfumes.com.br/wp-content/uploads/2024/08/azure-fantas.webp" },
  { name: "Royal bleu", url2: "https://fimgs.net/mdimg/perfume-thumbs/375x500.78001.jpg", url3: "https://cdn.awsli.com.br/600x1000/2429/2429224/produto/372798272/96ae39833f976f6cf4b09333ee605b74-wd5qth8j0q.jpg" },
  { name: "Oud saffron", url2: "https://fimgs.net/mdimg/perfume/o.69363.jpg", url3: "https://acdn-us.mitiendanube.com/stores/002/954/202/products/2431-25ac72f4ec80f6f4e216797302755157-1024-1024.webp" },
];

async function downloadImage(url: string, dest: string, retry = 1): Promise<boolean> {
    try {
        const response = await axios({
            url,
            method: 'GET',
            responseType: 'stream',
            timeout: 10000,
            headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" }
        });
        
        return new Promise((resolve) => {
            const writer = fs.createWriteStream(dest);
            response.data.pipe(writer);
            writer.on('finish', () => resolve(true));
            writer.on('error', () => {
                fs.unlink(dest, () => {});
                resolve(false);
            });
        });
    } catch (e: any) {
        if (retry > 0) {
            console.log(`     ⚠️ Retentando download...`);
            return await downloadImage(url, dest, retry - 1);
        }
        return false;
    }
}

function generateSlug(name: string) {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
}

async function run() {
    console.log("🚀 Iniciando correção de imagens...\n");

    const publicImagesDir = path.join(process.cwd(), "public", "images", "perfumes");
    let successCount = 0;

    for (const item of perfumesData) {
        let searchName = item.name.replace(" edição limitada", "").trim();

        const { data: matched, error } = await supabase
            .from('perfumes')
            .select('id, name, slug')
            .ilike('name', `%${searchName}%`)
            .limit(1);

        if (error || !matched || matched.length === 0) {
            console.log(`⚠️ Não encontrou no banco: ${item.name}`);
            continue;
        }

        const p = matched[0];
        const slug = p.slug || generateSlug(p.name);
        console.log(`📦 Corrigindo: ${p.name} (${slug})`);

        const perfumeDir = path.join(publicImagesDir, slug);
        if (!fs.existsSync(perfumeDir)) {
            fs.mkdirSync(perfumeDir, { recursive: true });
        }

        // Removendo arquivos antigos
        const filesToClean = ["2.jpg", "3.jpg", "bottle.jpg", "lifestyle.jpg"];
        for (const file of filesToClean) {
            const fw = path.join(perfumeDir, file);
            if (fs.existsSync(fw)) {
                fs.unlinkSync(fw);
            }
        }

        const mainImagePath = path.join(perfumeDir, "main.jpg");
        const mainPathUrl = `/images/perfumes/${slug}/main.jpg`;
        const bottlePathUrl = `/images/perfumes/${slug}/bottle.jpg`;
        const lifestylePathUrl = `/images/perfumes/${slug}/lifestyle.jpg`;

        const bottleImg = path.join(perfumeDir, "bottle.jpg");
        const lifestyleImg = path.join(perfumeDir, "lifestyle.jpg");

        let imagesArray: string[] = [];

        // Manter o main.jpg (Se existir na pasta)
        if (fs.existsSync(mainImagePath)) {
            imagesArray.push(mainPathUrl);
        } else {
            console.log("   ❌ Aviso: main.jpg não encontrado localmente.");
            imagesArray.push(mainPathUrl); // Assumimos que a URL será a correta mesmo sem estar em cache
        }

        // Baixar Imagem 2 (Bottle)
        console.log(`   ⬇️ Baixando bottle.jpg...`);
        const s2 = await downloadImage(item.url2, bottleImg);
        if (s2) imagesArray.push(bottlePathUrl);

        // Baixar Imagem 3 (Lifestyle)
        console.log(`   ⬇️ Baixando lifestyle.jpg...`);
        const s3 = await downloadImage(item.url3, lifestyleImg);
        if (s3) imagesArray.push(lifestylePathUrl);

        // Update DB
        const { error: updateError } = await supabase
            .from('perfumes')
            .update({ 
                image_main: mainPathUrl,
                images: imagesArray
            })
            .eq('id', p.id);

        if (updateError) {
            console.error(`   ❌ Erro ao atualizar Supabase:`, updateError.message);
        } else {
             console.log(`   ✅ DB atualizado com ${imagesArray.length} imagens.`);
             successCount++;
        }
    }

    console.log(`\n🎉 Correção Finalizada! ${successCount} perfumes atualizados.`);
}

run();
