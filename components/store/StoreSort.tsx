type Props = {
    setOrder: (value: string | null) => void
}

export default function StoreSort({ setOrder }: Props) {
    return (
        <div className="flex gap-3">

            <button onClick={() => setOrder("price.asc")}>
                Mais baratos
            </button>

            <button onClick={() => setOrder("price.desc")}>
                Mais caros
            </button>

            <button onClick={() => setOrder(null)}>
                Padrão
            </button>

        </div>
    );
}