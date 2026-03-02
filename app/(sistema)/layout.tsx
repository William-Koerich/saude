"use client"

import { ReactNode, useState } from "react"
import {
  Menu,
  X,
  LayoutDashboard,
  Users,
  Building2,
  List,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import Link from "next/link"
import { usePathname } from "next/navigation"
import UserMenu from "@/components/UserMenu"

export default function DashboardLayout({
  children,
}: {
  children: ReactNode
}) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const { signOut } = useAuth()

  const pathname = usePathname()

  const menu = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/dashboard/unidades", label: "Unidades", icon: Building2 },
    { href: "/dashboard/funcionarios", label: "Funcionários", icon: Users },
    { href: "/dashboard/fila", label: "Fila", icon: List },
  ]

  return (
    <div className="min-h-screen bg-slate-950 text-white flex">

      {/* SIDEBAR DESKTOP */}
      <aside
        className={`
          hidden md:flex flex-col
          ${collapsed ? "w-20" : "w-64"}
          transition-all duration-300
          bg-slate-900/60 backdrop-blur-xl
          border-r border-slate-800 p-4
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          {!collapsed && (
            <h1 className="text-indigo-500 font-semibold text-lg">
              Sistema
            </h1>
          )}

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="text-slate-400 hover:text-white"
          >
            {collapsed ? <ChevronRight /> : <ChevronLeft />}
          </button>
        </div>

        {/* Menu */}
        <nav className="space-y-2 flex-1">
          {menu.map((item) => {
            const Icon = item.icon
            const active = pathname === item.href

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  flex items-center gap-3 px-3 py-2 rounded-lg transition
                  ${active
                    ? "bg-indigo-600 text-white"
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"}
                `}
              >
                <Icon size={20} />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            )
          })}
        </nav>

        {/* Logout */}
        <button
          onClick={signOut}
          className="flex items-center gap-3 text-slate-400 hover:text-red-500 transition mt-4"
        >
          <LogOut size={20} />
          {!collapsed && <span>Sair</span>}
        </button>
      </aside>

      {/* MOBILE DRAWER */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden bg-black/60">
          <div className="w-64 h-full bg-slate-900 p-6 border-r border-slate-800">
            <div className="flex justify-between mb-6">
              <h1 className="text-indigo-500 font-semibold">Sistema</h1>
              <X onClick={() => setMobileOpen(false)} />
            </div>

            {menu.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 px-3 py-2 text-slate-400 hover:bg-slate-800 rounded-lg"
                >
                  <Icon size={20} />
                  {item.label}
                </Link>
              )
            })}
          </div>
        </div>
      )}

      {/* CONTENT */}
      <div className="flex-1 flex flex-col">
        <header className="h-16 flex items-center justify-between px-6 border-b border-slate-800 bg-slate-900/40 backdrop-blur-md">
          <Menu
            className="md:hidden cursor-pointer"
            onClick={() => setMobileOpen(true)}
          />

          <UserMenu />
        </header>

        <main className="flex-1 p-6 bg-linear-to-br from-slate-950 via-slate-900 to-slate-950">
          {children}
        </main>
      </div>
    </div>
  )
}