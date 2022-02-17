import { useLoaderData } from "remix";
import { getPosts, Post } from "~/post";

export const loader = async () => {
  return getPosts();
};

export default function Posts() {
  const posts = useLoaderData<Post[]>();

  return (
    <div>
      <h1>Posts</h1>
      <ul>
        {posts.map((post) => (
          <li key={post.slug}>{post.title}</li>
        ))}
      </ul>
    </div>
  );
}
