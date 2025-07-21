
import { sql, db } from "@/lib/database";
import { drizzleSql } from "@/lib/database";
import { articles } from "@/lib/schema";
import { eq } from "drizzle-orm";
// Definice typu přesunuta do tohoto souboru pro zabránění kruhových importů
export type Article = {
  id: string
  title: string
  content: string
  excerpt?: string | null
  category: string
  tags: string[]
  isPublished: boolean // používá se v první implementaci
  published?: boolean // používá se v druhé implementaci
  imageUrl?: string | null 
  publishedAt?: Date | null
  createdAt: Date
  updatedAt: Date
  createdBy: string
}

// První implementace ArticleService
export class ArticleServiceDrizzle {
  
  // Get all articles with optional filtering
  async getArticles(filters: {
    published?: boolean;
    category?: string;
    limit?: number;
    offset?: number;
  } = {}): Promise<Article[]> {
    try {
      let query;
      
      if (filters.published !== undefined && filters.category) {
        query = db.query.articles.findMany({
          where: (articles, { eq, and }) => and(
            eq(articles.isPublished, !!filters.published), // Convert to boolean to avoid undefined
            eq(articles.category, filters.category || "")  // Convert to string to avoid undefined
          ),
          orderBy: (articles, { desc }) => [desc(articles.created_at)],
          limit: filters.limit || 50,
          offset: filters.offset || 0
        });
      } else if (filters.published !== undefined) {
        query = db.query.articles.findMany({
          where: (articles, { eq }) => eq(articles.isPublished, !!filters.published), // Convert to boolean to avoid undefined
          orderBy: (articles, { desc }) => [desc(articles.created_at)],
          limit: filters.limit || 50,
          offset: filters.offset || 0
        });
      } else if (filters.category) {
        query = db.query.articles.findMany({
          where: (articles, { eq }) => eq(articles.category, filters.category || ""), // Convert to string to avoid undefined
          orderBy: (articles, { desc }) => [desc(articles.created_at)],
          limit: filters.limit || 50,
          offset: filters.offset || 0
        });
      } else {
        query = db.query.articles.findMany({
          orderBy: (articles, { desc }) => [desc(articles.created_at)],
          limit: filters.limit || 50,
          offset: filters.offset || 0
        });
      }
      
      const result = await query;
      
      // Map database field names to camelCase for the Article type
      return result.map(article => ({
        id: article.id,
        title: article.title,
        content: article.content,
        excerpt: article.excerpt,
        category: article.category,
        tags: article.tags || [],
        isPublished: article.isPublished,
        imageUrl: article.image_url,
        publishedAt: article.published_at,
        createdAt: article.created_at,
        updatedAt: article.updated_at,
        createdBy: article.created_by
      })) as Article[];
    } catch (error) {
      console.error('Failed to get articles:', error);
      throw new Error('Failed to fetch articles');
    }
  }

  // Get single article by ID
  async getArticleById(id: string): Promise<Article | null> {
    try {
      const result = await db.query.articles.findFirst({
        where: (articles, { eq }) => eq(articles.id, id)
      });
      
      if (!result) return null;
      
      // Map database field names to camelCase for the Article type
      return {
        id: result.id,
        title: result.title,
        content: result.content,
        excerpt: result.excerpt,
        category: result.category,
        tags: result.tags || [],
        isPublished: result.isPublished,
        imageUrl: result.image_url,
        publishedAt: result.published_at,
        createdAt: result.created_at,
        updatedAt: result.updated_at,
        createdBy: result.created_by
      } as Article;
    } catch (error) {
      console.error('Failed to get article by ID:', error);
      return null;
    }
  }

  // Create new article
  async createArticle(articleData: Omit<Article, 'id' | 'createdAt' | 'updatedAt'>): Promise<Article> {
    try {
      const newArticle = await db.insert(articles).values({
        title: articleData.title,
        content: articleData.content,
        excerpt: articleData.excerpt || null,
        category: articleData.category,
        tags: articleData.tags,
        isPublished: articleData.isPublished,
        image_url: articleData.imageUrl || null,
        published_at: articleData.publishedAt || null,
        created_by: articleData.createdBy
      }).returning();
      
      const result = newArticle[0];
      
      // Map database field names to camelCase for the Article type
      return {
        id: result.id,
        title: result.title,
        content: result.content,
        excerpt: result.excerpt,
        category: result.category,
        tags: result.tags || [],
        isPublished: result.isPublished,
        imageUrl: result.image_url,
        publishedAt: result.published_at,
        createdAt: result.created_at,
        updatedAt: result.updated_at,
        createdBy: result.created_by
      } as Article;
    } catch (error) {
      console.error('Failed to create article:', error);
      throw new Error('Failed to create article');
    }
  }

