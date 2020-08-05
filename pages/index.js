import Layout from "@components/Layout";

const Index = () => {
  return (
    <>
      <Layout pageTitle="Jake Brown">
        <h1 className="title">Jake Brown</h1>
        <p className="description">Developer. EyeSpace™ co-founder and CTO.</p>
      </Layout>
      <style jsx>{`
        .title {
          margin: 1rem auto;
          font-size: 3rem;
        }
      `}</style>
    </>
  );
};

export default Index;
