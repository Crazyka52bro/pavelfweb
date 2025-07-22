import { notFound } from "next/navigation"
import { ArrowLeft, Calendar, User, Tag } from "lucide-react"
import { Card, CardContent, CardHeader } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { Button } from "../../components/ui/button"
import Link from "next/link"

// Vynutit dynamické vykreslování pro fetch operace
export const dynamic = 'force-dynamic'
export const revalidate = 0

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

async function getArticles(): Promise<Article[]> {
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
    return articles.filter(article => article.publishedAt) // Jen publikované články
  } catch (error) {
    console.error("Error fetching articles:", error)

    // Fallback na lokální data (statický import)
    try {
      const articlesPath = path.join(process.cwd(), "data", "articles.json")

      if (fs.existsSync(articlesPath)) {
        const articlesData = fs.readFileSync(articlesPath, "utf8")
        const articles: Article[] = JSON.parse(articlesData)
        return articles.filter(article => article.publishedAt) // Jen publikované články
      }
    } catch (fallbackError) {
      console.error("Error loading fallback data:", fallbackError)
    }

    return []
  }
}

export default async function AktualityPage() {
  const articles = await getArticles()

  return (
    <div className="min-h-screen bg-slate-900 text-gray-100">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Aktuality</h1>
          <p className="text-gray-400 text-lg">
            Nejnovější zprávy a informace z dění v Praze 4
          </p>
        </div>

        {/* Articles grid */}
        {articles.length === 0 ? (
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-8 text-center">
              <p className="text-gray-400">Momentálně nejsou k dispozici žádné články.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <Card key={article.id} className="bg-slate-800 border-slate-700 hover:border-slate-600 transition-colors">
                <CardHeader>
                  <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                    <Calendar className="w-4 h-4" />
                    {new Date(article.publishedAt).toLocaleDateString('cs-CZ')}
                  </div>
                  <h2 className="text-xl font-semibold mb-2 line-clamp-2">{article.title}</h2>
                  {article.excerpt && (
                    <p className="text-gray-400 text-sm line-clamp-3">{article.excerpt}</p>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-400">{article.author}</span>
                    </div>
                    <Badge variant="secondary" className="bg-slate-700 text-gray-300">
                      {article.category}
                    </Badge>
                  </div>
                  {article.tags && article.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-3">
                      {article.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs border-slate-600 text-gray-400">
                          {tag}
                        </Badge>
                      ))}
                      {article.tags.length > 3 && (
                        <Badge variant="outline" className="text-xs border-slate-600 text-gray-400">
                          +{article.tags.length - 3}
                        </Badge>
                      )}
                    </div>
                  )}
                  <Button asChild className="w-full mt-4">
                    <Link href={`/aktuality/${article.slug || article.id}`}>
                      Číst více
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Back to home */}
        <div className="mt-12 text-center">
          <Button variant="outline" asChild>
            <Link href="/" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Zpět na hlavní stránku
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
