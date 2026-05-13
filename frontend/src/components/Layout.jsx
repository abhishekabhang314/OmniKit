import { Outlet } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'

export default function Layout() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
    }}>
      <Header />
      <main style={{
        flex: 1,
        maxWidth: 1280,
        margin: '0 auto',
        width: '100%',
        padding: 'var(--space-8) var(--space-6)',
      }}>
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}