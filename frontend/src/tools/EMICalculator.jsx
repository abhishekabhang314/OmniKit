import { useLayoutEffect, useMemo, useRef, useState } from 'react'
import { ActionButton, CountUp, Field, NumberField, Segmented, ToolFrame } from '@/components/instrument'
import { useLiveApi } from '@/hooks/useLiveApi'
import { copyText } from '@/lib/output'
import { gsap, reduceMotion, ScrollTrigger } from '@/lib/motion'

const CURRENCIES = ['₹', '$', '€', '£'].map(v => ({ value: v, label: v }))
const num = s => parseFloat(String(s).replace(/,/g, ''))

export default function EMICalculator({ tool }) {
  const [cur, setCur] = useState('₹')
  const [principal, setPrincipal] = useState('2500000')
  const [rate, setRate] = useState('8.5')
  const [years, setYears] = useState('20')
  const [open, setOpen] = useState(false)
  const sched = useRef(null)

  const P = num(principal), R = num(rate), n = Math.round(num(years) * 12)
  const valid = P > 0 && R > 0 && n > 0 && n <= 600
  const { data, error, loading } = useLiveApi('/api/calculators/emi', { principal: P, annual_rate: R, tenure_months: n }, { enabled: valid })
  const r = valid ? data : null

  const loc = cur === '₹' ? 'en-IN' : 'en-US'
  const money = useMemo(() => v => cur + Math.round(v).toLocaleString(loc), [cur, loc])
  const share = r ? r.principal / r.total_payment : 0

  useLayoutEffect(() => {
    ScrollTrigger.refresh()
    if (open && sched.current && !reduceMotion()) gsap.from(sched.current, { opacity: 0, y: -12, duration: 0.5, ease: 'power3.out' })
  }, [open])

  const inputs = (
    <>
      <Field label="Currency">
        <Segmented label="Currency" options={CURRENCIES} value={cur} onChange={setCur} />
      </Field>
      <NumberField id="emi-p" label="Loan amount" prefix={cur} value={principal} onChange={setPrincipal} min={50000} max={50000000} step={50000} hint={isFinite(P) ? money(P) : 'Enter an amount'} />
      <NumberField id="emi-r" label="Interest rate" suffix="% a year" value={rate} onChange={setRate} min={1} max={20} step={0.05} hint={isFinite(R) ? `${(R / 12).toFixed(3)}% a month` : ''} />
      <NumberField id="emi-y" label="Tenure" suffix="years" value={years} onChange={setYears} min={1} max={30} step={1} hint={n > 0 ? `${n} months` : ''} />
    </>
  )

  const output = (
    <>
      <div className="tl-cap">Monthly EMI · {valid ? n : '—'} payments</div>
      <CountUp className="tl-big" value={r ? r.emi : NaN} format={money} />
      <div>
        <div className="tl-share"><div style={{ transform: `scaleX(${share})` }} /></div>
        <div className="tl-share-cap">
          <span>Principal {r ? Math.round(share * 100) + '%' : '—'}</span>
          <span>Interest {r ? Math.round((1 - share) * 100) + '%' : '—'}</span>
        </div>
      </div>
      <div className="tl-totals">
        <div><div className="tl-cap">Principal</div><CountUp className="val" value={r ? r.principal : NaN} format={money} /></div>
        <div><div className="tl-cap">Total interest</div><CountUp className="val" value={r ? r.total_interest : NaN} format={money} /></div>
        <div><div className="tl-cap">Total payable</div><CountUp className="val" value={r ? r.total_payment : NaN} format={money} /></div>
      </div>
    </>
  )

  const actions = (
    <>
      <ActionButton primary label="Copy summary" disabled={!r} onClick={() => copyText(`EMI ${money(r.emi)} × ${n} · interest ${money(r.total_interest)} · total ${money(r.total_payment)}`)} />
      <ActionButton label={open ? 'Hide schedule' : 'Show schedule'} done={open ? 'Hide schedule' : 'Show schedule'} disabled={!r} onClick={() => setOpen(o => !o)} />
    </>
  )

  const schedule = (
    <section className="tl-sched">
      <button type="button" className="tl-sched__toggle" aria-expanded={open} aria-controls="emi-schedule" onClick={() => setOpen(o => !o)}>
        <span className="tl-sched__title">
          <strong>Amortization schedule</strong>
          <span className="ok-label">{valid ? n : '—'} payments · year rows highlighted</span>
        </span>
        <span className="tl-sched__btn">{open ? 'Collapse −' : 'Expand +'}</span>
      </button>
      {open && r && (
        <div ref={sched} id="emi-schedule" className="tl-sched__body" data-lenis-prevent="" role="table" aria-label="Amortization schedule">
          <div role="row" className="tl-sched__row tl-sched__row--head">
            <span role="columnheader">Month</span><span role="columnheader">Principal</span><span role="columnheader">Interest</span><span role="columnheader">Balance</span>
          </div>
          {r.schedule.map(m => (
            <div role="row" key={m.month} className={`tl-sched__row${m.month % 12 === 0 ? ' tl-sched__row--year' : ''}`}>
              <span role="cell">{m.month % 12 === 0 ? `${m.month} · Y${m.month / 12}` : m.month}</span>
              <span role="cell">{money(m.principal_paid)}</span>
              <span role="cell">{money(m.interest_paid)}</span>
              <span role="cell">{money(m.balance)}</span>
            </div>
          ))}
        </div>
      )}
    </section>
  )

  return (
    <ToolFrame
      code={tool.code}
      inputs={inputs}
      output={output}
      actions={actions}
      error={valid ? error : 'Enter a positive amount, rate and tenure (up to 50 years).'}
      busy={loading}
      after={schedule}
    />
  )
}
