"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ChevronDown, Menu, X } from "lucide-react"

type DropdownItem = { label: string; href: string }
type NavItem = { label: string; href?: string; items?: DropdownItem[] }

const navItems: NavItem[] = [
  {
    label: "產品",
    items: [
      { label: "AegisCode Code", href: "/code" },
      { label: "AegisCode Surface", href: "/surface" },
    ],
  },
  { label: "方案", href: "/pricing" },
  {
    label: "資源",
    items: [
      { label: "下載中心", href: "/resources" },
      { label: "ROI 計算", href: "/roi" },
      { label: "常見問題", href: "/#faq" },
    ],
  },
  { label: "POC 申請", href: "/trial" },
]

function Dropdown({ item }: { item: NavItem }) {
  const [open, setOpen] = useState(false)
  if (!item.items) {
    return (
      <Link
        href={item.href!}
        className="text-sm text-gray-400 hover:text-white transition-colors"
      >
        {item.label}
      </Link>
    )
  }
  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-white transition-colors"
        aria-expanded={open}
        aria-haspopup="true"
      >
        {item.label}
        <ChevronDown className="h-3.5 w-3.5" />
      </button>
      {open ? (
        <div className="absolute left-0 top-full pt-2">
          <div className="min-w-[180px] rounded-lg border border-[#243447] bg-[#0F1923] py-2 shadow-lg">
            {item.items.map((sub) => (
              <Link
                key={sub.href}
                href={sub.href}
                className="block px-4 py-2 text-sm text-gray-300 hover:bg-[#1A2332] hover:text-white"
              >
                {sub.label}
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <nav
      className={`fixed left-0 right-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#0D1521]/90 backdrop-blur-md border-b border-[#243447]/50"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link
          href="/"
          className="text-xl font-bold tracking-tight text-white"
        >
          Aegis<span className="text-[#14B8A6]">Code</span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <Dropdown key={item.label} item={item} />
          ))}
          <Link
            href="/trial"
            className="rounded-lg bg-[#0D9488] px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-[#0F766E]"
          >
            預約 Demo
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="text-gray-400 hover:text-white md:hidden"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {mobileOpen ? (
        <div className="border-b border-[#243447]/50 bg-[#0D1521]/95 backdrop-blur-md md:hidden">
          <div className="mx-auto flex max-w-6xl flex-col gap-3 px-6 py-4">
            {navItems.flatMap((item) =>
              item.items
                ? item.items.map((sub) => (
                    <Link
                      key={sub.href}
                      href={sub.href}
                      onClick={() => setMobileOpen(false)}
                      className="text-sm text-gray-300 hover:text-white"
                    >
                      {sub.label}
                    </Link>
                  ))
                : [
                    <Link
                      key={item.href}
                      href={item.href!}
                      onClick={() => setMobileOpen(false)}
                      className="text-sm text-gray-300 hover:text-white"
                    >
                      {item.label}
                    </Link>,
                  ],
            )}
            <Link
              href="/trial"
              onClick={() => setMobileOpen(false)}
              className="rounded-lg bg-[#0D9488] px-5 py-2 text-center text-sm font-medium text-white transition-colors hover:bg-[#0F766E]"
            >
              預約 Demo
            </Link>
          </div>
        </div>
      ) : null}
    </nav>
  )
}
