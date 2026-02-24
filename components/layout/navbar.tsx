"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, ChevronDown, User, LogOut } from "lucide-react"

export default function Navbar() {
  const pathname = usePathname() || ""
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  //Main links
  const navLinks = [
    { name: "Czat", href: "/dashboard/chat" },
    { name: "Treningi", href: "/dashboard/workouts" },
    { name: "Podopieczni", href: "/dashboard/clients" }, 
  ]

  //Dropdown menu - ZASOBY 
  const resourceLinks = [
    { name: "Ćwiczenia", href: "/dashboard/exercises" },
    { name: "Plany treningowe", href: "/dashboard/plans" },
  ]

  const isActive = (path: string) => pathname.startsWith(path)

  return (
    <nav className="sticky top-0 z-50 w-full bg-[#1a1e2a]/40 backdrop-blur-xl border-b border-baby-blue font-michroma">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/*LOGO*/}
          <Link href="/dashboard" className="flex items-center group">
            <div 
            className="relative w-32 h-12 border flex items-center justify-center group-hover:border-baby-blue transition-colors"
            title="Strona główna">
              <span>
                LOGO
              </span>
            </div>
          </Link>

          {/*DESKTOP MENU*/}
          <div className="hidden md:flex items-center space-x-10">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`transition-colors hover:text-baby-blue ${
                  isActive(link.href) ? "text-baby-blue" : "text-white"
                }`}
              >
                {link.name}
              </Link>
            ))}

            {/* DROPDOWN: ZASOBY */}
            <div className="relative group">
              <button className={`flex items-center gap-1 transition-colors hover:text-baby-blue py-8 ${
                isActive("/dashboard/exercises") || isActive("/dashboard/plans") ? "text-baby-blue" : "text-white"
              }`}>
                Zasoby <ChevronDown size={16}/>
              </button>
              
              {/*dropdown content*/}
              <div className="absolute top-[84px] w-52 invisible group-hover:visible transition-all duration-200">
                <div className="bg-dark-navy border border-baby-blue rounded-2xl overflow-hidden flex flex-col p-2 gap-1">
                  {resourceLinks.map((link) => (
                    <Link
                      key={link.name}
                      href={link.href}
                      className={`px-4 py-3 text-sm rounded-xl transition-colors ${
                        isActive(link.href)
                          ? "text-baby-blue bg-dirty-navy" : "hover:bg-dirty-navy"
                      }`}
                    >
                      {link.name}
                    </Link>
                    
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/*DESKTOP: Profile, Log-out*/}
          <div className="hidden md:flex items-center space-x-4">
            <Link 
              href="/dashboard/profile"
              title="Profil"
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                isActive("/dashboard/profile")
                  ? "text-baby-blue border-2 border-baby-blue"
                  : "text-zinc-300 border border-zinc-300 hover:text-baby-blue hover:border-baby-blue hover:border-2"
              }`}
            >
              <User size={20} />
            </Link>
            <button 
              title="Wyloguj się"
              className="w-12 h-12 rounded-full border border-zinc-300 flex items-center justify-center text-zinc-300 hover:text-red-400 hover:border-red-400 hover:border-2 transition-all"
            >
              <LogOut size={20} />
            </button>
          </div>

{/*----------------------------------------------------------------------------------*/}
          {/*MENU ICON (MOBILE)*/}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-baby-blue p-2"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/*MOBILE MENU*/}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-dark-navy border-t border-baby-blue absolute top-20 left-0 w-full px-4 pt-2 pb-6">
          <div className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block px-4 py-3 rounded-xl text-base font-medium ${
                  isActive(link.href) ? "bg-dirty-navy text-baby-blue" : "text-white hover:bg-dirty-navy"
                }`}
              >
                {link.name}
              </Link>
            ))}

            {resourceLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block px-4 py-3 rounded-xl text-base font-medium ${
                  isActive(link.href) ? "bg-dirty-navy text-baby-blue" : "text-white hover:bg-dirty-navy"
                }`}
              >
                {link.name}
              </Link>
            ))}

            {/*MOBILE: Profile, Log-out*/}
            <div className="pt-4 mt-2 border-t border-zinc-700 flex gap-4 px-4">
              <Link 
                href="/dashboard/profile"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center justify-center gap-2 flex-1 bg-dirty-navy py-3 rounded-xl border ${
                  isActive("/dashboard/profile")
                    ? "text-baby-blue border-baby-blue"
                    : "text-zinc-300 border-zinc-700"
                }`}
              >
                <User size={20} /> Profil
              </Link>
              <button 
                className="flex items-center justify-center gap-2 flex-1 bg-dirty-navy py-3 rounded-xl text-zinc-300 hover:text-red-400 border border-zinc-700"
              >
                <LogOut size={20} /> Wyloguj
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}