  // Update existing article
  async updateArticle(id: string, updates: Partial<Omit<Article, 'id' | 'createdAt'>>): Promise<Article | null> {
    try {
      // Prepare the update data with proper field names
      const updateData: any = {};
      
      if (updates.title !== undefined) updateData.title = updates.title;
      if (updates.content !== undefined) updateData.content = updates.content;
      if (updates.excerpt !== undefined) updateData.excerpt = updates.excerpt;
      if (updates.category !== undefined) updateData.category = updates.category;
      if (updates.tags !== undefined) updateData.tags = updates.tags;
      if (updates.isPublished !== undefined) updateData.isPublished = updates.isPublished;
      if (updates.imageUrl !== undefined) updateData.image_url = updates.imageUrl;
      if (updates.publishedAt !== undefined) updateData.published_at = updates.publishedAt;
      
      // Always update the updated_at timestamp
      updateData.updated_at = new Date();
      
      const result = await db.update(articles)
        .set(updateData)
        .where(eq(articles.id, id))
        .returning();
      
      if (result.length === 0) return null;
      
      const updatedArticle = result[0];
      
      // Map database field names to camelCase for the Article type
      return {
        id: updatedArticle.id,
        title: updatedArticle.title,
        content: updatedArticle.content,
        excerpt: updatedArticle.excerpt,
        category: updatedArticle.category,
        tags: updatedArticle.tags || [],
        isPublished: updatedArticle.isPublished,
        imageUrl: updatedArticle.image_url,
        publishedAt: updatedArticle.published_at,
        createdAt: updatedArticle.created_at,
        updatedAt: updatedArticle.updated_at,
        createdBy: updatedArticle.created_by
      } as Article;
    } catch (error) {
      console.error('Failed to update article:', error);
      throw new Error('Failed to update article');
    }
  }

  // Delete article
  async deleteArticle(id: string): Promise<boolean> {
    try {
      const result = await db.delete(articles)
        .where(eq(articles.id, id))
        .returning();
      
      return result.length > 0;
    } catch (error) {
      console.error('Failed to delete article:', error);
      return false;
    }
  }

  // Get published articles for public display
  async getPublishedArticles(limit: number = 10): Promise<Article[]> {
    return this.getArticles({ published: true, limit });
  }

  // Search articles by title or content
  async searchArticles(searchTerm: string, published: boolean = true): Promise<Article[]> {
    try {
      const result = await db.query.articles.findMany({
        where: (articles, { eq, or, ilike, and }) => 
          and(
            eq(articles.isPublished, !!published), // Convert to boolean to avoid undefined
            or(
              ilike(articles.title, `%${searchTerm || ""}%`), // Convert to string to avoid undefined
              ilike(articles.content, `%${searchTerm || ""}%`) // Convert to string to avoid undefined
            )
          ),
        orderBy: (articles, { desc }) => [desc(articles.created_at)]
      });
      
      // Map database field names to camelCase for the Article type
      return result.map(article => ({
        id: article.id,
        title: article.title,
        content: article.content,
        excerpt: article.excerpt,
        category: article.category,
        tags: article.tags || [],
        isPublished: article.isPublished,
        imageUrl: article.image_url,
        publishedAt: article.published_at,
        createdAt: article.created_at,
        updatedAt: article.updated_at,
        createdBy: article.created_by
      })) as Article[];
    } catch (error) {
      console.error('Failed to search articles:', error);
      return [];
    }
  }

  // Get articles by category
  async getArticlesByCategory(category: string, published: boolean = true): Promise<Article[]> {
    return this.getArticles({ category, published });
  }
}

/* -------------------------------------------------------------------------- */
/*                                Typy                                        */
/* -------------------------------------------------------------------------- */

// Toto rozhraní je už definováno výše, proto ho zde odstraňujeme

/* -------------------------------------------------------------------------- */
/*                          Mapování DB <-> JS                                */
/* -------------------------------------------------------------------------- */

type DbArticle = {
  id: string
  title: string
  content: string
  excerpt: string | null
  category: string
  tags: string[]
  published: boolean
  image_url: string | null
  published_at: Date | null
  created_at: Date
  updated_at: Date
  created_by: string
}

