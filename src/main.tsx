import './index.css'
import { ViteReactSSG } from 'vite-react-ssg'
import { routes } from './routes'

// vite-react-ssg drives react-router's data router and pre-renders every static
// public route to HTML at build time. `basename` picks up Vite's base (/phaedra/).
export const createRoot = ViteReactSSG({
  routes,
  basename: import.meta.env.BASE_URL,
})
