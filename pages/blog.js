import Layout from "@components/Layout";
import PostList from "@components/PostList";
import getPosts from "@utils/getPosts";

const About = ({ posts, title, description }) => {
  return (
    <>
      <Layout pageTitle={`${title} | Blog`} description={description}>
        <h1 className="title">Blog</h1>
        <p className="description">
          Mostly, it's my own personal code snippets and things to remember.
          Other developers might find some of it useful.{" "}
        </p>

        <main>
          <PostList posts={posts} />
        </main>
      </Layout>
    </>
  );
};

export default About;

export async function getStaticProps() {
  const posts = ((context) => {
    return getPosts(context);
  })(require.context("../posts", true, /\.md$/));

  return {
    props: {
      posts,
      title: "About",
      description: "About",
    },
  };
}
