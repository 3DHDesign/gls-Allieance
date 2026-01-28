// src/components/NewsEvents.tsx
type Post = {
    id: string;
    category: string;
    date: string;
    title: string;
    excerpt: string;
    image: string;
    href?: string;
  };
  
  const POSTS: Post[] = [
    {
      id: "1",
      category: "RESTAURANTS",
      date: "20.11.2017",
      title: "Pri oportere scribentur eu",
      excerpt:
        "Cu eum alia elit, usu in eius appareat, deleniti sapientem honestatis eos ex. In ius esse ullum vidisse....",
      image:
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=1200&auto=format&fit=crop",
    },
    {
      id: "2",
      category: "SHOPS",
      date: "20.11.2017",
      title: "Duo eius postea suscipit ad",
      excerpt:
        "Cu eum alia elit, usu in eius appareat, deleniti sapientem honestatis eos ex. In ius esse ullum vidisse....",
      image:
        "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1200&auto=format&fit=crop",
    },
    {
      id: "3",
      category: "SHOPS",
      date: "20.11.2017",
      title: "Elitr mandamus cu has",
      excerpt:
        "Cu eum alia elit, usu in eius appareat, deleniti sapientem honestatis eos ex. In ius esse ullum vidisse....",
      image:
        "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1200&auto=format&fit=crop",
    },
    {
      id: "4",
      category: "BARS",
      date: "20.11.2017",
      title: "Id est adhuc ignota delenit",
      excerpt:
        "Cu eum alia elit, usu in eius appareat, deleniti sapientem honestatis eos ex. In ius esse ullum vidisse....",
      image:
        " https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=1200&auto=format&fit=crop",
    },
  ];
  
  export default function NewsEvents() {
    return (
      <section className="py-14">
        <div className="container">
          {/* heading */}
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-[var(--color-muted)]">
              News and Events
            </h2>
            <p className="mt-2 text-[var(--color-muted)]/80">
              Cum doctus civibus efficiantur in imperdiet deterruisset.
            </p>
          </div>
  
          {/* 2-column list */}
          <div className="grid gap-10 md:grid-cols-2">
            {POSTS.map((p) => (
              <article key={p.id} className="grid grid-cols-[120px_1fr] md:grid-cols-[180px_1fr] gap-5 items-start">
                {/* thumb */}
                <a href={p.href || "#"} className="block">
                  <img
                    src={p.image}
                    alt={p.title}
                    className="h-[120px] w-[120px] md:h-[130px] md:w-[180px] object-cover rounded-md shadow-sm"
                    loading="lazy"
                  />
                </a>
  
                {/* text */}
                <div>
                  <div className="text-xs tracking-wide uppercase text-[var(--color-muted)]/70 font-semibold">
                    {p.category} <span className="mx-2">—</span> {p.date}
                  </div>
                  <a
                    href={p.href || "#"}
                    className="mt-1 block text-[var(--color-accent)] text-xl font-semibold hover:underline"
                  >
                    {p.title}
                  </a>
                  <p className="mt-2 text-[var(--color-muted)]">
                    {p.excerpt}
                  </p>
                </div>
              </article>
            ))}
          </div>
  
          {/* CTA */}
          <div className="mt-10 flex justify-end">
            <a href="#" className="btn-accent rounded-full px-6 py-3">
              View all news
            </a>
          </div>
        </div>
      </section>
    );
  }
  