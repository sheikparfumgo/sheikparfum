export default function TermosPage() {
    return (
        <div className="pt-24 pb-32 px-6 max-w-4xl mx-auto text-zinc-300 space-y-6">

            <h1 className="text-3xl font-bold text-yellow-500">
                Termos de Uso
            </h1>

            <Section title="1. Aceitação">
                Ao utilizar a plataforma, você concorda integralmente com estes termos.
            </Section>

            <Section title="2. Responsabilidade do Usuário">
                O usuário é responsável pelas informações fornecidas e pelo uso da conta.
            </Section>

            <Section title="3. Compras">
                Pedidos estão sujeitos à confirmação de pagamento e disponibilidade.
            </Section>

            <Section title="4. Cancelamentos">
                Podemos cancelar pedidos em caso de fraude ou inconsistência.
            </Section>

            <Section title="5. Limitação de Responsabilidade">
                Não nos responsabilizamos por falhas externas ou uso indevido.
            </Section>

            <Section title="6. Propriedade Intelectual">
                Todo conteúdo é protegido por direitos autorais.
            </Section>

            <Section title="7. Alterações">
                Os termos podem ser alterados a qualquer momento.
            </Section>

            <Section title="8. Foro">
                Fica eleito o foro do domicílio do usuário.
            </Section>

        </div>
    )
}

function Section({ title, children }: any) {
    return (
        <div className="p-5 bg-zinc-900 rounded-xl border border-zinc-800">
            <h3 className="text-yellow-500 font-bold mb-2">{title}</h3>
            <p className="text-sm text-zinc-400">{children}</p>
        </div>
    )
}