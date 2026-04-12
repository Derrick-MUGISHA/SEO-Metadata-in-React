import ClapButton from "@/app/components/ClapButton";
import { delay } from "@/lib/utils";
import { BlogPost, BlogPostsResponse } from "@/models/BlogPost";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Script from "next/script";

interface BlogPostPageProps {
  params: { postId: string };
}

export async function generateStaticParams() {
  const response = await fetch("https://dummyjson.com/posts");
  const { posts }: BlogPostsResponse = await response.json();

  return posts.map(({ id }) => ({ postId: id.toString() }));
}

/**
 * generateMetadata is a native Next.js API that runs on the server before the page is rendered.
 * It dynamically fetches the post data and injects the proper <head> tags into the DOM.
 * This is crucial for SEO because it ensures that web crawlers (like Googlebot) and social media 
 * scrapers (like Twitter/Facebook) see the correct title, description, and OpenGraph tags 
 * before any JavaScript executes on the client.
 */
export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { postId } = params;
  const response = await fetch(`https://dummyjson.com/posts/${postId}`);
  const post: BlogPost = await response.json();
  const url = `${process.env.NEXT_PUBLIC_BASE_URL}/posts/${postId}`;

  /**
   * We return a Metadata object.
   * - alternates.canonical: Prevents duplicate content penalties if this page is reached via different URLs.
   * - openGraph: Creates rich snippets when shared on platforms like LinkedIn, Facebook, or iMessage.
   * - twitter: Specifically formats the card for Twitter integrations.
   */
  return {
    title: post.title,
    description: post.body.substring(0, 160),
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.body.substring(0, 160),
      url,
      authors: ["Derrick"],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.body.substring(0, 160),
    },
  };
}

export default async function BlogPostPage({
  params,
}: BlogPostPageProps) {
  const { postId } = params;
  const response = await fetch(`https://dummyjson.com/posts/${postId}`);
  
  if (response.status === 404) {
    notFound();
  }

  const { title, body }: BlogPost = await response.json();
  const url = `${process.env.NEXT_PUBLIC_BASE_URL}/posts/${postId}`;

  /**
   * JSON-LD (JavaScript Object Notation for Linked Data) 
   * This is structured data that tells search engines exactly what this page is about.
   * Using "@type": "BlogPosting" allows Google to surface this article in "Rich Results" 
   * (like the top stories carousel) with the headline and author name explicitly mapped out.
   */
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description: body.substring(0, 160),
    author: [
      {
        "@type": "Person",
        "name": "Derrick",
        "url": process.env.NEXT_PUBLIC_BASE_URL,
      },
    ],
    url: url,
  };

  await delay(1000);

  return (
    <>
      {/* 
        We use next/script to safely inject the JSON-LD string into the DOM.
        dangerouslySetInnerHTML is required because JSON-LD must be raw text inside the script tag.
      */}
      <Script
        id="json-ld-article"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <article className="max-w-prose m-auto space-y-5">
        <h1 className="text-3xl text-center font-bold">{title}</h1>
        <p className="text-lg">{body}</p>
        <ClapButton />
      </article>
    </>
  );
}