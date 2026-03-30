export default function ClosetHeader() {
    return (
        <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#c9a34a]/20 flex items-center justify-center">
                👤
            </div>

            <div>
                <h1 className="text-xl font-bold">
                    Closet Olfativo
                </h1>

                <p className="text-sm text-[#c9a34a]">
                    Minha coleção de fragrâncias
                </p>
            </div>
        </div>
    )
}