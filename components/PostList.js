import Link from "next/link";

export default function PostList({ posts }) {
  if (posts === "undefined") return null;

  return (
    <div>
      {!posts && <div>No posts!</div>}
      <ul>
        {posts &&
          posts.map(post => {
            return (
              <li key={post.slug}>
                {post.frontmatter.date}: {` `}
                <Link href="/post/[pid]" as={`/post/${post.slug}`}>
                  {post?.frontmatter?.title}
                </Link>
              </li>
            );
          })}
      </ul>
    </div>
  );
}
