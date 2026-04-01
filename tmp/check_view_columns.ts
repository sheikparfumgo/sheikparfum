import { createClient } from "@supabase/supabase-js"
import dotenv from "dotenv"
dotenv.config({ path: ".env.local" })

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function checkView() {
    console.log("--- Verificando view vw_perfumes_catalog ---")
    const { data, error } = await supabase.from("vw_perfumes_catalog").select("*").limit(1)
    if (error) {
        console.log("❌ Erro:", error.message)
    } else if (data && data.length > 0) {
        console.log("✅ Colunas:", Object.keys(data[0]))
    } else {
        console.log("⚠️ View vazia")
    }
}

checkView()
