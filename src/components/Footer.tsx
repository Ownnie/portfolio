// components/Footer.tsx
export default function Footer() {
    return (
        <footer className="mt-16 border-t border-white/10">
            <div className="max-w-6xl mx-auto px-6 py-10 text-sm text-white/60">
                © {new Date().getFullYear()} Nicolás Calderón — Disponible para proyectos.
            </div>
        </footer>
    );
}
