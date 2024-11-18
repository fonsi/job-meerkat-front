import { getJobPosts } from '@/jobPost/http/getJobPosts';
import { JobPostsList } from '@/jobPost/layout/JobPostList';
import { JobPostRow } from '@/jobPost/layout/JobPostRow';

const Home = async () => {
  const jobPosts = await getJobPosts();

  return (
    <>
      <p>Welcome to jobmeerkat</p>
      <JobPostsList>
        {
          jobPosts.map((jobPost) =>
            <JobPostRow key={jobPost.id} jobPost={jobPost}></JobPostRow>
          )
        }
      </JobPostsList>
    </>
  );
}

export default Home;
