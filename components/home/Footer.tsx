export default function Footer() {
    return (
        <footer className="mt-20 border-t border-zinc-800 bg-[#0F0F10] text-zinc-400">

            <div className="max-w-6xl mx-auto px-6 py-10 grid md:grid-cols-4 gap-8 w-full">

                {/* Marca */}
                <div>
                    <h3 className="text-white font-bold text-lg mb-3">
                        Sheik Parfum
                    </h3>
                    <p className="text-sm">
                        Experiência premium em fragrâncias e curadoria exclusiva.
                    </p>
                </div>

                {/* Navegação */}
                <div>
                    <h4 className="text-white font-semibold mb-3">Navegação</h4>
                    <ul className="space-y-2 text-sm">
                        <li><a href="/loja">Loja</a></li>
                        <li><a href="/novidades">Novidades</a></li>
                        <li><a href="/clube">Clube</a></li>
                    </ul>
                </div>

                {/* Legal */}
                <div>
                    <h4 className="text-white font-semibold mb-3">Legal</h4>
                    <ul className="space-y-2 text-sm">
                        <li><a href="/politica-de-privacidade">Política de Privacidade</a></li>
                        <li><a href="/termos-de-servico">Termos de Uso</a></li>
                    </ul>
                </div>

                {/* Suporte */}
                <div>
                    <h4 className="text-white font-semibold mb-3">Suporte</h4>
                    <ul className="space-y-2 text-sm">
                        <li><a href="/suporte">Central de Ajuda</a></li>
                        <li><a href="mailto:sheikparfum.go@gmail.com">E-mail</a></li>
                    </ul>
                </div>

            </div>

            <div className="border-t border-zinc-800 text-center text-xs py-4">
                © {new Date().getFullYear()} Sheik Parfum. Todos os direitos reservados.
            </div>

        </footer>
    )
}