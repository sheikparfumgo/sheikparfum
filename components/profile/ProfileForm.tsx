"use client"

import { useState, useRef } from "react"
import { useAuth } from "@/hooks/useAuth"
import { supabase } from "@/lib/supabase/client"
import { toast } from "sonner"
import { Camera, CheckCircle2, Loader2, Pencil } from "lucide-react"

export default function ProfileForm() {
    const { user, profile, updateProfile } = useAuth()
    
    const [isEditingName, setIsEditingName] = useState(false)
    const [newName, setNewName] = useState(profile?.full_name || "")
    const [savingName, setSavingName] = useState(false)
    const [uploading, setUploading] = useState(false)
    
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file || !user) return

        setUploading(true)
        try {
            const fileExt = file.name.split('.').pop()
            const fileName = `${user.id}-${Date.now()}.${fileExt}`

            // Tenta bucket 'avatars' primeiro, fallback para 'avatar'
            let publicUrl = ""
            const { error: err1 } = await supabase.storage.from('avatars').upload(fileName, file, { upsert: true })
            
            if (!err1) {
                const { data } = supabase.storage.from('avatars').getPublicUrl(fileName)
                publicUrl = data.publicUrl
            } else {
                const { error: err2 } = await supabase.storage.from('avatar').upload(fileName, file, { upsert: true })
                if (err2) throw err2
                const { data } = supabase.storage.from('avatar').getPublicUrl(fileName)
                publicUrl = data.publicUrl
            }

            await updateProfile({ avatar_url: publicUrl })
            toast.success("Avatar atualizado!")
        } catch (error: any) {
            toast.error("Erro ao enviar imagem: " + error.message)
        } finally {
            setUploading(false)
        }
    }

    const handleUpdateName = async () => {
        if (!newName.trim()) return
        setSavingName(true)
        await updateProfile({ full_name: newName.trim() })
        setSavingName(false)
        setIsEditingName(false)
        toast.success("Nome atualizado!")
    }

    if (!user || !profile) return null

    return (
        <div className="flex flex-col md:flex-row items-center gap-6">
            {/* Avatar */}
            <div 
                className="relative group cursor-pointer" 
                onClick={() => fileInputRef.current?.click()}
            >
                <img 
                    src={profile.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`}
                    alt="Avatar" 
                    className="w-24 h-24 rounded-full border-2 border-[#c9a34a] shadow-[0_0_20px_rgba(201,163,74,0.3)] object-cover"
                />
                <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    {uploading 
                        ? <Loader2 className="animate-spin text-white" size={20} /> 
                        : <Camera size={22} className="text-white" />
                    }
                </div>
                <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/*" 
                    onChange={handleAvatarUpload} 
                />
            </div>

            {/* Nome + Email */}
            <div className="flex-1 text-center md:text-left space-y-2">
                <div className="flex items-center justify-center md:justify-start gap-2">
                    {isEditingName ? (
                        <div className="flex items-center gap-2">
                            <input 
                                autoFocus
                                value={newName}
                                onChange={e => setNewName(e.target.value)}
                                onKeyDown={e => e.key === "Enter" && handleUpdateName()}
                                className="bg-zinc-900 border border-[#c9a34a] rounded-lg px-3 py-1.5 text-white outline-none text-lg font-bold"
                            />
                            <button 
                                onClick={handleUpdateName} 
                                disabled={savingName}
                                className="p-1.5 bg-green-500/10 text-green-400 rounded-lg hover:bg-green-500/20 transition"
                            >
                                {savingName 
                                    ? <Loader2 size={18} className="animate-spin" /> 
                                    : <CheckCircle2 size={18} />
                                }
                            </button>
                            <button 
                                onClick={() => setIsEditingName(false)}
                                className="p-1.5 text-zinc-500 hover:text-white transition"
                            >
                                ✕
                            </button>
                        </div>
                    ) : (
                        <>
                            <h1 className="text-2xl font-bold text-white">
                                {profile.full_name || "Usuário Sheik"}
                            </h1>
                            <button 
                                onClick={() => { setIsEditingName(true); setNewName(profile.full_name || "") }}
                                className="p-1 text-zinc-600 hover:text-[#c9a34a] transition rounded"
                                title="Editar nome"
                            >
                                <Pencil size={14} />
                            </button>
                        </>
                    )}
                </div>
                <p className="text-zinc-400 text-sm">{user.email}</p>
            </div>
        </div>
    )
}
