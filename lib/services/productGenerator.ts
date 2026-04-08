import { calculatePerfumePricing } from "@/lib/services/pricing";
import { createServerSupabase } from "@/lib/supabase/server";

export async function generateProducts(perfumeId: string, cost: number) {

    const supabase = await createServerSupabase();

    const pricing = calculatePerfumePricing(cost);

    const products = [
        {
            perfume_id: perfumeId,
            size_ml: 5,
            price: pricing.decant5,
            stock: 0,
        },
        {
            perfume_id: perfumeId,
            size_ml: 10,
            price: pricing.decant10,
            stock: 0,
        },
        {
            perfume_id: perfumeId,
            size_ml: 100,
            price: pricing.full,
            stock: 0,
        }
    ];

    await supabase.from("products").insert(products);
}