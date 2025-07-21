import { notFound } from "next/navigation"
import { ArrowLeft, Calendar, User, Tag } from "lucide-react"
import { Card, CardContent, CardHeader } from "../../../components/ui/card"
import { Badge } from "../../../components/ui/badge"
import { Button } from "../../../components/ui/button"

// Statické importy pro fallback (pouze na serveru)
import fs from "fs"
import path from "path"

interface Article {
  id: string
  title: string
  content: string
  excerpt: string
  author: string
  publishedAt: string
  category: string
  tags: string[]
  imageUrl?: string
  slug?: string
}

async function getArticle(id: string): Promise<Article | null> {
  try {
    // Získání BASE_URL, v produkci musí být nastavena
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || (process.env.NODE_ENV === "development" ? "http://localhost:3000" : undefined);
    if (!baseUrl) {
      throw new Error("NEXT_PUBLIC_BASE_URL není nastavena. Nastavte ji na https://fiserpavel.cz v prostředí Vercelu.");
    }
    const response = await fetch(
      `${baseUrl}/api/admin/public/articles`,
      {
        cache: "no-store",
      },
    )

    if (!response.ok) {
      throw new Error("Failed to fetch articles")
    }

    const data = await response.json()
    const articles: Article[] = data.articles || data // Podpora pro oba formáty odpovědi
    return articles.find((article) => article.id === id || article.slug === id) || null
  } catch (error) {
    console.error("Error fetching article:", error)

    // Fallback na lokální data (statický import)
    try {
      const articlesPath = path.join(process.cwd(), "data", "articles.json")

      if (fs.existsSync(articlesPath)) {
        const articlesData = fs.readFileSync(articlesPath, "utf8")
        const articles: Article[] = JSON.parse(articlesData)
        return articles.find((article) => article.id === id || article.slug === id) || null
      }
    } catch (fallbackError) {
      console.error("Error loading fallback data:", fallbackError)
    }

    return null
  }
}
