const suggestCompaniesFormUrl = process.env.NEXT_PUBLIC_SUGGEST_COMPANIES_FORM;

export const openSuggestCompaniesForm = () =>
    window.open(suggestCompaniesFormUrl, '_blank');
