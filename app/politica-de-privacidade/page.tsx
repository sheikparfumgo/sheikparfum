export default function PoliticaPage() {
    return (
        <div className="pt-24 pb-32 px-6 max-w-4xl mx-auto text-zinc-300">

            <header className="mb-10 text-center">
                <h1 className="text-3xl font-bold text-yellow-500">
                    Política de Privacidade
                </h1>
                <p className="text-sm text-zinc-500">
                    Última atualização recente
                </p>
            </header>

            <div className="space-y-6">

                <Card
                    title="Compromisso com sua privacidade"
                    text="A Sheik Parfum protege seus dados conforme a LGPD, garantindo segurança e transparência."
                />

                <div className="grid md:grid-cols-2 gap-6">
                    <Card
                        title="Dados coletados"
                        text="Nome, e-mail, endereço, pedidos e preferências."
                    />
                    <Card
                        title="Finalidade"
                        text="Melhorar sua experiência, processar pedidos e personalizar recomendações."
                    />
                </div>

                <Card
                    title="Compartilhamento"
                    text="Dados podem ser compartilhados com serviços como Google e plataformas de pagamento."
                />

                <Card
                    title="Segurança"
                    text="Utilizamos criptografia e boas práticas para proteger suas informações."
                />

                <Card
                    title="Seus direitos"
                    text="Você pode solicitar acesso, alteração ou exclusão dos seus dados."
                />

                {/* SUPORTE */}
                <div className="mt-8 p-8 rounded-xl bg-zinc-900 text-center border border-yellow-500/20">
                    <h3 className="text-xl font-bold text-yellow-500 mb-4">
                        Dúvidas ou solicitações?
                    </h3>
                    <p className="text-sm text-zinc-400 mb-4">
                        Entre em contato com nosso suporte
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

function Card({ title, text }: { title: string; text: string }) {
    return (
        <section className="p-6 rounded-xl bg-zinc-900 border border-zinc-800">
            <h3 className="text-yellow-500 font-bold mb-2">
                {title}
            </h3>
            <p className="text-sm text-zinc-400">
                {text}
            </p>
        </section>
    )
}