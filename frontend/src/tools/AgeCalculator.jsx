import { useState } from 'react'
import { ActionButton, CountUp, Field, ToolFrame } from '@/components/instrument'
import { useLiveApi } from '@/hooks/useLiveApi'
import { copyText } from '@/lib/output'

const pad = n => String(n).padStart(2, '0')
const isoToday = () => { const d = new Date(); return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}` }
const parseDate = s => { const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s || ''); return m ? new Date(+m[1], +m[2] - 1, +m[3]) : null }
const fmtInt = v => Math.round(v).toLocaleString('en-US')

// Days until the next birthday (0 when it is today).
function daysToBirthday(dob, today) {
  let next = new Date(today.getFullYear(), dob.getMonth(), dob.getDate())
  if (next < today) next = new Date(today.getFullYear() + 1, dob.getMonth(), dob.getDate())
  return Math.round((next - today) / 864e5)
}

export default function AgeCalculator({ tool }) {
  const [dob, setDob] = useState('1995-06-14')
  const today = isoToday()
  const born = parseDate(dob)
  const valid = !!born && dob <= today

  const { data, error, loading } = useLiveApi('/api/calculators/age', { birth_date: dob }, { enabled: valid })
  const r = valid ? data : null
  const toNext = born ? daysToBirthday(born, parseDate(today)) : 0

  const rows = r ? [
    ['Total months', fmtInt(r.years * 12 + r.months)],
    ['Total weeks', fmtInt(Math.floor(r.total_days / 7))],
    ['Total days', fmtInt(r.total_days)],
    ['Born on a', born.toLocaleDateString('en-US', { weekday: 'long' })],
    ['Next birthday', toNext === 0 ? 'Today' : `in ${toNext} days`],
    ['Turning', String(r.years + (toNext === 0 ? 0 : 1))],
  ] : []

  const inputs = (
    <>
      <Field label="Date of birth" htmlFor="age-dob">
        <input id="age-dob" className="tl-text" type="date" value={dob} max={today} onChange={e => setDob(e.target.value)} />
      </Field>
      <p className="tl-note">Age is worked out as of today, {parseDate(today).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}.</p>
    </>
  )

  const output = valid ? (
    <>
      <div className="tl-age">
        <div><CountUp className="tl-big" value={r ? r.years : NaN} format={fmtInt} /><div className="tl-cap">Years</div></div>
        <div><CountUp className="tl-big" value={r ? r.months : NaN} format={fmtInt} /><div className="tl-cap">Months</div></div>
        <div><CountUp className="tl-big" value={r ? r.days : NaN} format={fmtInt} /><div className="tl-cap">Days</div></div>
      </div>
      <div className="tl-kv">
        {rows.map(([k, v]) => <div key={k}><span>{k}</span><span>{v}</span></div>)}
      </div>
    </>
  ) : (
    <div className="tl-cap" style={{ fontSize: 15, textTransform: 'none', letterSpacing: 0 }}>Pick a date of birth on or before today.</div>
  )

  const actions = <ActionButton primary label="Copy" disabled={!r} onClick={() => copyText(`${r.years} years, ${r.months} months, ${r.days} days`)} />

  return <ToolFrame code={tool.code} inputs={inputs} output={output} actions={actions} error={valid ? error : null} busy={loading} />
}
