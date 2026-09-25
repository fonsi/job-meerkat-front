export const Colors = {
    brokenBlack: '#111',
    brokenWhite: '#fefefe',
    darkGrey: '#222',
    mediumGrey: '#999',
    lightGrey: '#ddd',
    white: '#fff',
    red: '#f33',
    accent: '#D6FF3F',
};

/** Horizontal page inset — keep Header, Footer, Container, and heroes in sync. */
export const PageGutter = {
    sm: '16px',
    lg: '24px',
};

const Size = {
    mobileS: '320px',
    mobileM: '375px',
    mobileL: '425px',
    tablet: '768px',
    laptop: '1024px',
    laptopL: '1440px',
    desktop: '2560px',
};

export const Device = {
    mobileS: `(min-width: ${Size.mobileS})`,
    mobileM: `(min-width: ${Size.mobileM})`,
    mobileL: `(min-width: ${Size.mobileL})`,
    tablet: `(min-width: ${Size.tablet})`,
    laptop: `(min-width: ${Size.laptop})`,
    laptopL: `(min-width: ${Size.laptopL})`,
    desktop: `(min-width: ${Size.desktop})`,
    desktopL: `(min-width: ${Size.desktop})`,
};
