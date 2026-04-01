"use client"

import { useState, useEffect } from "react"
import { X, Loader2, MapPin } from "lucide-react"

type AddressModalProps = {
    isOpen: boolean
    onClose: () => void
    onSave: (address: any) => Promise<void>
    initialData?: any
}

export default function AddressModal({ isOpen, onClose, onSave, initialData }: AddressModalProps) {
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        name: "",
        recipient_name: "",
        phone: "",
        zip_code: "",
        street: "",
        number: "",
        complement: "",
        neighborhood: "",
        city: "",
        state: "",
        is_default: false
    })

    useEffect(() => {
        if (initialData) {
            setFormData(initialData)
        } else {
            setFormData({
                name: "",
                recipient_name: "",
                phone: "",
                zip_code: "",
                street: "",
                number: "",
                complement: "",
                neighborhood: "",
                city: "",
                state: "",
                is_default: false
            })
        }
    }, [initialData, isOpen])

    const handleZipCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value.replace(/\D/g, "")
        if (value.length > 8) value = value.slice(0, 8)
        if (value.length > 5) {
            value = value.replace(/^(\d{5})(\d)/, "$1-$2")
        }
        setFormData({ ...formData, zip_code: value })

        // Auto-complete (ViaCEP)
        if (value.replace("-", "").length === 8) {
            fetch(`https://viacep.com.br/ws/${value.replace("-", "")}/json/`)
                .then(res => res.json())
                .then(data => {
                    if (!data.erro) {
                        setFormData(prev => ({
                            ...prev,
                            zip_code: value,
                            street: data.logradouro,
                            neighborhood: data.bairro,
                            city: data.localidade,
                            state: data.uf
                        }))
                    }
                })
        }
    }

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value.replace(/\D/g, "")
        if (value.length > 11) value = value.slice(0, 11)
        
        if (value.length > 10) {
            value = value.replace(/^(\d{2})(\d{1})(\d{4})(\d{4})$/, "($1) $2 $3-$4")
        } else if (value.length > 6) {
            value = value.replace(/^(\d{2})(\d{4})(\d{4})$/, "($1) $2-$3")
        } else if (value.length > 2) {
            value = value.replace(/^(\d{2})(\d)/, "($1) $2")
        }
        
        setFormData({ ...formData, phone: value })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        try {
            await onSave(formData)
            onClose()
        } finally {
            setLoading(false)
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
            
            <div className="relative w-full max-w-xl bg-[#111112] border border-[#2a2a2a] rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in duration-200">
                
                <div className="p-6 border-b border-[#2a2a2a] flex items-center justify-between bg-gradient-to-r from-transparent via-[#c9a34a]/5 to-transparent">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-[#c9a34a]/10 rounded-lg text-[#c9a34a]">
                            <MapPin size={20} />
                        </div>
                        <h2 className="text-xl font-bold text-white">
                            {initialData ? "Editar Endereço" : "Novo Endereço"}
                        </h2>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition">
                        <X size={20} className="text-zinc-500" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto custom-scrollbar">
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Identificação (ex: Casa)</label>
                            <input 
                                required
                                value={formData.name}
                                onChange={e => setFormData({...formData, name: e.target.value})}
                                className="input-premium h-12" 
                                placeholder="Minha Casa"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">CEP</label>
                            <input 
                                required
                                value={formData.zip_code}
                                onChange={handleZipCodeChange}
                                className="input-premium h-12" 
                                placeholder="00000-000"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Destinatário</label>
                            <input 
                                required
                                value={formData.recipient_name}
                                onChange={e => setFormData({...formData, recipient_name: e.target.value})}
                                className="input-premium h-12" 
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Telefone</label>
                            <input 
                                required
                                value={formData.phone}
                                onChange={handlePhoneChange}
                                className="input-premium h-12" 
                                placeholder="(00) 0 0000-0000"
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Rua / Logradouro</label>
                        <input 
                            required
                            value={formData.street}
                            onChange={e => setFormData({...formData, street: e.target.value})}
                            className="input-premium h-12" 
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Número</label>
                            <input 
                                required
                                value={formData.number}
                                onChange={e => setFormData({...formData, number: e.target.value})}
                                className="input-premium h-12" 
                            />
                        </div>
                        <div className="sm:col-span-2 space-y-1.5">
                            <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Complemento / Ref</label>
                            <input 
                                value={formData.complement}
                                onChange={e => setFormData({...formData, complement: e.target.value})}
                                className="input-premium h-12" 
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Bairro</label>
                            <input 
                                required
                                value={formData.neighborhood}
                                onChange={e => setFormData({...formData, neighborhood: e.target.value})}
                                className="input-premium h-12" 
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Cidade</label>
                            <input 
                                required
                                value={formData.city}
                                onChange={e => setFormData({...formData, city: e.target.value})}
                                className="input-premium h-12" 
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">UF</label>
                            <input 
                                required
                                value={formData.state}
                                onChange={e => setFormData({...formData, state: e.target.value})}
                                className="input-premium h-12 uppercase" 
                                maxLength={2}
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-3 pt-2">
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input 
                                type="checkbox" 
                                className="sr-only peer"
                                checked={formData.is_default}
                                onChange={e => setFormData({...formData, is_default: e.target.checked})}
                            />
                            <div className="w-11 h-6 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#c9a34a]"></div>
                            <span className="ms-3 text-sm font-medium text-zinc-400">Definir como endereço padrão</span>
                        </label>
                    </div>

                </form>

                <div className="p-6 bg-[#161618] flex items-center justify-end gap-3">
                    <button 
                        onClick={onClose}
                        className="px-6 py-2.5 rounded-xl text-zinc-400 font-bold text-sm hover:text-white transition"
                    >
                        Cancelar
                    </button>
                    <button 
                        onClick={handleSubmit}
                        disabled={loading}
                        className="px-8 py-2.5 bg-[#c9a34a] text-black rounded-xl font-bold text-sm hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 disabled:opacity-50"
                    >
                        {loading && <Loader2 size={16} className="animate-spin" />}
                        Salvar Endereço
                    </button>
                </div>

            </div>
        </div>
    )
}
