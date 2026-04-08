export default function OrderModal({ order, onClose }: any) {

    const items = JSON.parse(order.items_json || "[]")
    const address = order.address_json || {}

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">

            <div className="bg-zinc-900 p-6 rounded-xl w-full max-w-lg space-y-4">

                <h2 className="text-xl font-bold">
                    Pedido #{order.id}
                </h2>

                {/* PRODUTOS */}
                <div>
                    <p className="text-sm text-zinc-400">Produtos</p>

                    {items.map((i: any) => (
                        <div key={i.id} className="text-sm">
                            {i.name} - {i.size}ml (x{i.quantity})
                        </div>
                    ))}
                </div>

                {/* ENDEREÇO */}
                <div>
                    <p className="text-sm text-zinc-400">Entrega</p>

                    <div className="text-sm">
                        {address.street}, {address.number}
                        <br />
                        {address.city} - {address.state}
                    </div>
                </div>

                {/* STATUS */}
                <div>
                    <p>Status: {order.status}</p>
                </div>

                <button
                    onClick={onClose}
                    className="btn-primary w-full"
                >
                    Fechar
                </button>

            </div>

        </div>
    )
}