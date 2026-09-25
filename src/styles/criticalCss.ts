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
  padding: 8px 0;
  width: 100%;
}
.app-shell > div:first-child > div {
  box-sizing: border-box;
  max-width: 1280px;
  padding: 0 16px;
  width: 100%;
}
.app-shell > div:first-child nav {
  font-size: 13px;
}
.app-shell > div:first-child a svg {
  height: 28px;
  width: 28px;
}
@media (min-width: 768px) {
  .app-shell > div:first-child nav {
    font-size: 14px;
  }
  .app-shell > div:first-child a svg {
    height: 32px;
    width: 32px;
  }
}
@media (min-width: 1024px) {
  .app-shell > div:first-child > div {
    padding: 0 24px;
  }
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
  padding: 8px 0;
  width: 100%;
}
.app-shell > footer > div {
  box-sizing: border-box;
  max-width: 1280px;
  padding: 0 16px;
  width: 100%;
}
@media (min-width: 1024px) {
  .app-shell > footer > div {
    padding: 0 24px;
  }
}
.app-shell > footer svg {
  flex-shrink: 0;
  height: 24px;
  width: 24px;
}
[data-company-logo] {
  background-color: transparent;
  flex-shrink: 0;
  height: var(--logo-h-sm);
  position: relative;
  width: var(--logo-w-sm);
}
[data-company-logo][data-logo-fit] {
  max-width: var(--logo-w-sm);
  min-width: var(--logo-h-sm);
  width: max-content;
}
[data-company-logo] img {
  display: block;
  height: 100%;
  object-fit: contain;
  object-position: left center;
  padding: 2px 0;
  width: 100%;
}
[data-company-logo][data-logo-fit] img {
  max-width: 100%;
  width: auto;
}
@media (min-width: 768px) {
  [data-company-logo] {
    height: var(--logo-h-lg);
    width: var(--logo-w-lg);
  }
  [data-company-logo][data-logo-fit] {
    max-width: var(--logo-w-lg);
    min-width: var(--logo-h-lg);
    width: max-content;
  }
}
.home-hero {
  flex-shrink: 0;
  margin: 0 0 64px;
  padding: 40px 0 48px;
  position: relative;
  text-wrap: pretty;
  width: 100%;
}
.home-hero::before {
  background: radial-gradient(
    ellipse 90% 100% at 28% 0%,
    rgba(214, 255, 63, 0.14),
    transparent 70%
  );
  content: '';
  inset: 0;
  pointer-events: none;
  position: absolute;
  z-index: 0;
}
@media (min-width: 768px) {
  .home-hero {
    margin-bottom: 80px;
    padding: 56px 0 64px;
  }
}
.home-hero h1 {
  align-items: center;
  display: flex;
  flex-direction: column;
  font-family: var(--dela-gothic-one);
  font-weight: 400;
  gap: 0;
  letter-spacing: -0.03em;
  line-height: 1;
  margin: 0;
}
.home-hero h1 > span:first-child {
  font-size: clamp(36px, 6.5vw, 64px);
  letter-spacing: -0.035em;
  line-height: 1.02;
  margin-bottom: 0.28em;
}
.home-hero h1 > span:not(:first-child) {
  font-size: clamp(20px, 3.4vw, 28px);
  letter-spacing: -0.02em;
  line-height: 1.2;
}
.home-hero p {
  color: #999;
  font-size: 17px;
  font-weight: 300;
  line-height: 1.55;
  margin: 0 auto;
  max-width: 34ch;
  text-align: center;
}
@media (min-width: 1024px) {
  .home-hero h1 {
    align-items: flex-start;
  }
  .home-hero p {
    margin: 0.55em 0 0;
    text-align: left;
  }
}
`.trim();
