import { useState } from 'react'
import { ActionButton, Field, Scramble, Toggle, ToolFrame } from '@/components/instrument'
import { useLiveApi } from '@/hooks/useLiveApi'
import { copyText } from '@/lib/output'

// Pool sizes match the backend's alphabets (Python's string module).
const SETS = [
  { key: 'include_uppercase', label: 'Uppercase', sample: 'A–Z', size: 26 },
  { key: 'include_lowercase', label: 'Lowercase', sample: 'a–z', size: 26 },
  { key: 'include_numbers', label: 'Digits', sample: '0–9', size: 10 },
  { key: 'include_symbols', label: 'Symbols', sample: '!@#', size: 32 },
]
const STRENGTH = ['None', 'Weak', 'Fair', 'Strong', 'Very strong']

const fontFor = n => (n <= 16 ? 48 : n <= 28 ? 36 : n <= 44 ? 26 : 20)

export default function PasswordGenerator({ tool }) {
  const [length, setLength] = useState(20)
  const [sets, setSets] = useState({ include_uppercase: true, include_lowercase: true, include_numbers: true, include_symbols: true })

  const anySet = Object.values(sets).some(Boolean)
  const { data, error, loading, refresh } = useLiveApi('/api/generators/password', { length, ...sets }, { enabled: anySet })
  const pw = anySet ? data?.password || '' : ''

  const pool = SETS.reduce((n, s) => n + (sets[s.key] ? s.size : 0), 0)
  const bits = pw ? Math.round(pw.length * Math.log2(Math.max(pool, 1))) : 0
  const level = !pw ? 0 : bits < 45 ? 1 : bits < 65 ? 2 : bits < 90 ? 3 : 4

  const inputs = (
    <>
      <Field label="Length" aside={`${length} characters`} htmlFor="pw-len">
        <input id="pw-len" type="range" min={6} max={64} step={1} value={length} onChange={e => setLength(+e.target.value)} />
      </Field>
      <Field label="Characters">
        <div className="tl-toggles">
          {SETS.map(s => (
            <Toggle key={s.key} label={s.label} sample={s.sample} on={sets[s.key]} onChange={v => setSets(x => ({ ...x, [s.key]: v }))} />
          ))}
        </div>
      </Field>
    </>
  )

  const output = (
    <>
      <div className="tl-cap">Generated password</div>
      <Scramble className="tl-pw" style={{ fontSize: fontFor(length) }} text={anySet ? pw : 'Select at least one character set'} />
      <div>
        <div className="tl-meter">{[1, 2, 3, 4].map(i => <div key={i} className={i <= level ? 'on' : ''} />)}</div>
        <div className="tl-meter-cap"><span>{STRENGTH[level]}</span><span>{bits} bits entropy · pool of {pool}</span></div>
      </div>
    </>
  )

  const actions = (
    <>
      <ActionButton primary label="Regenerate ↻" disabled={!anySet} onClick={refresh} />
      <ActionButton label="Copy" disabled={!pw} onClick={() => copyText(pw)} />
    </>
  )

  return <ToolFrame code={tool.code} inputs={inputs} output={output} actions={actions} error={anySet ? error : null} busy={loading} />
}
