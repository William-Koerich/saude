"use client"

import Link from "next/link"
import { X } from "lucide-react"
import { usePathname } from "next/navigation"

interface Props {
  open: boolean
  setOpen: (value: boolean) => void
}

export default function Sidebar({ open, setOpen }: Props) {
  const pathname = usePathname()

  const menu = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Fila", href: "/fila" },
    { name: "Funcionários", href: "/funcionarios" },
  ]

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={`
          fixed md:static z-50
          w-64 bg-white shadow-lg
          transform transition-transform
          ${open ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="font-bold text-xl">SAÚDE</h2>

          <button
            className="md:hidden"
            onClick={() => setOpen(false)}
          >
            <X />
          </button>
        </div>

        <nav className="p-4 space-y-2">
          {menu.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`
                block px-3 py-2 rounded-lg transition
                ${
                  pathname === item.href
                    ? "bg-blue-500 text-white"
                    : "hover:bg-gray-100"
                }
              `}
            >
              {item.name}
            </Link>
          ))}
        </nav>
      </aside>
    </>
  )
}