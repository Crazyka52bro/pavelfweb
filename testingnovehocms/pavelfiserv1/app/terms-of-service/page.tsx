import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Obchodní podmínky',
    description: 'Všeobecné obchodní podmínky'
}

export default function TermsOfService() {
    return (
        <main className="container mx-auto px-4 py-12 max-w-4xl">
            <h1 className="text-3xl font-bold mb-8">Všeobecné obchodní podmínky</h1>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">1. Úvodní ustanovení</h2>
                <p className="mb-4">
                    Tyto Všeobecné obchodní podmínky (dále jen „VOP“) upravují vzájemná práva a povinnosti mezi námi a zákazníky...
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">2. Uzavření smlouvy</h2>
                <p className="mb-4">
                    Smlouva je uzavřena okamžikem přijetí objednávky naší stranou...
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">3. Ceny a platba</h2>
                <p className="mb-4">
                    Ceny jsou uvedeny včetně DPH. Platbu lze provést bankovním převodem nebo platební kartou...
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">4. Reklamační řád</h2>
                <p className="mb-4">
                    V případě vadného plnění má zákazník právo na reklamaci do 24 měsíců od převzetí...
                </p>
            </section>

            <p className="text-sm text-gray-500 mt-8">
                Platnost od: 1.1.2023
            </p>
        </main>
    )
}
