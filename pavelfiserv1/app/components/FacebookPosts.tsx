interface FacebookPost {
  id: string
  message?: string
  story?: string
  created_time: string
  permalink_url: string
}

const FacebookPosts = ({ posts }: { posts?: FacebookPost[] }) => (
  <section className="py-12 bg-gray-50">
    <div className="container mx-auto px-4">
      <h2 className="text-3xl font-bold mb-8 text-center">Aktuality z Facebooku</h2>
      {!posts || posts.length === 0 ? (
        <p className="text-center">Žádné příspěvky k zobrazení</p>
      ) : (
        <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <li key={post.id} className="bg-white p-6 rounded-lg shadow">
              <p><strong>Datum:</strong> {new Date(post.created_time).toLocaleString()}</p>
              {post.message
                ? <p><strong>Zpráva:</strong> {post.message}</p>
                : post.story && <p><strong>Příběh:</strong> {post.story}</p>}
              {post.permalink_url ? (
                <a
                  href={`https://facebook.com${post.permalink_url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Celý příspěvek
                </a>
              ) : (
                <span className="text-gray-500">Odkaz není k dispozici</span>
              )}
              <div className="hidden">{JSON.stringify(post)}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  </section>
)

export default FacebookPosts
