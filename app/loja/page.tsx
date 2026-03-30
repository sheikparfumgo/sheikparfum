"use client";

import { useState } from "react";
import StoreGrid from "@/components/store/StoreGrid";
import StoreFilters from "@/components/store/StoreFilters";
import StoreSort from "@/components/store/StoreSort";

export default function StorePage() {

    const [brand, setBrand] = useState<string | null>(null);
    const [order, setOrder] = useState<string | null>(null);
    const [hideOutOfStock, setHideOutOfStock] = useState(true);

    // 🔥 NOVO: perfil olfativo
    const [profile, setProfile] = useState<string | null>(null);

    return (
        <div className="w-full max-w-[1400px] mx-auto px-4 md:px-6 py-6 md:py-8">

            <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-6 md:gap-10">

                <StoreFilters
                    brand={brand}
                    setBrand={setBrand}
                    hideOutOfStock={hideOutOfStock}
                    setHideOutOfStock={setHideOutOfStock}
                    profile={profile}                 // ✅ NOVO
                    setProfile={setProfile}           // ✅ NOVO
                />

                <div className="space-y-6">

                    <StoreSort setOrder={setOrder} />

                    <StoreGrid
                        brand={brand}
                        order={order}
                        hideOutOfStock={hideOutOfStock}
                        profile={profile}              // ✅ NOVO
                    />

                </div>

            </div>

        </div>
    );
}