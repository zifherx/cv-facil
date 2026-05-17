export function PublicFooter() {
  return (
    <footer className="border-t border-[#E8E6DF] bg-[#FAFAF8] px-8 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 md:flex-row">
        <span className="text-lg font-semibold text-[#1C1C1A]">
          cv<span className="text-[#D85A30]">fácil</span>
        </span>
        <p className="font-['Inter',sans-serif] text-xs text-[#888780]">
          © {new Date().getFullYear()} cvfácil. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  )
}
