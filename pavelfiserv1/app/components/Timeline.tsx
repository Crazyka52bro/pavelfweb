"use client"

import { useState, useRef } from "react"
import { motion, useScroll, useSpring, useInView } from "framer-motion"

const timelineEvents = [
  {
    year: 2018,
    title: "Vstup do komunální politiky",
    description: "Začátek mého působení v komunální politice v Praze 4.",
    details:
      "Rozhodl jsem se aktivně zapojit do dění v naší městské části a přispět svými zkušenostmi k jejímu rozvoji.",
  },
  {
    year: 2019,
    title: "První projekty pro rodiny",
    description: "Iniciace projektů zaměřených na podporu rodin s dětmi v Praze 4.",
    details:
      "Podařilo se nám zahájit několik projektů zaměřených na zlepšení podmínek pro rodiny s dětmi, včetně renovace dětských hřišť a rozšíření kapacity mateřských škol.",
  },
  {
    year: 2020,
    title: "Krizové řízení během pandemie",
    description: "Aktivní zapojení do krizového řízení během pandemie COVID-19.",
    details:
      "Koordinoval jsem pomoc seniorům a ohroženým skupinám obyvatel během pandemie, včetně distribuce ochranných pomůcek a zajištění nákupů základních potřeb.",
  },
  {
    year: 2021,
    title: "Projekty pro seniory",
    description: "Zahájení programů pro aktivní stárnutí a podporu seniorů.",
    details:
      "Podařilo se nám spustit několik programů zaměřených na aktivní stárnutí, včetně vzdělávacích kurzů, sportovních aktivit a kulturních akcí pro seniory.",
  },
  {
    year: 2022,
    title: "Zvolení zastupitelem",
    description: "Zvolení do zastupitelstva MČ Praha 4.",
    details:
      "Díky důvěře občanů jsem byl zvolen zastupitelem MČ Praha 4, což mi umožnilo ještě aktivněji prosazovat zájmy obyvatel naší městské části.",
  },
  {
    year: 2023,
    title: "Bezpečnostní iniciativy",
    description: "Zahájení projektů pro zvýšení bezpečnosti v rezidenčních zónách.",
    details:
      "Inicioval jsem projekty zaměřené na zvýšení bezpečnosti v rezidenčních zónách, včetně zlepšení osvětlení, instalace bezpečnostních kamer a spolupráce s městskou policií.",
  },
]


export default function Timeline() {
  const [expandedEvent, setExpandedEvent] = useState<number | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  })

  return (
    <section ref={containerRef} className="py-20 bg-background overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl font-bold text-foreground sm:text-4xl">Milníky</h2>
          <p className="mt-4 text-lg text-muted-foreground">Vývoj projektů a milníků v průběhu let</p>
        </motion.div>

        <div className="relative">
          {/* Vertical line */}
          <motion.div
            className="absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-primary/20"
            style={{ scaleY: scaleX }}
          />

          

          {timelineEvents.map((event, index) => (
            <TimelineEvent
              key={event.year}
              event={event}
              index={index}
              isExpanded={expandedEvent === index}
              onToggle={() => setExpandedEvent(expandedEvent === index ? null : index)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

function TimelineEvent({
  event,
  index,
  isExpanded,
  onToggle,
}: {
  event: (typeof timelineEvents)[0]
  index: number
  isExpanded: boolean
  onToggle: () => void
}) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.5 })

  return (
    <motion.div
      ref={ref}
      className={`mb-8 flex justify-between items-center w-full ${index % 2 === 0 ? "flex-row-reverse" : ""}`}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.8, delay: index * 0.1 }}
    >
      <div className="w-5/12" />
      <div className="z-20">
        <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-full">
          <div className="w-3 h-3 bg-background rounded-full" />
        </div>
      </div>
      <motion.div
        className="w-5/12 cursor-pointer"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onToggle}
      >
        <div className="p-4 bg-background rounded-lg shadow-md border border-primary/10">
          <span className="font-bold text-primary">{event.year}</span>
          <h3 className="text-lg font-semibold mb-1">{event.title}</h3>
          <p className="text-muted-foreground">{event.description}</p>
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: isExpanded ? "auto" : 0, opacity: isExpanded ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <p className="mt-2 text-sm text-muted-foreground">{event.details}</p>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  )
}

