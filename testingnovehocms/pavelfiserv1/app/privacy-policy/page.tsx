import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Ochrana osobních údajů',
    description: 'Zásady ochrany osobních údajů'
}

export default function PrivacyPolicy() {
    return (
        <main className="container mx-auto px-4 py-12 max-w-4xl">
            <h1 className="text-3xl font-bold mb-8">Zásady ochrany osobních údajů</h1>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">1. Základní ustanovení</h2>
                <p className="mb-4">
                    Správcem osobních údajů podle čl. 4 bod 7 nařízení Evropského parlamentu a Rady (EU) 2016/679
                    o ochraně fyzických osob v souvislosti se zpracováním osobních údajů (dále jen „GDPR“) je...
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">2. Zpracované osobní údaje</h2>
                <p className="mb-4">
                    Zpracováváme osobní údaje, které nám poskytujete v souvislosti s využíváním našich služeb...
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">3. Účely zpracování</h2>
                <p className="mb-4">
                    Vaše osobní údaje zpracováváme za účelem plnění smlouvy, poskytování služeb a plnění právních povinností...
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">4. Práva subjektů údajů</h2>
                <p className="mb-4">
                    V souladu s GDPR máte právo na přístup, opravu, výmaz, omezení zpracování a přenositelnost svých údajů...
                </p>
            </section>

            <p className="text-sm text-gray-500 mt-8">
                Platnost od: 1.1.2023
            </p>
        </main>
    )
}
