"use client"

import { useState, useRef, useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { ChevronDown, LogOut } from "lucide-react"

export default function UserMenu() {
  const { user, signOut } = useAuth()
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // fechar ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () =>
      document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  if (!user) return null

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 text-slate-300 hover:text-white transition"
      >
        <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-sm font-semibold">
          {user.nome.charAt(0)}
        </div>

        <span className="hidden sm:block">{user.nome}</span>

        <ChevronDown size={16} />
      </button>

      {open && (
        <div className="absolute right-0 mt-3 w-56 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl backdrop-blur-xl p-4 z-50">
          <div className="mb-3">
            <p className="text-sm font-medium text-white">
              {user.nome}
            </p>
            <p className="text-xs text-slate-400">
              {user.funcao}
            </p>
          </div>

          <div className="border-t border-slate-800 pt-3">
            <button
              onClick={signOut}
              className="flex items-center gap-2 text-slate-400 hover:text-red-500 transition text-sm"
            >
              <LogOut size={16} />
              Sair
            </button>
          </div>
        </div>
      )}
    </div>
  )
}