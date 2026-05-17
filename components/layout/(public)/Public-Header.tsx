import Link from "next/link"

export function PublicHeader() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 flex items-center justify-between border-b border-[#E8E6DF] bg-[#FAFAF8]/90 px-8 py-5 backdrop-blur-sm">
      <span className="text-xl font-semibold tracking-tight text-[#1C1C1A]">
        cv<span className="text-[#D85A30]">fácil</span>
      </span>
      <nav className="hidden items-center gap-8 font-['Inter',sans-serif] text-sm text-[#5F5E5A] md:flex">
        <a href="#features" className="transition-colors hover:text-[#1C1C1A]">
          Características
        </a>
        <a href="#how" className="transition-colors hover:text-[#1C1C1A]">
          Cómo funciona
        </a>
        <a href="#pricing" className="transition-colors hover:text-[#1C1C1A]">
          Precios
        </a>
      </nav>
      <div className="flex items-center gap-3">
        <Link
          href="/auth/login"
          className="px-4 py-2 font-['Inter',sans-serif] text-sm text-[#5F5E5A] transition-colors hover:text-[#1C1C1A]"
        >
          Iniciar sesión
        </Link>
        <Link
          href="/auth/register"
          className="rounded-full bg-[#1C1C1A] px-5 py-2.5 font-['Inter',sans-serif] text-sm text-[#FAFAF8] transition-colors hover:bg-[#D85A30]"
        >
          Empezar gratis
        </Link>
      </div>
    </header>
  )
}
