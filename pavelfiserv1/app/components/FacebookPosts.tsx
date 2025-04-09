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
    async function fetchPosts() {
      try {
        const response = await fetch(
          `https://graph.facebook.com/v19.0/61574874071299/posts?fields=message,created_time,permalink_url,full_picture&access_token=EAAWPfMaYnp4BO8RqcwZCy3rXXyBU3tULzkIMEPcYZAkkvxXrkw8gzBZAHd8QZBwNZBanf4ZCgh2fhiV9vYNx4pQ46XdByHwyNltXK4EsPlphqWAZBEj18jmdYZADibYSfoOgNF6QmOLIG78VEoYICdL1zTOCAKbhqbm1fkx0es3XNXYHDyTxKUUQUJNe`
        )
        const data = await response.json()
        setPosts(data.data || [])
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