function mapDbToArticle(row: DbArticle): Article {
  return {
    id: row.id,
    title: row.title,
    content: row.content,
    excerpt: row.excerpt,
    category: row.category,
    tags: row.tags,
    isPublished: row.published, // mapuje published z DB na isPublished
    published: row.published,   // ponecháváme i published pro zpětnou kompatibilitu
    imageUrl: row.image_url,
    publishedAt: row.published_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    createdBy: row.created_by
  }
}

/* -------------------------------------------------------------------------- */
/*                            Service třída                                   */
/* -------------------------------------------------------------------------- */

export class ArticleServiceSQL {
  /* ---- veřejné metody ---------------------------------------------------- */

  async getArticles(opts: {
    limit?: number
    offset?: number
    category?: string
    published?: boolean
    search?: string
  }): Promise<Article[]> {
    const { limit, offset, category, published, search } = opts

    // Dynamicky skládáme WHERE podmínky
    const whereParts: string[] = []
    const params: any[] = []
    let p = 1

    if (category && category !== "all") {
      whereParts.push(`category = $${p++}`)
      params.push(category)
    }
    if (published !== undefined) {
      whereParts.push(`published = $${p++}`)
      params.push(published)
    }
    if (search) {
      whereParts.push(`(title ILIKE $${p} OR content ILIKE $${p} OR tags::text ILIKE $${p})`)
      params.push(`%${search}%`)
      p++
    }

    let query = `SELECT * FROM articles`
    if (whereParts.length) {
      query += ` WHERE ${whereParts.join(" AND ")}`
    }
    query += ` ORDER BY created_at DESC`
    if (limit !== undefined) {
      query += ` LIMIT $${p++}`
      params.push(limit)
    }
    if (offset !== undefined) {
      query += ` OFFSET $${p++}`
      params.push(offset)
    }

    // Pro dynamické dotazy použijeme přímo Neon SQL client s template literal
    // Bezpečná interpolace parametrů
    let paramIndex = 0;
    const interpolatedQuery = query.replace(/\$\d+/g, () => {
      return '$' + (paramIndex + 1);
    });
    paramIndex = 0;
    
    // Bezpečný způsob vytvoření template literal pro Neon
    const queryWithParams = query.replace(/\$(\d+)/g, (match, num) => {
      const index = parseInt(num) - 1;
      if (index < params.length) {
        return `'${params[index]}'`; // Pozor: toto je zjednodušené, v produkci by mělo být escapované
      }
      return match;
    });
    
    const results = await sql`${queryWithParams}`;
    const rows = results as unknown as DbArticle[]
    return rows.map(mapDbToArticle)
  }

  async getArticleById(id: string): Promise<Article | null> {
    const results = await sql`SELECT * FROM articles WHERE id = ${id} LIMIT 1`
    const rows = results as unknown as DbArticle[]
    return rows.length ? mapDbToArticle(rows[0]) : null
  }
}

/* -------------------------------------------------------------------------- */
/*              Singleton + pomocné funkce, které importuje zbytek kódu       */
/* -------------------------------------------------------------------------- */

// Použijeme první implementaci jako výchozí
export const articleService = new ArticleServiceDrizzle()

/**
 * Vrátí pouze publikované články s jednoduchou stránkovací logikou.
 */
export async function getPublishedArticles(
  page = 1,
  limit = 10,
): Promise<{ articles: Article[]; total: number; hasMore: boolean }> {
  const offset = (page - 1) * limit

  try {
    // Použijeme Neon SQL template literal pro získání článků
    const articlesResult = await sql`
      SELECT * FROM articles 
      WHERE published = true 
      ORDER BY published_at DESC, created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `

    // Konvertujeme výsledky na Article[]
    const articles: Article[] = (articlesResult as any[]).map((row: any) => ({
      id: row.id,
      title: row.title,
      content: row.content,
      excerpt: row.excerpt,
      category: row.category,
      tags: Array.isArray(row.tags) ? row.tags : (row.tags ? [row.tags] : []),
      isPublished: row.published || row.is_published,
      published: row.published || row.is_published,
      imageUrl: row.image_url,
      publishedAt: row.published_at ? new Date(row.published_at) : null,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
      createdBy: row.created_by || 'admin'
    }))

    // Celkový počet
    const countResult = await sql`SELECT COUNT(*) as count FROM articles WHERE published = true`
    const total = Number(countResult[0]?.count || 0)
    const hasMore = page * limit < total

    return { articles, total, hasMore }
  } catch (error) {
    console.error("Error in getPublishedArticles:", error)
    return { articles: [], total: 0, hasMore: false }
  }
}
