import type { RouteRecord } from 'vite-react-ssg'
import App from './App'
import Home, { loader as homeLoader } from './pages/public/Home'
import Blog, { loader as blogLoader } from './pages/public/Blog'
import Post, { loader as postLoader } from './pages/public/Post'
import About from './pages/public/About'
import Contact from './pages/public/Contact'
import NotFound from './pages/public/NotFound'
import AuthGuard from './components/AuthGuard'
import { fetchPublishedSlugs } from './lib/posts'

// Admin pages are lazy so TipTap + the admin bundle are split out of the public
// chunk that regular visitors download.
const lazyDefault =
  (importer: () => Promise<{ default: React.ComponentType }>) => () =>
    importer().then((m) => ({ Component: m.default }))

export const routes: RouteRecord[] = [
  {
    path: '/',
    element: <App />,
    children: [
      // Public routes carry loaders so their data is fetched at build and baked
      // into the pre-rendered HTML (SEO), then reused on client hydration.
      { index: true, Component: Home, loader: homeLoader },
      { path: 'blog', Component: Blog, loader: blogLoader },
      {
        path: 'blog/:slug',
        Component: Post,
        loader: postLoader,
        // Enumerate published slugs at build so each post gets its own static page.
        getStaticPaths: fetchPublishedSlugs,
      },
      { path: 'about', Component: About },
      { path: 'contact', Component: Contact },
      // Lazy: Login pulls shadcn Card/Input (radix) that public content pages don't need.
      {
        path: 'login',
        lazy: lazyDefault(() => import('./pages/public/Login')),
      },
      // Admin is client-only (behind the auth guard); it renders a loading shell
      // during pre-render and resolves the session on the client.
      {
        path: 'admin',
        element: <AuthGuard />,
        children: [
          {
            index: true,
            lazy: lazyDefault(() => import('./pages/admin/Dashboard')),
          },
          {
            path: 'posts',
            lazy: lazyDefault(() => import('./pages/admin/ManagePosts')),
          },
          {
            path: 'new',
            lazy: lazyDefault(() => import('./pages/admin/NewPost')),
          },
          {
            path: 'edit/:id',
            lazy: lazyDefault(() => import('./pages/admin/EditPost')),
          },
          {
            path: 'account',
            lazy: lazyDefault(() => import('./pages/admin/Account')),
          },
        ],
      },
      { path: '*', Component: NotFound },
    ],
  },
]
