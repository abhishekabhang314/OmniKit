import { useParams, Link } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import tools from '../registry/tools.json'

const TOOL_COMPONENTS = {
  'qr-code-generator': lazy(() => import('../tools/QRCodeGenerator')),
  'unit-converter':    lazy(() => import('../tools/UnitConverter')),
  'emi-calculator':    lazy(() => import('../tools/EMICalculator')),
}

export default function ToolPage() {
  const { category, toolId } = useParams()
  const tool = tools.find(t => t.id === toolId)
  const ToolComponent = TOOL_COMPONENTS[toolId]

  if (!tool) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 0', color: '#aaa' }}>
        <div style={{ fontSize: 48 }}>🔧</div>
        <p style={{ marginTop: 12 }}>Tool not found. Check the URL or go back.</p>
        <Link to="/" style={{ color: '#4f46e5', marginTop: 12, display: 'inline-block' }}>
          ← Back to ToolBox
        </Link>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 680, margin: '0 auto' }}>
      <div style={{ marginBottom: 20 }}>
        <Link
          to={`/${category}`}
          style={{ fontSize: 13, color: '#aaa', textDecoration: 'none' }}
        >
          ← Back to {category}
        </Link>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: '#1a1a1a', margin: '8px 0 4px' }}>
          {tool.icon} {tool.name}
        </h1>
        <p style={{ fontSize: 14, color: '#888', margin: 0 }}>{tool.description}</p>
      </div>

      <div style={{
        background: '#fff',
        borderRadius: 16,
        border: '1.5px solid #e5e5e5',
        padding: 28,
      }}>
        {ToolComponent ? (
          <Suspense fallback={
            <div style={{ textAlign: 'center', padding: '40px 0', color: '#aaa' }}>
              Loading tool...
            </div>
          }>
            <ToolComponent />
          </Suspense>
        ) : (
          <div style={{ textAlign: 'center', padding: '40px 0', color: '#aaa' }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>🛠️</div>
            <p>This tool is coming soon.</p>
            <a
              href="https://github.com/abhishekabhang314/toolbox/blob/main/CONTRIBUTING.md"
              target="_blank"
              rel="noreferrer"
              style={{ color: '#4f46e5', fontSize: 13 }}
            >
              Want to build it? Contribute →
            </a>
          </div>
        )}
      </div>
    </div>
  )
}