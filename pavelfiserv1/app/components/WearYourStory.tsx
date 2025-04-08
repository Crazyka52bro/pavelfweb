"use client"

import { motion } from "framer-motion"

export default function Introduction() {
  return (
    <section className="bg-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-blue-700 mb-6">Vítejte</h2>
          <p className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto mb-6">
            Vítám vás na oficiálních stránkách Bc. Pavla Fišera, zastupitele MČ
            Praha 4 a manažera, který se s vášní věnuje zlepšování kvality
            života v naší komunitě.
          </p>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
            Jako otec čtyř dětí dobře rozumím výzvám, kterým čelí rodiny, senioři i další obyvatelům 
            Prahy 4. Zaměřuji se na praktická a udržitelná řešení, která odpovídají skutečným
            potřebám komunity a pomáhají zlepšovat kvalitu života v naší městské části.
          </p>
          <div className="quote max-w-2xl mx-auto text-gray-600 ">
            &quot;Mým cílem je vytvořit z Prahy 4 místo, kde se všichni obyvatelé cítí
            bezpečně, kde mají děti prostor pro zdravý rozvoj a kde senioři mohou
            důstojně a aktivně trávit svůj čas. &quot;
          </div>
          <motion.div
            className="mt-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <a href="#about" className="apple-button inline-flex items-center">
              Více o mně
              <svg
                className="w-5 h-5 ml-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

