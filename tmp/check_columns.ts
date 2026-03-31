import { createClient } from "@supabase/supabase-js"
import dotenv from "dotenv"
dotenv.config({ path: ".env.local" })

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function checkColumns() {
    console.log("--- Verificando Colunas da Tabela 'orders' ---")
    // Tenta buscar um registro para ver as colunas
    const { data, error } = await supabase.from("orders").select("*").limit(1)
    
    if (error) {
        console.error("Erro ao acessar tabela 'orders':", error.message)
    } else if (data && data.length > 0) {
        console.log("Colunas encontradas:", Object.keys(data[0]))
    } else {
        console.log("Tabela vazia, não foi possível determinar as colunas.")
    }
}

checkColumns()
