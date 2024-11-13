import Link from "next/link";

type JobPostsData = {
  id: string;
  title: string;
  url: string;
  company: {
    id: string;
    name: string;
  }
}[];

const Home = async () => {
  const data = await fetch('https://rzk1ynkscf.execute-api.eu-west-1.amazonaws.com/jobPost');
  const jobPosts = await data.json() as JobPostsData;

  return (
    <div>
      <main>
        <div>
          Welcome to jobmeerkat
          {
            jobPosts.map((jobPost) =>
              <p key={jobPost.id}>
                <a target="_blank" href={jobPost.url}>{jobPost.title}</a>
                <Link href={`/company/${jobPost.company.id}`}>{jobPost.company.name}</Link>
              </p>
            )
          }
        </div>
      </main>
      <footer>
        Made with love by @fonsirs
      </footer>
    </div>
  );
}

export default Home;
