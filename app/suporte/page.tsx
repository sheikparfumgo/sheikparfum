export default function SuportePage() {
    return (
        <div className="pt-24 pb-32 px-6 max-w-4xl mx-auto text-zinc-300 space-y-8">

            <h1 className="text-3xl font-bold text-white">
                Central de Suporte
            </h1>

            <div className="grid md:grid-cols-2 gap-6">

                <a href="https://wa.me/5562999999999"
                    className="p-6 bg-zinc-900 rounded-xl border border-zinc-800 hover:border-yellow-500">
                    <h3 className="text-yellow-500 font-bold">WhatsApp</h3>
                    <p className="text-sm">Atendimento rápido</p>
                </a>

                <a href="mailto:sheikparfum.go@gmail.com"
                    className="p-6 bg-zinc-900 rounded-xl border border-zinc-800 hover:border-yellow-500">
                    <h3 className="text-yellow-500 font-bold">E-mail</h3>
                    <p className="text-sm">sheikparfum.go@gmail.com</p>
                </a>

            </div>

            <div className="p-6 bg-zinc-900 rounded-xl border border-zinc-800">
                <h3 className="text-yellow-500 font-bold mb-2">
                    Horário de atendimento
                </h3>
                <p className="text-sm">
                    Segunda a Sexta: 09h às 18h
                </p>
            </div>

        </div>
    )
}