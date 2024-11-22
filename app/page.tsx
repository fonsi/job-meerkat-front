import { getJobPosts } from '@/jobPost/http/getJobPosts';
import { HomePage } from '@/pageComponents/home/HomePage';
import { Container } from '@/shared/layout/Container';

const Home = async () => {
  const jobPosts = await getJobPosts();

  return (
    <Container>
      <HomePage jobPosts={jobPosts} />
    </Container>
  );
}

export default Home;
