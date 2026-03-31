import { createClient } from "@supabase/supabase-js"
import dotenv from "dotenv"
dotenv.config({ path: ".env.local" })

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function checkProducts() {
    console.log("--- Verificando Tabela de Produtos ---")
    const { data, error } = await supabase.from("products").select("id, name").limit(5)
    
    if (error) {
        console.error("Erro ao acessar tabela 'products':", error.message)
        console.log("Talvez a tabela tenha outro nome (ex: perfumes)?")
        
        const { data: data2, error: error2 } = await supabase.from("perfumes").select("id, name").limit(5)
        if (error2) {
            console.error("Erro ao acessar tabela 'perfumes':", error2.message)
        } else {
            console.log("Produtos na tabela 'perfumes':", data2)
        }
    } else {
        console.log("Produtos na tabela 'products':", data)
    }
}

checkProducts()
