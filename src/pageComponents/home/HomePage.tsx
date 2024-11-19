import { JobPost } from '@/jobPost/http/getJobPosts'
import { JobPostsList } from '@/jobPost/layout/JobPostList';
import { JobPostRow } from '@/jobPost/layout/JobPostRow';
import { HomeHeader } from './HomeHeader';

type Props = {
    jobPosts: JobPost[];
}

export const HomePage = ({ jobPosts }: Props) => {
    return <>
      <HomeHeader />
      <JobPostsList>
        {
          jobPosts.map((jobPost) =>
            <JobPostRow key={jobPost.id} jobPost={jobPost}></JobPostRow>
          )
        }
      </JobPostsList>
    </>
}