const filters = [
    "Masculinos",
    "Femininos",
    "Unissex",
    "Árabes",
    "Decants",
    "Lançamentos"
]

export default function StoreFilterChips() {
    return (
        <div className="flex gap-3 px-4 py-3 overflow-x-auto no-scrollbar">

            {filters.map((filter, i) => (

                <button
                    key={filter}
                    className={`shrink-0 px-4 h-9 rounded-lg text-sm font-medium border
          ${i === 0
                            ? "bg-primary text-background-dark"
                            : "bg-primary/10 border-primary/20"
                        }`}
                >
                    {filter}
                </button>

            ))}

        </div>
    )
}