import { useState } from 'react'
import { ActionButton, Field, Scramble, Segmented, Toggle, ToolFrame } from '@/components/instrument'
import { useLiveApi } from '@/hooks/useLiveApi'
import { copyText, downloadBlob } from '@/lib/output'

const COUNTS = [1, 5, 10, 25].map(v => ({ value: v, label: String(v) }))

export default function UUIDGenerator({ tool }) {
  const [count, setCount] = useState(5)
  const [uppercase, setUppercase] = useState(false)
  const [hyphens, setHyphens] = useState(true)

  const { data, error, loading, refresh } = useLiveApi('/api/generators/uuid', { count, uppercase, remove_hyphens: !hyphens }, { delay: 0 })
  const list = data?.uuids || []
  const text = list.join('\n')

  const inputs = (
    <>
      <Field label="How many">
        <Segmented label="How many" options={COUNTS} value={count} onChange={setCount} />
      </Field>
      <Field label="Format">
        <div className="tl-toggles">
          <Toggle label="Uppercase" sample="A-F" on={uppercase} onChange={setUppercase} />
          <Toggle label="Hyphens" sample="8-4-4-4-12" on={hyphens} onChange={setHyphens} />
        </div>
      </Field>
      <p className="tl-note">Version 4 UUIDs from the server’s cryptographic random source.</p>
    </>
  )

  const output = (
    <div className={`tl-uu${count === 1 ? ' tl-uu--one' : ''}`} data-lenis-prevent="">
      {list.map((v, i) => (
        <div key={i}>
          <span className="n">{String(i + 1).padStart(2, '0')}</span>
          <Scramble className="v" text={v} />
        </div>
      ))}
    </div>
  )

  const actions = (
    <>
      <ActionButton primary label="Regenerate ↻" onClick={refresh} />
      <ActionButton label="Copy all" disabled={!list.length} onClick={() => copyText(text)} />
      <ActionButton label="Download .txt" disabled={!list.length} onClick={() => downloadBlob(new Blob([text], { type: 'text/plain' }), 'uuids.txt')} />
    </>
  )

  return <ToolFrame code={tool.code} inputs={inputs} output={output} actions={actions} error={error} busy={loading} />
}
