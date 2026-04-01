import { createClient } from "@supabase/supabase-js"
import dotenv from "dotenv"
import fs from "fs"
dotenv.config({ path: ".env.local" })

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function checkTables() {
    const tables = ["profiles", "addresses", "favorites"]
    let output = "--- Verificando Estrutura das Tabelas ---\n"

    for (const table of tables) {
        const { data, error } = await supabase.from(table).select("*").limit(1)
        if (error) {
            output += `❌ Erro em ${table}: ${error.message}\n`
        } else {
            const columns = data.length > 0 ? Object.keys(data[0]) : "Tabela vazia"
            output += `✅ Tabela ${table} encontrada. Colunas: ${JSON.stringify(columns)}\n`
        }
    }
    fs.writeFileSync("tmp/auth_tables_info.txt", output)
    console.log(output)
}

checkTables()
