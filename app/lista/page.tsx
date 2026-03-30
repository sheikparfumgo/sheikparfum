import ClosetHeader from "@/components/lista/ClosetHeader"
import ClosetStats from "@/components/lista/ClosetStats"
import ClosetTabs from "@/components/lista/ClosetTabs"
import ClosetSection from "@/components/lista/ClosetSection"
import ClosetLowAlert from "@/components/lista/ClosetLowAlert"
import ClosetRecommendations from "@/components/lista/ClosetRecommendations"

import { perfumes } from "@/data/perfumes"
import { userPerfumes } from "@/data/userPerfumes"
import { Perfume, UserPerfume } from "@/types/perfume"

type ClosetPerfume = Perfume & UserPerfume

export default function ListaPage() {

    const tenho = userPerfumes.filter((p) => p.status === "tenho")

    const perfumesDaColecao: ClosetPerfume[] = tenho
        .map((userPerfume) => {

            const perfume = perfumes.find(
                (p) => p.id === userPerfume.perfumeId
            )

            if (!perfume) return null

            return {
                ...perfume,
                ...userPerfume
            }

        })
        .filter(Boolean) as ClosetPerfume[]

    return (

        <div className="max-w-[1400px] mx-auto space-y-8">

            <ClosetHeader />

            <ClosetStats perfumes={perfumesDaColecao} />

            <ClosetTabs />

            <ClosetLowAlert perfumes={perfumesDaColecao} />

            <ClosetSection
                title="Minha coleção"
                perfumes={perfumesDaColecao}
            />

            <ClosetRecommendations />

        </div>

    )
}