import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-blue-800 text-white">
      <div className="mx-auto max-w-7xl overflow-hidden px-6 py-20 sm:py-24 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Bc. Pavel Fišer</h3>
            <p className="text-blue-200 mb-4">
              Zastupitel MČ Praha 4<br />
              Manažer s vášní pro komunitní rozvoj
            </p>
            <p className="text-blue-200">© {new Date().getFullYear()} Bc. Pavel Fišer. Všechna práva vyhrazena.</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Rychlé odkazy</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#about" className="text-blue-200 hover:text-white transition-colors">
                  O mně
                </Link>
              </li>
              <li>
                <Link href="#priority" className="text-blue-200 hover:text-white transition-colors">
                  Priority
                </Link>
              </li>
              <li>
                <Link href="#projects" className="text-blue-200 hover:text-white transition-colors">
                  Projekty
                </Link>
              </li>
              <li>
                <Link href="#contact" className="text-blue-200 hover:text-white transition-colors">
                  Kontakt
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Užitečné odkazy</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://www.praha4.cz"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-200 hover:text-white transition-colors"
                >
                  MČ Praha 4
                </a>
              </li>
              <li>
                <a
                  href="https://www.praha.eu"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-200 hover:text-white transition-colors"
                >
                  Hlavní město Praha
                </a>
              </li>
              <li>
                <a
                  href="https://www.anobudelip.cz"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-200 hover:text-white transition-colors"
                >
                  ANO 2011
                </a>
              </li>
              <li>
                <Link href="/privacy-policy" className="text-blue-200 hover:text-white transition-colors">
                  Ochrana osobních údajů
                </Link>
              </li>
              <li>
                <Link href="/terms-of-service" className="text-blue-200 hover:text-white transition-colors">
                  Obchodní podmínky
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-blue-700 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-blue-300 mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} Bc. Pavel Fišer. Všechna práva vyhrazena.
          </p>
          <div className="flex space-x-6">
            <a href="#" className="text-blue-300 hover:text-white">
              <span className="sr-only">Facebook</span>
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fillRule="evenodd"
                  d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                  clipRule="evenodd"
                />
              </svg>
            </a>
            <a href="#" className="text-blue-300 hover:text-white">
              <span className="sr-only">X</span>
              {/* Ikona X (Twitter) */}
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M17.53 2H21l-7.19 9.81L22 22h-7.56l-5.06-6.91L2.47 22H-1l7.62-10.39L2 2h7.56l4.7 6.42L17.53 2zm-2.13 16h2.13l-5.06-6.91L5.47 18H7.6l4.7-6.42L15.4 18z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

