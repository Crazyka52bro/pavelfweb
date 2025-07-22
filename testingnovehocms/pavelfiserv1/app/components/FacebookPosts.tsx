import { useEffect, useState } from "react";

interface FacebookPost {
  id: string
  message?: string
  story?: string
  created_time: string
  permalink_url?: string
}

const FacebookPosts = () => {
  const [posts, setPosts] = useState<FacebookPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch("/api/facebook-posts")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        setPosts(data.data || []);
        setLoading(false);
      })
      .catch((err) => {
        setError(`Failed to load Facebook posts: ${err.message}`);
        setLoading(false);
      });
  }, []);

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-center">Aktuality z Facebooku</h2>
        {loading ? (
          <p className="text-center">Načítání…</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : !posts || posts.length === 0 ? (
          <p className="text-center">Žádné příspěvky k zobrazení</p>
        ) : (
          <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <li key={post.id} className="bg-white p-6 rounded-lg shadow">
                <p className="text-black"><strong>Datum:</strong> {new Date(post.created_time).toLocaleString('cs-CZ')}</p>
                {(post.message || post.story) && (
                  <p className="text-black">
                    <strong>Zpráva/Příběh:</strong> {post.message || post.story}
                  </p>
                )}
                {post.permalink_url ? (
                  <a
                    href={post.permalink_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    Celý příspěvek
                  </a>
                ) : (
                  <span className="text-gray-500">Odkaz není k dispozici</span>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

export default FacebookPosts // Pokud není používán, zakomentujte nebo odstraňte export
