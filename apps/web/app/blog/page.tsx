import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";
import Link from "next/link";
import { Badge } from "@workspace/ui/components/badge";

interface PostMeta {
  title: string;
  date?: string;
  [key: string]: any;
}

interface Post {
  slug: string;
  meta: PostMeta;
}

const getPosts = async (): Promise<Post[]> => {
  const contentDir = path.join(process.cwd(), "content");
  const files = await fs.readdir(contentDir);
  const posts: Post[] = await Promise.all(
    files
      .filter((file) => file.endsWith(".md"))
      .map(async (file) => {
        const filePath = path.join(contentDir, file);
        const fileContent = await fs.readFile(filePath, "utf8");
        const { data } = matter(fileContent);
        return {
          slug: file.replace(/\.md$/, ""),
          meta: data as PostMeta,
        };
      })
  );
  // Sort posts by date descending (if dates are provided)
  posts.sort(
    (a, b) =>
      new Date(b.meta.date || "").getTime() -
      new Date(a.meta.date || "").getTime()
  );
  return posts;
};

export default async function BlogListPage() {
  const posts = await getPosts();

  return (
    <main className="p-8 w-full md:w-3/4 mx-auto">
      <h1 className="text-4xl font-bold mb-8 mt-16 text-center">ブログ一覧</h1>
      <ul className="flex flex-wrap justify-center gap-4">
        {posts.map((post) => (
          <li
            key={post.slug}
            className="mb-4 bg-sidebar p-4 w-full md:w-3/8 rounded-lg shadow-md"
          >
            <Link
              className="text-2xl hover:underline font-semibold"
              href={`/blog/${post.slug}`}
            >
              {post.meta.title || post.slug}
            </Link>
            {post.meta.date && (
              <p className="text-sm text-muted-foreground">
                {new Date(post.meta.date).toLocaleDateString()}
              </p>
            )}
            <p className="text-sm text-muted-foreground">
              {post.meta.description}
            </p>
            {(post.meta.tags as string[]).map((tag: string) => (
              <Badge key={tag} className="mr-2">
                {tag}
              </Badge>
            ))}
          </li>
        ))}{" "}
      </ul>
    </main>
  );
}
