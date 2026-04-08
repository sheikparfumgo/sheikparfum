import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function POST(req: Request) {
    try {
        const authHeader = req.headers.get("authorization")


        if (!authHeader) {
            return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
        }

        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                global: {
                    headers: {
                        Authorization: authHeader
                    }
                }
            }
        )

        const {
            data: { user },
            error: userError
        } = await supabase.auth.getUser()

        if (userError || !user) {
            return NextResponse.json({ error: "Usuário inválido" }, { status: 401 })
        }

        const body = await req.json()

        const {
            street,
            number,
            complement,
            neighborhood,
            city,
            state,
            zip_code,
            recipient_name,
            phone
        } = body

        const normalizedStreet = street.trim().toLowerCase()
        const normalizedNumber = number.trim()
        const normalizedZip = zip_code.replace(/\D/g, "")

        // 🔎 verifica se já existe endereço
        const { data: existing } = await supabase
            .from("addresses")
            .select("id")
            .eq("user_id", user.id)
            .eq("street", normalizedStreet)
            .eq("number", normalizedNumber)
            .eq("zip_code", normalizedZip)
            .maybeSingle()

        let result

        if (existing) {

            // 🔥 GARANTE 1 DEFAULT
            await supabase
                .from("addresses")
                .update({ is_default: false })
                .eq("user_id", user.id)

            result = await supabase
                .from("addresses")
                .update({
                    complement,
                    neighborhood,
                    city,
                    state,
                    recipient_name,
                    phone,
                    is_default: true
                })
                .eq("id", existing.id)

        } else {
            // 🔥 REMOVE DEFAULT ANTIGO
            await supabase
                .from("addresses")
                .update({ is_default: false })
                .eq("user_id", user.id)

            // ➕ INSERT
            result = await supabase
                .from("addresses")
                .insert({
                    user_id: user.id,
                    name: "Endereço",
                    recipient_name,
                    phone,
                    street,
                    number,
                    complement,
                    neighborhood,
                    city,
                    state,
                    zip_code,
                    is_default: true
                })
        }

        if (result.error) {
            return NextResponse.json(
                { error: result.error.message },
                { status: 500 }
            )
        }

        return NextResponse.json({ success: true })

    } catch (err) {
        console.error(err)
        return NextResponse.json({ error: "Erro interno" }, { status: 500 })
    }
}