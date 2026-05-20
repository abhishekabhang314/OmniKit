import { Routes, Route } from 'react-router-dom'
import { ThemeContext } from './context/ThemeContext'
import { useTheme } from './hooks/useTheme'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import CategoryPage from './pages/CategoryPage'
import ToolPage from './pages/ToolPage'
import NotFoundPage from './pages/NotFoundPage'

export default function App() {
  const { theme, toggleTheme } = useTheme()

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path=":category" element={<CategoryPage />} />
          <Route path=":category/:toolId" element={<ToolPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </ThemeContext.Provider>
  )
}