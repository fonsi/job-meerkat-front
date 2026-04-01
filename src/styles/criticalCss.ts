/**
 * Inlined in <head> before async CSS + styled-components JS injects rules.
 * Prevents FOUC: intrinsic SVG/img sizes and layout shell must match components
 * or the first paint shows giant logos and browser-default typography.
 */
export const CRITICAL_CSS = `
:root {
  --dela-gothic-one: "Dela Gothic One", Verdana, Arial, Helvetica, sans-serif;
}
html {
  max-width: 100vw;
  overflow-x: hidden;
}
body {
  margin: 0;
  max-width: 100vw;
  overflow-x: hidden;
  font-family: Verdana, Arial, Helvetica, sans-serif;
  font-size: 14px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: #111;
  color: #fefefe;
}
*,
*::before,
*::after {
  box-sizing: border-box;
}
.app-shell {
  align-items: center;
  background-color: #111;
  color: #fefefe;
  display: flex;
  flex-direction: column;
  height: 100vh;
  height: 100dvh;
  justify-content: flex-start;
  overflow: hidden;
  width: 100%;
}
.app-shell > div:first-child {
  align-items: center;
  background-color: #111;
  border-bottom: 1px solid #666;
  box-sizing: border-box;
  color: #fefefe;
  display: flex;
  font-size: 24px;
  justify-content: center;
  min-height: 54px;
  padding: 8px;
  width: 100%;
}
.app-shell > div:first-child nav {
  font-size: 14px;
}
.app-shell > div:first-child a svg {
  height: 20px;
  width: 186px;
  max-width: min(186px, 70vw);
}
.app-shell > main {
  align-items: center;
  box-sizing: border-box;
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  min-height: 0;
  overflow-x: hidden;
  overflow-y: auto;
  width: 100%;
}
.app-shell > footer {
  align-items: center;
  border-top: 1px solid #666;
  box-sizing: border-box;
  display: flex;
  font-size: 12px;
  justify-content: center;
  padding: 8px 4px;
  width: 100%;
}
.app-shell > footer svg {
  flex-shrink: 0;
  height: 24px;
  width: 24px;
}
[data-company-logo] {
  background-color: transparent;
  flex-shrink: 0;
  height: var(--logo-w-sm);
  min-height: var(--logo-w-sm);
  min-width: var(--logo-w-sm);
  position: relative;
  width: var(--logo-w-sm);
}
[data-company-logo] img {
  height: 100%;
  object-fit: contain;
  padding: 4px;
  width: 100%;
}
@media (min-width: 768px) {
  [data-company-logo] {
    height: var(--logo-w-lg);
    min-height: var(--logo-w-lg);
    min-width: var(--logo-w-lg);
    width: var(--logo-w-lg);
  }
}
.home-hero {
  align-items: center;
  display: flex;
  flex-direction: column;
  margin: 48px 0;
  min-height: 168px;
  padding: 0 8px;
  text-wrap: pretty;
}
.home-hero h1 {
  font-family: var(--dela-gothic-one);
  font-size: 36px;
  font-weight: 400;
  line-height: 1.2;
  margin: 0;
  min-height: 2.4em;
  text-align: center;
}
.home-hero h2 {
  color: #666;
  font-size: 18px;
  font-weight: 300;
  margin: 12px 0 0;
  max-width: 500px;
  text-align: center;
}
`.trim();
