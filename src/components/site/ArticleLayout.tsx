import { Link } from "@tanstack/react-router";
import { PublicLayout } from "@/components/site/PublicLayout";
import { Eyebrow } from "@/components/site/Section";
import { ArrowRightIcon } from "@/components/app/PlaneServeIcons";
import { BLOG_POSTS, getPost } from "@/lib/blog-posts";
import { articleLd, breadcrumbLd, jsonLd } from "@/lib/seo";

export function ArticleSchema({ slug }: { slug: string }) {
  const post = getPost(slug);
  if (!post) return null;
  const path = `/blog/${slug}`;
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd(
          articleLd({
            title: post.title,
            description: post.description,
            path,
            published: post.published,
            modified: post.modified,
          }),
        )}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd(
          breadcrumbLd([
            { name: "Home", path: "/" },
            { name: "Blog", path: "/blog" },
            { name: post.cardTitle, path },
          ]),
        )}
      />
    </>
  );
}

export function RelatedReading({ current }: { current: string }) {
  const others = BLOG_POSTS.filter((p) => p.slug !== current).slice(0, 3);
  return (
    <section className="border-t border-border bg-card">
      <div className="mx-auto max-w-4xl px-6 py-16">
        <h2 className="text-lg font-bold tracking-tight text-foreground">Related reading</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {others.map((p) => (
            <Link
              key={p.slug}
              to={`/blog/${p.slug}` as const}
              className="group rounded-sm border border-border bg-background p-5 transition-colors hover:border-accent/40"
            >
              <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                {p.displayDate}
              </div>
              <div className="mt-2 text-sm font-semibold text-foreground group-hover:text-accent">
                {p.cardTitle}
              </div>
            </Link>
          ))}
        </div>
        <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm font-semibold text-accent">
          <Link to="/aog" className="hover:underline">
            AOG service and 24/7 desk
          </Link>
          <Link to="/parts-sourcing" className="hover:underline">
            Parts sourcing desk
          </Link>
          <Link to="/pricing" className="hover:underline">
            Pricing
          </Link>
        </div>
      </div>
    </section>
  );
}

interface ArticleLayoutProps {
  slug: string;
  eyebrow: string;
  title: string;
  accent?: string;
  intro: React.ReactNode;
  readTime: string;
  audience: string;
  children: React.ReactNode;
}

export function ArticleLayout({
  slug,
  eyebrow,
  title,
  accent,
  intro,
  readTime,
  audience,
  children,
}: ArticleLayoutProps) {
  const post = getPost(slug);
  return (
    <PublicLayout>
      <ArticleSchema slug={slug} />
      <section className="brand-dark bg-[#041c2c] text-white">
        <div className="mx-auto max-w-4xl px-6 py-20 md:py-24">
          <Eyebrow>{eyebrow}</Eyebrow>
          <h1 className="mt-6 text-3xl font-semibold leading-[1.12] tracking-tight md:text-5xl">
            {title}
            {accent && <span className="text-accent"> {accent}</span>}
          </h1>
          <p className="mt-8 max-w-3xl text-base leading-8 text-white/70 md:text-lg">{intro}</p>
          <div className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-white/45">
            <span>Published {post?.displayDate}</span>
            <span>·</span>
            <span>{readTime}</span>
            <span>·</span>
            <span>{audience}</span>
          </div>
        </div>
      </section>

      <article className="bg-background">
        <div className="mx-auto max-w-3xl px-6 py-16 md:py-20">
          {children}

          <div className="mt-14 rounded-sm border border-accent/25 bg-primary/5 p-8">
            <p className="text-sm font-semibold text-foreground">
              Submit an AOG request or pre-enrol your aircraft in five minutes.
            </p>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/aog-request"
                className="inline-flex items-center justify-center gap-2 rounded-sm bg-[#001b2e] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#002845]"
              >
                Submit an AOG request <ArrowRightIcon className="h-4 w-4" />
              </Link>
              <Link
                to="/enrol"
                className="inline-flex items-center justify-center gap-2 rounded-sm border border-border bg-background px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
              >
                Pre-enrol your aircraft
              </Link>
            </div>
          </div>
        </div>
      </article>
      <RelatedReading current={slug} />
    </PublicLayout>
  );
}

export function ArticleSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-12 first:mt-0">
      <h2 className="border-b border-border pb-3 text-xl font-bold tracking-tight text-foreground md:text-2xl">
        {title}
      </h2>
      <div className="mt-5 space-y-4 leading-7 text-foreground/80">{children}</div>
    </section>
  );
}

export function ArticleBullet({ title, body }: { title?: string; body: string }) {
  return (
    <div className="flex gap-3">
      <span className="mt-2.5 h-1.5 w-1.5 flex-none rounded-full bg-accent" />
      <p>
        {title && <strong className="font-semibold text-foreground">{title} </strong>}
        {body}
      </p>
    </div>
  );
}
