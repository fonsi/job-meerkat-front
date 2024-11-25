import { getSortedJobPosts } from '@/jobPost/getSortedJobPosts';
import { HomePage } from '@/pageComponents/home/HomePage';
import { Container } from '@/shared/layout/Container';

const Home = async () => {
  const jobPosts = await getSortedJobPosts();

  return (
    <Container>
      <HomePage jobPosts={jobPosts} />
    </Container>
  );
}

export default Home;
