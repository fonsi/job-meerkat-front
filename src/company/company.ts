export type CompanyLogo = {
    url: string;
    background?: string;
}

export type Company = {
    id: string;
    name: string;
    homePage: string;
    logo: CompanyLogo;
}