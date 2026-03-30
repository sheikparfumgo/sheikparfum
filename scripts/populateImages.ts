import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("❌ ERRO: Variáveis do Supabase ausentes");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const perfumesData = [
  { name: "Asad elixir", url: "https://www.havan.com.br/media/catalog/product/l/a/lattafa-asad-elixir-edp-100ml_1216348.jpg" },
  { name: "Asad tradicional", url: "https://epocacosmeticos.vteximg.com.br/arquivos/ids/1292447-800-800/17581402187993.jpg?v=638998664982100000" },
  { name: "Asad bourbon", url: "https://m.media-amazon.com/images/I/81Skp1nmxTL._AC_UF1000,1000_QL80_.jpg" },
  { name: "Asad Zanzibar", url: "https://epocacosmeticos.vteximg.com.br/arquivos/ids/930430/17533598529973.jpg?v=638889572038170000" },
  { name: "Khamrah", url: "https://cdn.sistemawbuy.com.br/arquivos/feb5eb39b3a2004abcc3bcd79041ba64/produtos/648a33bc604e9/20230614184017-648a33c15409a.jpg" },
  { name: "Khamrah Qahwa", url: "https://cdn.awsli.com.br/600x700/278/278816/produto/295611177/qahwa-qbakk1s7t3.jpeg" },
  { name: "Khamrah Dukhan", url: "https://epocacosmeticos.vteximg.com.br/arquivos/ids/940863-800-800/17539791538836.jpg?v=638895842947100000" },
  { name: "Ameer", url: "https://m.media-amazon.com/images/I/61KH-il8uoL._AC_UF1000,1000_QL80_.jpg" },
  { name: "Wazeer", url: "https://cdn.sistemawbuy.com.br/arquivos/feb5eb39b3a2004abcc3bcd79041ba64/produtos/68040c9b1d32e/15341638725-perfume-unissex-al-noble-wazeer-lattafa-eau-de-parfum-100ml1-68040cc27b070.jpg" },
  { name: "Safeer", url: "https://www.giraofertas.com.br/wp-content/uploads/2023/12/Al-Noble-Safeer-Lattafa-Eau-de-Parfum-03.jpg" },
  { name: "Vintage Radio", url: "https://acdn-us.mitiendanube.com/stores/004/420/260/products/perfume-arabe-compartilhavel-vintage-radio-4e684139fcb75f81cb17275264995522-640-0.webp" },
  { name: "Fakhar Gold", url: "https://cdn.awsli.com.br/600x700/278/278816/produto/284766089/lattafagood-hjgwe5fgmb.png" },
  { name: "Fakhar Platin", url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR8WmRLp_T1qTvWTxhxnIP_zMs2PxtVZXPL5g&s" },
  { name: "Fakhar Black", url: "https://images.tcdn.com.br/img/img_prod/1144493/perfume_fakhar_black_pride_of_lattafa_eau_de_parfum_lattafa_100ml_masculino_6902_1_a82f10c2f01a471f02622e9c98e87566.jpg" },
  { name: "Club de nuit Intense Man", url: "https://m.media-amazon.com/images/I/517KoN9DUQL._AC_UF1000,1000_QL80_.jpg" },
  { name: "Club de nuit urban man elixir", url: "https://m.media-amazon.com/images/I/71n15MhxtBL.jpg" },
  { name: "Club de nuit iconic", url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT9IqoMUEO4aXdINZ8gKJp2xWYtPABuH4k46g&s" },
  { name: "Club de nuit oud", url: "https://http2.mlstatic.com/D_NQ_NP_859049-MLU73824793320_012024-O.webp" },
  { name: "Club de nuit Intense Man limited edition", url: "https://m.media-amazon.com/images/I/61UI9HE7rqL._AC_UF1000,1000_QL80_.jpg" },
  { name: "Alpine", url: "https://http2.mlstatic.com/D_Q_NP_784597-MLA86754672614_072025-O.webp" },
  { name: "Perseus", url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTDcyN5-nC8PgKlkZ08o6an5qg4jTw7nAMrXw&s" },
  { name: "Salvo", url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRiuFkeCT9h9ofZkdAPY1l0Tm6k_HJ3EDgKnQ&s" },
  { name: "Salvo intense", url: "https://cdn.dooca.store/63020/products/salvo-1.jpeg?v=1693002420" },
  { name: "Yeah!", url: "https://http2.mlstatic.com/D_Q_NP_913298-MLA83330631975_032025-O.webp" },
  { name: "Avant", url: "https://images.tcdn.com.br/img/img_prod/1144493/perfume_avant_eau_de_parfum_maison_alhambra_100ml_masculino_6321_2_d54089a1b33782e4521f1facf82dad2e.jpg" },
  { name: "Glacier", url: "https://m.media-amazon.com/images/I/61vRPknaAmL._AC_UF1000,1000_QL80_.jpg" },
  { name: "Amber Oud Aqua Dubai", url: "https://acdn-us.mitiendanube.com/stores/001/216/674/products/aqua-629b8f4d3071c6aee817272029979325-240-0.webp" },
  { name: "Amber Oud Aqua Night", url: "https://fimgs.net/mdimg/secundar/fit.120275.jpg" },
  { name: "Amber Oud Gold", url: "https://http2.mlstatic.com/D_NQ_NP_902523-MLU70526803049_072023-O.webp" },
  { name: "Liquid Brun", url: "https://http2.mlstatic.com/D_NQ_NP_852085-MLA80071541612_102024-O.webp" },
  { name: "Ghost Spectre", url: "https://cdn.awsli.com.br/600x600/2068/2068705/produto/378164768/9-chk56wbcrn.webp" },
  { name: "Vulcan feu", url: "https://origemarabe.com.br/wp-content/uploads/2025/08/vulcan1.jpeg" },
  { name: "Viking Dubai", url: "https://images.tcdn.com.br/img/img_prod/611043/viking_dubai_parfum_100ml_for_unisex_bharara_7999_2_309ec87c7ceb3cee862ef5bd51735bfb.jpg" },
  { name: "Viking Cairo", url: "https://http2.mlstatic.com/D_NQ_NP_787571-MLA97249629905_112025-O.webp" },
  { name: "Viking Beirut", url: "https://acdn-us.mitiendanube.com/stores/004/407/494/products/viking-beirut-f009a2930c5ee5a29f17271360595863-1024-1024.webp" },
  { name: "Viking Kashmir", url: "https://http2.mlstatic.com/D_NQ_NP_998584-MLU71229907011_082023-O.webp" },
  { name: "Nardo", url: "https://www.giraofertas.com.br/wp-content/uploads/2025/12/perfume-orientica-nardo-oud-edp-unissex-2.jpg" },
  { name: "Amber Noir", url: "https://static.wixstatic.com/media/0db592_9d39897a57dc4e3bbf8faf90be23c30e~mv2.jpg/v1/fit/w_500,h_500,q_90/file.jpg" },
  { name: "Azure fantasy", url: "https://cdn.sistemawbuy.com.br/arquivos/feb5eb39b3a2004abcc3bcd79041ba64/produtos/6792a8eb9c314/15321292021-azure-fantasy-2-6792a8ef0de9d.jpg" },
  { name: "Royal bleu", url: "https://images.tcdn.com.br/img/img_prod/626030/royal_bleu_orientica_masculino_eau_de_parfum_80_ml_6567_1_c5fe1a8748f7c167e1d18f6abad9d186_20240704133457.jpg" },
  { name: "Oud saffron", url: "https://www.giraofertas.com.br/wp-content/uploads/2021/04/Orientica-Oud-Saffron-Al-Haramain-Eau-de-Parfum-03.jpg" },
];

async function run() {
    console.log("🚀 Iniciando o update em massa de imagens!");
    let successCount = 0;
    
    for (const item of perfumesData) {
        // Limpar strings para evitar problemas de espaço ou nomes adicionais do usuário
        let searchName = item.name.replace(" edição limitada", "").trim();

        // Fazemos a query case-insensitive
        const { data: matched, error } = await supabase
            .from('perfumes')
            .select('id, name')
            .ilike('name', `%${searchName}%`) // ilike suporta o '% %' para achar aproximações
            .limit(1);

        if (error) {
            console.error(`❌ Erro ao buscar ${searchName}:`, error.message);
            continue;
        }

        if (matched && matched.length > 0) {
            const rowId = matched[0].id;

            const { error: updateError } = await supabase
                .from('perfumes')
                .update({ image_url: item.url })
                .eq('id', rowId);

            if (updateError) {
                console.error(`❌ Erro ao atualizar ${searchName}:`, updateError.message);
            } else {
                console.log(`✅ Atualizado (${matched[0].name})`);
                successCount++;
            }
        } else {
            console.log(`⚠️ Não achou o perfume: ${searchName} na base de dados (Pode estar escrito de forma diferente)`);
        }
    }
    
    console.log(`\n🎉 Processo finalizado! ${successCount}/${perfumesData.length} perfumes atualizados com imagem!`);
}

run();
