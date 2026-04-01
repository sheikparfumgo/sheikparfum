export default function PoliticaPage() {
    return (
        <div className="pt-24 pb-32 px-6 max-w-4xl mx-auto text-zinc-300 space-y-6">

            <h1 className="text-3xl font-bold text-yellow-500">
                Política de Privacidade
            </h1>

            <p className="text-sm text-zinc-500">
                Em conformidade com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018 - LGPD).
            </p>

            <Section title="1. Controlador de Dados">
                A Sheik Parfum é responsável pelo tratamento dos dados pessoais coletados na plataforma.
            </Section>

            <Section title="2. Dados Coletados">
                Coletamos dados como nome, e-mail, endereço, histórico de compras e dados de navegação.
            </Section>

            <Section title="3. Base Legal">
                O tratamento é realizado com base em:
                execução de contrato, consentimento e cumprimento de obrigação legal.
            </Section>

            <Section title="4. Finalidade">
                Processar pedidos, autenticação, personalização da experiência e prevenção a fraudes.
            </Section>

            <Section title="5. Compartilhamento">
                Dados podem ser compartilhados com:
                Google (login), gateways de pagamento e provedores de infraestrutura.
            </Section>

            <Section title="6. Direitos do Usuário">
                Você pode solicitar:
                acesso, correção, exclusão e portabilidade dos dados.
            </Section>

            <Section title="7. Segurança">
                Utilizamos criptografia e boas práticas de segurança.
            </Section>

            <Section title="8. Retenção">
                Dados são mantidos enquanto necessário para obrigações legais e operacionais.
            </Section>

            <Section title="9. Contato">
                Email: sheikparfum.go@gmail.com
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