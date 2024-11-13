type CompaniesResponse = {
    id: string;
    name: string;
    homePage: string;
}[];

export async function generateStaticParams() {
    const response = await fetch('https://rzk1ynkscf.execute-api.eu-west-1.amazonaws.com/company');
    const companies = await response.json() as CompaniesResponse;
   
    return companies.map((company) => ({
      id: company.id,
    }))
  }

type CompanyResponse = {
    company: {
        id: string;
        name: string;
        homePage: string;
    },
    openJobPosts: {
        id: string;
        title: string;
        url: string;
    }[]
}

const Company = async ({
    params,
}: {
    params: Promise<{ id: string }>
}) => {
    const { id } = await params;
    const response = await fetch(`https://rzk1ynkscf.execute-api.eu-west-1.amazonaws.com/company/${id}`).then((res) => res.json()) as CompanyResponse;
    const { company, openJobPosts } = response;

    return <div>
        <p>{company.name}</p>
        {
            openJobPosts.map(jobPost => {
                return <a target="_blank" key={jobPost.id} href={jobPost.url}>{jobPost.title}</a>
            })
        }
    </div>;
}

export default Company;