import dotenv from "dotenv"
dotenv.config({ path: ".env.local" })

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

async function testView() {
    const url = `${SUPABASE_URL}/rest/v1/vw_perfumes_catalog?limit=1`
    
    try {
        const res = await fetch(url, {
            headers: {
                "apikey": SUPABASE_KEY!,
                "Authorization": `Bearer ${SUPABASE_KEY}`
            }
        })
        const data = await res.json()
        console.log(JSON.stringify(data[0], null, 2))
    } catch (err) {
        console.error("Erro no fetch:", err)
    }
}

testView()
