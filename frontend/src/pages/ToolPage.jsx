import { useParams } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import { Hammer } from 'lucide-react'
import { Card } from '@/components/ui/card'
import tools from '@/registry/tools.json'
import Breadcrumb from '@/components/Breadcrumb'
import EmptyState from '@/components/EmptyState'
import { ToolIcon } from '@/components/Icon'

const TOOL_COMPONENTS = {
  'qr-code-generator': lazy(() => import('@/tools/QRCodeGenerator')),
  'unit-converter':    lazy(() => import('@/tools/UnitConverter')),
  'emi-calculator':    lazy(() => import('@/tools/EMICalculator')),
}

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center p-12 text-[var(--color-text-muted)] font-sans text-sm gap-2">
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
        <div className="mb-5">
          <Breadcrumb to="/" label="All tools" />
        </div>
        <EmptyState
          title="Tool not found"
          description="Check the URL or head back to browse all tools."
          action={{ href: '/', label: 'Back to OmniKit' }}
        />
      </div>
    )
  }

  return (
    <div className="max-w-[720px] mx-auto">
      {/* Breadcrumb */}
      <div className="mb-5">
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
        <Card className="p-6 md:p-8 border-[var(--color-border)] shadow-[var(--shadow-card)] bg-[var(--color-surface)]">
          <Suspense fallback={<LoadingFallback />}>
            <ToolComponent />
          </Suspense>
        </Card>
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