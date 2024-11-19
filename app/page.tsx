import { getJobPosts } from '@/jobPost/http/getJobPosts';
import { HomePage } from '@/pages/home/HomePage';

const Home = async () => {
  const jobPosts = await getJobPosts();

  return (
    <HomePage jobPosts={jobPosts} />
  );
}

export default Home;
