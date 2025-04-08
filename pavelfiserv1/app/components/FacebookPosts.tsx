"use client"
import { useEffect, useState } from "react"

interface FacebookPost {
  id: string
  message: string
  created_time: string
  permalink_url: string
}

export default function FacebookPosts() {
  const [posts, setPosts] = useState<FacebookPost[]>([])

  useEffect(() => {
    // TODO: Implement Facebook API connection
    // This will fetch posts from Facebook page
    async function fetchPosts() {
      try {
        // Temporary mock data
        setPosts([
          {
            id: "1",
            message: "Ukázkový příspěvek z Facebooku",
            created_time: "2023-11-15T10:00:00+0000",
            permalink_url: "#"
          }
        ])
      } catch (error) {
        console.error("Error fetching Facebook posts:", error)
      }
    }

    fetchPosts()
  }, [])

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-center">Aktuality z Facebooku</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <div key={post.id} className="bg-white p-6 rounded-lg shadow">
              <p className="text-gray-600 mb-2">
                {new Date(post.created_time).toLocaleDateString()}
              </p>
              <p className="mb-4">{post.message}</p>
              <a
                href={post.permalink_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Celý příspěvek
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
