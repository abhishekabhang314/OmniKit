import { useParams, Link } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import { Hammer } from 'lucide-react'
import tools from '../registry/tools.json'
import Breadcrumb from '../components/Breadcrumb'
import EmptyState from '../components/EmptyState'
import { ToolIcon } from '../components/Icon'

const TOOL_COMPONENTS = {
  'qr-code-generator': lazy(() => import('../tools/QRCodeGenerator')),
  'unit-converter':    lazy(() => import('../tools/UnitConverter')),
  'emi-calculator':    lazy(() => import('../tools/EMICalculator')),
}

function LoadingFallback() {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 'var(--space-12)',
      color: 'var(--color-text-muted)',
      fontFamily: 'var(--font-sans)',
      fontSize: 14,
      gap: 'var(--space-2)',
    }}>
      <span className="spinner" />
      Loading tool...
    </div>
  )
}

export default function ToolPage() {
  const { category, toolId } = useParams()
  const tool = tools.find(t => t.id === toolId)
  const ToolComponent = TOOL_COMPONENTS[toolId]

  if (!tool) {
    return (
      <div>
        <div style={{ marginBottom: 'var(--space-5)' }}>
          <Breadcrumb to="/" label="All tools" />
        </div>
        <EmptyState
          title="Tool not found"
          description="Check the URL or head back to browse all tools."
          action={{ href: '/', label: 'Back to ToolBox' }}
        />
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 720, margin: '0 auto' }}>
      {/* Breadcrumb */}
      <div style={{ marginBottom: 'var(--space-5)' }}>
        <Breadcrumb to={`/${category}`} label={category} />
      </div>

      {/* Tool header */}
      <div className="tool-header">
        <div className="tool-header-icon-row">
          <div className="tool-header-icon">
            <ToolIcon id={tool.id} size={22} />
          </div>
          <h1 className="tool-header-name">{tool.name}</h1>
        </div>
        <p className="tool-header-desc">{tool.description}</p>
      </div>

      {/* Tool UI */}
      {ToolComponent ? (
        <Suspense fallback={<LoadingFallback />}>
          <ToolComponent />
        </Suspense>
      ) : (
        <EmptyState
          icon={Hammer}
          title="Coming soon"
          description="This tool is being built. Want to contribute and ship it?"
          action={{
            href: 'https://github.com/abhishekabhang314/toolbox/blob/main/CONTRIBUTING.md',
            label: 'Want to build it? Contribute →',
          }}
        />
      )}
    </div>
  )
}