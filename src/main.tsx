import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import LangSwitcherDemo from './LangSwitcherDemo'
import { useRoute } from './site/router'
import { SitePage } from './site/pages'
import './index.css'

// Tab-bar icon: "setting sun over water" emblem in cream on a vermilion seal tile.
const FAVICON =
  "data:image/svg+xml," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">` +
      `<rect width="32" height="32" rx="7" fill="#c0392b"/>` +
      `<circle cx="16" cy="12.5" r="5.4" fill="#faf7f2"/>` +
      `<g fill="none" stroke="#faf7f2" stroke-width="2.2" stroke-linecap="round">` +
      `<path d="M6.5 22.5 q4.75 -3 9.5 0 t9.5 0"/>` +
      `<path d="M6.5 26.5 q4.75 -3 9.5 0 t9.5 0"/>` +
      `</g></svg>`,
  )
{
  let link = document.querySelector<HTMLLinkElement>("link[rel='icon']")
  if (!link) {
    link = document.createElement("link")
    link.rel = "icon"
    document.head.appendChild(link)
  }
  link.type = "image/svg+xml"
  link.href = FAVICON
}

// Hash-based routing:
//   #/p/<slug>   → footer info/policy/editorial pages
//   #lang-demo   → standalone language-switcher preview
//   (anything else) → the main travel journal
function Root() {
  const page = useRoute()
  if (page) return <SitePage slug={page} />
  if (window.location.hash === '#lang-demo') return <LangSwitcherDemo />
  return <App />
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>,
)
