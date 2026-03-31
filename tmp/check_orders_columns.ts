import { createClient } from "@supabase/supabase-js"
import dotenv from "dotenv"
dotenv.config({ path: ".env.local" })

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function checkColumns() {
    console.log("--- Verificando Colunas da Tabela 'orders' ---")
    // Tenta buscar um registro para ver as colunas reais
    const { data, error } = await supabase.from("orders").select("*").limit(1)
    
    if (error) {
        console.error("Erro ao acessar tabela 'orders':", error.message)
    } else if (data && data.length > 0) {
        console.log("Colunas encontradas:", Object.keys(data[0]))
    } else {
        console.log("Tabela vazia ou erro de acesso.")
        // Tenta outra forma: listar colunas via RPC ou erro proposital
        const { error: err2 } = await supabase.from("orders").insert({ non_existent_column: true })
        console.log("Dica via erro:", err2?.message)
    }
}

checkColumns()
