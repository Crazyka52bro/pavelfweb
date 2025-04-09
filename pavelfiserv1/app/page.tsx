import React from "react";
import Hero from "./components/Hero";
import Introduction from "./components/WearYourStory";
import Priorities from "./components/Services";
import AboutMe from "./components/AboutUs";
import Timeline from "./components/Timeline";
import Projects from "./components/Projects";
import Testimonials from "./components/Testimonials";
import Marquee from "./components/Marquee";
import ContactForm from "./components/ContactForm";
import NewsletterSubscribe from "./components/NewsletterSubscribe";

interface FacebookPost {
  id: string;
  message?: string;
  story?: string;
  created_time: string;
  permalink_url: string;
}

const Page = async () => {
  let posts: FacebookPost[] = [];
  let error = null;

  try {
    const url = `https://graph.facebook.com/640847772437096/posts?access_token=${process.env.NEXT_PUBLIC_FACEBOOK_ACCESS_TOKEN}`;
    console.log("Fetching Facebook posts from:", url);

    const res = await fetch(url);

    if (!res.ok) {
      const errorData = await res.text();
      throw new Error(`Facebook API request failed with status ${res.status}: ${errorData}`);
    }

    const data = await res.json();
    console.log("Facebook API response:", data);
    posts = data.data || [];
  } catch (err) {
    console.error("Error fetching Facebook posts:", err);
    error = "Nepodařilo se načíst příspěvky z Facebooku";
  }

  return (
    <>
      <Hero />
      <Introduction />
      <Priorities />
      <AboutMe />
      <Projects />
      <Timeline />
      <Testimonials />
      <Marquee />

      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">
            Aktuality z Facebooku
          </h2>
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <li key={post.id} className="bg-white p-6 rounded-lg shadow">
                <p>
                  <strong>Datum:</strong>{" "}
                  {new Date(post.created_time).toLocaleString()}
                </p>
                {post.message ? (
                  <p>
                    <strong>Zpráva:</strong> {post.message}
                  </p>
                ) : (
                  <p>
                    <strong>Příběh:</strong> {post.story}
                  </p>
                )}
                <a
                  href={post.permalink_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Celý příspěvek
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <ContactForm />
      <NewsletterSubscribe />
    </>
  );
};

export default Page;
