import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import { fetchPerfumeData } from "@/lib/services/fetchPerfumeData";

export async function POST(req: NextRequest) {
    try {
        const { name, brand } = await req.json();

        if (!name || !brand) {
            return NextResponse.json({
                success: false,
                error: "Nome e marca são obrigatórios",
            });
        }

        const data = await fetchPerfumeData(name, brand);

        return NextResponse.json({
            success: true,
            data,
        });

    } catch (err: any) {
        return NextResponse.json({
            success: false,
            error: err.message || "Erro ao buscar dados",
        });
    }
}