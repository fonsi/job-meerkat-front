import { getSortedJobPosts } from '@/jobPost/getSortedJobPosts';
import { getJobPosts } from '@/jobPost/http/getJobPosts';
import { HomePage } from '@/pageComponents/home/HomePage';
import { Container } from '@/shared/layout/Container';

const Home = async () => {
  const jobPosts = await getJobPosts();
  const sortedJobPosts = getSortedJobPosts(jobPosts);

  return (
    <Container>
      <HomePage jobPosts={sortedJobPosts} />
    </Container>
  );
}

export default Home;
