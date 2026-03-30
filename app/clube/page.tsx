export default function ClubePage() {
    return (
        <div className="max-w-6xl mx-auto">

            {/* HERO */}
            <section className="relative rounded-xl overflow-hidden border border-[#2a2a2a] mb-10">
                <div
                    className="h-[260px] bg-cover bg-center flex items-end"
                    style={{
                        backgroundImage:
                            "linear-gradient(0deg, rgba(15,15,16,0.9), rgba(15,15,16,0.2)), url('https://lh3.googleusercontent.com/aida-public/AB6AXuBtftLdNG3RdWocVJ5I-BuLAp5Kwcrzv2AYJ2nXpKTCLtKi2rIpaOKABFQTEOeOsr7dk7F4DqrEzXY4Df9iyY3ZkaGzWf-MxDcVbasbkpUumVvdx83ndvD_ej7AxnSB6VgGxJ8BSJZURhqWB__BZjgccTqKwlHgcaQOK3k-GjzqnY95UPHuJmJz6nPfDRgRiX8l7-jlu3RFIFYkLOJZQQdjQoCqkUo82BqNyq2wT1NUHnzR6zk8fUJkiBNx36HCuV7xJm47DaLMRr2S')",
                    }}
                >
                    <div className="p-8">
                        <h1 className="text-3xl md:text-4xl font-bold">
                            Clube do Sheik
                        </h1>

                        <p className="text-[#c9a34a] mt-2">
                            Descubra os lançamentos do mês e encontre seu próximo perfume
                        </p>
                    </div>
                </div>
            </section>

            {/* VANTAGENS */}
            <section className="mb-12">

                <h2 className="text-xl font-bold mb-6">
                    Vantagens do Clube
                </h2>

                <div className="grid md:grid-cols-3 gap-4">

                    <div className="p-4 rounded-lg border border-[#2a2a2a] bg-[#161617]">
                        <h3 className="font-semibold mb-1">
                            Lançamentos mensais
                        </h3>
                        <p className="text-sm text-zinc-400">
                            Todo mês escolhemos 5 perfumes novos para você descobrir.
                        </p>
                    </div>

                    <div className="p-4 rounded-lg border border-[#2a2a2a] bg-[#161617]">
                        <h3 className="font-semibold mb-1">
                            Cupom exclusivo
                        </h3>
                        <p className="text-sm text-zinc-400">
                            Assinantes recebem R$30 de desconto para comprar o perfume completo.
                        </p>
                    </div>

                    <div className="p-4 rounded-lg border border-[#2a2a2a] bg-[#161617]">
                        <h3 className="font-semibold mb-1">
                            Descubra novos perfumes
                        </h3>
                        <p className="text-sm text-zinc-400">
                            Experimente fragrâncias diferentes todo mês.
                        </p>
                    </div>

                </div>

            </section>

            {/* PLANOS */}

            <section>

                <h2 className="text-2xl font-bold text-center mb-10">
                    Escolha seu Plano
                </h2>

                <div className="grid md:grid-cols-3 gap-6">

                    {/* Explorador */}

                    <div className="border border-[#2a2a2a] rounded-xl p-6 bg-[#161617] flex flex-col">

                        <h3 className="text-lg font-semibold mb-1">
                            Explorador
                        </h3>

                        <p className="text-3xl font-bold text-[#c9a34a] mb-6">
                            R$34,90
                            <span className="text-sm text-zinc-400"> /mês</span>
                        </p>

                        <ul className="space-y-2 text-sm text-zinc-300 mb-6">

                            <li>• 3 decants de 2ml</li>

                            <li>• Escolha entre 5 perfumes do mês</li>

                            <li>• Descubra novos lançamentos</li>

                            <li>• Cupom de R$30 para compra do perfume</li>

                        </ul>

                        <button className="mt-auto bg-[#c9a34a] text-black font-semibold py-3 rounded-lg hover:opacity-90">
                            Assinar
                        </button>

                    </div>

                    {/* Connaisseur */}

                    <div className="border-2 border-[#c9a34a] rounded-xl p-6 bg-[#1a1a1b] flex flex-col relative">

                        <span className="absolute top-0 right-0 bg-[#c9a34a] text-black text-xs font-bold px-3 py-1 rounded-bl-lg">
                            MAIS POPULAR
                        </span>

                        <h3 className="text-lg font-semibold mb-1">
                            Connaisseur
                        </h3>

                        <p className="text-3xl font-bold text-[#c9a34a] mb-6">
                            R$49,90
                            <span className="text-sm text-zinc-400"> /mês</span>
                        </p>

                        <ul className="space-y-2 text-sm text-zinc-300 mb-6">

                            <li>• 1 decant de 5ml</li>

                            <li>• Escolha entre 5 perfumes do mês</li>

                            <li>• Perfume suficiente para várias semanas</li>

                            <li>• Cupom de R$30 para compra do perfume</li>

                        </ul>

                        <button className="mt-auto bg-[#c9a34a] text-black font-semibold py-3 rounded-lg hover:opacity-90">
                            Assinar
                        </button>

                    </div>

                    {/* Sheikh Club */}

                    <div className="border border-[#2a2a2a] rounded-xl p-6 bg-[#161617] flex flex-col">

                        <h3 className="text-lg font-semibold mb-1">
                            Sheikh Club
                        </h3>

                        <p className="text-3xl font-bold text-[#c9a34a] mb-6">
                            R$69,90
                            <span className="text-sm text-zinc-400"> /mês</span>
                        </p>

                        <ul className="space-y-2 text-sm text-zinc-300 mb-6">

                            <li>• 1 decant de 10ml</li>

                            <li>• Acesso ao perfume hype do mês</li>

                            <li>• Escolha entre todos os 5 perfumes</li>

                            <li>• Cupom de R$30 para compra do perfume</li>

                        </ul>

                        <button className="mt-auto bg-[#c9a34a] text-black font-semibold py-3 rounded-lg hover:opacity-90">
                            Assinar
                        </button>

                    </div>

                </div>

            </section>

        </div>
    )
}