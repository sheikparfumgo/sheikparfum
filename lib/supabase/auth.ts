import { createClient } from "@supabase/supabase-js"

export async function getUserFromRequest(req: Request) {
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            global: {
                headers: {
                    Authorization: req.headers.get("Authorization") || ""
                }
            }
        }
    )

    const {
        data: { user },
    } = await supabase.auth.getUser()

    return user
}