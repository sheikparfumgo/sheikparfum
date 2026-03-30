type RadarSectionProps = {
    title: string
    subtitle?: string
    children: React.ReactNode
}

export default function RadarSection({
    title,
    subtitle,
    children
}: RadarSectionProps) {
    return (
        <section className="space-y-3">

            <div className="flex items-end justify-between">

                <div>
                    <h2 className="text-lg md:text-xl font-semibold text-white">
                        {title}
                    </h2>

                    {subtitle && (
                        <p className="text-sm text-zinc-400">
                            {subtitle}
                        </p>
                    )}
                </div>

            </div>

            {children}

        </section>
    )
}