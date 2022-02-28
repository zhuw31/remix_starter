import {
  ActionFunction,
  Form,
  LoaderFunction,
  redirect,
  useActionData,
  useLoaderData,
  useTransition,
} from "remix";
import invariant from "tiny-invariant";
import { createPost, getPostWithBody, PostContent } from "~/post";

export const loader: LoaderFunction = async ({ request }) => {
  const slug = new URL(request.url).searchParams.get("slug");
  invariant(slug, "expected slug");
  return getPostWithBody(slug);
};

type PostError = {
  title?: boolean;
  slug?: boolean;
  markdown?: boolean;
};

export const action: ActionFunction = async ({ request }) => {
  await new Promise((res) => setTimeout(res, 1000));
  const formData = await request.formData();

  const title = formData.get("title");
  const slug = formData.get("slug");
  const markdown = formData.get("markdown");

  const errors: PostError = {};
  if (!title) errors.title = true;
  if (!slug) errors.slug = true;
  if (!markdown) errors.markdown = true;

  if (Object.keys(errors).length) {
    return errors;
  }

  invariant(typeof title === "string");
  invariant(typeof slug === "string");
  invariant(typeof markdown === "string");
  await createPost({ title, slug, markdown });

  return redirect("/admin");
};

export default function EditPost() {
  const postContent = useLoaderData<PostContent>();
  const errors = useActionData();
  const transition = useTransition();

  return (
    <Form method="post">
      <p>
        <label>
          Post Title: {errors?.title ? <em>Title is required</em> : null}
          <input type="text" name="title" defaultValue={postContent.title} />
        </label>
      </p>
      <p>
        <label>
          Post Slug: {errors?.slug ? <em>Slug is required</em> : null}
          <input type="text" name="slug" defaultValue={postContent.slug} />
        </label>
      </p>
      <p>
        <label htmlFor="markdown">Markdown:</label>{" "}
        {errors?.markdown ? <em>Markdown is required</em> : null}
        <br />
        <textarea
          id="markdown"
          rows={20}
          name="markdown"
          defaultValue={postContent.markdown}
        />
      </p>
      <p>
        <button type="submit">
          {transition.submission ? "Submitting..." : "Submit"}
        </button>
      </p>
    </Form>
  );
}
