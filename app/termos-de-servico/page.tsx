export default function TermosPage() {
    return (
        <div className="pt-24 pb-32 px-6 max-w-3xl mx-auto text-zinc-300">

            {/* HEADER */}
            <div className="mb-10 flex items-center gap-4">
                <h1 className="text-3xl font-bold text-white">
                    Termos de Uso
                </h1>
            </div>

            {/* HERO */}
            <div className="relative w-full h-48 rounded-xl mb-12 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-[#0F0F10] to-transparent" />
                <div className="absolute bottom-4 left-6 text-xs text-yellow-500 uppercase tracking-widest">
                    Atualizado recentemente
                </div>
            </div>

            {/* CONTENT */}
            <div className="space-y-6">

                <Section
                    title="1. Aceitação dos Termos"
                    text="Ao utilizar a plataforma Sheik Parfum, você concorda com estes termos. Caso não concorde, não utilize o serviço."
                />

                <Section
                    title="2. Conta do Usuário"
                    text="Você é responsável por manter a segurança da sua conta e pela veracidade das informações fornecidas."
                />

                <Section
                    title="3. Compras e Clube"
                    text="Pedidos dependem de confirmação de pagamento. Assinaturas podem ser renovadas automaticamente."
                    highlight
                />

                <Section
                    title="4. Propriedade Intelectual"
                    text="Todo conteúdo pertence à Sheik Parfum e não pode ser reproduzido sem autorização."
                />

                <Section
                    title="5. Limitação de Responsabilidade"
                    text="Não garantimos ausência total de erros ou variações em produtos."
                />

                {/* SUPORTE */}
                <div className="mt-6 p-6 bg-zinc-900 rounded-xl text-center border border-zinc-800">
                    <h3 className="font-bold text-white mb-2">
                        Precisa de ajuda?
                    </h3>
                    <p className="text-sm text-zinc-400 mb-4">
                        Nossa equipe está pronta para te atender
                    </p>
                    <a
                        href="/suporte"
                        className="px-6 py-3 bg-yellow-500 text-black rounded-lg font-bold"
                    >
                        Contatar Suporte
                    </a>
                </div>

            </div>
        </div>
    )
}

function Section({
    title,
    text,
    highlight
}: {
    title: string
    text: string
    highlight?: boolean
}) {
    return (
        <section
            className={`p-6 rounded-xl border ${highlight
                    ? "border-yellow-500 bg-zinc-900"
                    : "border-zinc-800 bg-zinc-900"
                }`}
        >
            <h3 className="text-yellow-500 font-bold mb-2">
                {title}
            </h3>
            <p className="text-sm text-zinc-400">
                {text}
            </p>
        </section>
    )
}