type Props = {
    level: number
}

export default function ClosetUsageBar({ level }: Props) {

    return (
        <div>

            <div className="w-full bg-[#2a2a2a] h-2 rounded-full overflow-hidden">

                <div
                    className="bg-[#c9a34a] h-full"
                    style={{ width: `${level}%` }}
                />

            </div>

            <p className="text-xs text-gray-400 mt-1">
                {level}% restante
            </p>

        </div>
    )
}