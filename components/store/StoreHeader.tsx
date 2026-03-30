export default function StoreHeader() {
    return (
        <header className="sticky top-0 z-50 bg-background-dark/95 backdrop-blur-md border-b border-primary/10">

            <div className="flex items-center justify-between p-4">

                <button className="text-primary">
                    🔍
                </button>

                <h1 className="text-xl font-extrabold uppercase tracking-tight text-primary">
                    Sheik Parfum
                </h1>

                <button className="relative">
                    🛍

                    <span className="absolute -top-1 -right-1 bg-primary text-background-dark text-[10px] px-1.5 rounded-full">
                        2
                    </span>

                </button>

            </div>

        </header>
    )
}