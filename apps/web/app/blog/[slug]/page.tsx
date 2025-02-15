"use client";

import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";
import ReactMarkdown from "react-markdown";
import { notFound } from "next/navigation";
import Link from "next/link";
import { useParams } from "next/navigation";

const getPostContent = async (slug: string) => {
  const filePath = path.join(process.cwd(), "content", `${slug}.md`);
  try {
    const fileContent = await fs.readFile(filePath, "utf8");
    return matter(fileContent);
  } catch {
    return null;
  }
};

export default async function BlogPostPage() {
  const params = useParams();
  const slug =  params.slug as string;
  const post = await getPostContent(slug);

  if (!post) {
    notFound();
  }

  const { data, content } = post;
  const title = data.title || slug;
  const date = data.date ? new Date(data.date).toLocaleDateString() : "";

  return (
    <main className="p-4 w-full lg:max-w-4xl mx-auto mt-16">
      <Link href="/blog" className="text-blue-500 hover:underline">
        &larr; ブログ一覧に戻る
      </Link>
      <article className="mt-4 w-full">
        <h1 className="text-5xl font-semibold mb-2">{title}</h1>
        {date && <p className="text-sm text-muted-foreground">{date}</p>}
        <br />
        <ReactMarkdown className="prose dark:prose-invert max-w-none w-full">
          {content}
        </ReactMarkdown>
      </article>{" "}
    </main>
  );
}
