"use client"

import { useState } from "react"

export type VolumeOption = {
    label: string
    value: string
}

type Props = {
    options: VolumeOption[]
    onChange?: (value: string) => void
}

export default function VolumeSelector({
    options,
    onChange
}: Props) {

    const [selected, setSelected] = useState(options[0]?.value)

    function handleSelect(value: string) {
        setSelected(value)

        if (onChange) {
            onChange(value)
        }
    }

    return (

        <div className="flex gap-2">

            {options.map(option => {

                const active = option.value === selected

                return (

                    <button
                        key={option.value}
                        onClick={() => handleSelect(option.value)}
                        className={`
              flex-1 py-2 rounded-lg text-xs font-semibold transition
              border
              ${active
                                ? "bg-primary text-background-dark border-primary"
                                : "border-primary/20 hover:border-primary/60"
                            }
            `}
                    >
                        {option.label}
                    </button>

                )

            })}

        </div>

    )
}