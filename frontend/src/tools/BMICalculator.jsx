import { useState } from 'react'
import { ActionButton, CountUp, Field, NumberField, Segmented, ToolFrame } from '@/components/instrument'
import { useLiveApi } from '@/hooks/useLiveApi'
import { copyText } from '@/lib/output'

const SYSTEMS = [
  { value: 'metric', label: 'Metric · cm / kg' },
  { value: 'imperial', label: 'Imperial · ft / lb' },
]
// Scale segments from BMI 15 to 40, weighted by their width on that range.
const SEGMENTS = [['Under', 3.5], ['Healthy', 6.5], ['Over', 5], ['Obese', 10]]
const LB = 0.45359237
const num = s => parseFloat(String(s).replace(/,/g, ''))
const fmt1 = v => v.toFixed(1)

export default function BMICalculator({ tool }) {
  const [system, setSystem] = useState('metric')
  const [cm, setCm] = useState('175')
  const [kg, setKg] = useState('70')
  const [ft, setFt] = useState('5')
  const [inch, setInch] = useState('9')
  const [lb, setLb] = useState('154')

  const metric = system === 'metric'
  const heightCm = metric ? num(cm) : (num(ft) * 12 + (num(inch) || 0)) * 2.54
  const weightKg = metric ? num(kg) : num(lb) * LB
  const valid = heightCm > 0 && weightKg > 0

  const { data, error, loading } = useLiveApi('/api/calculators/bmi', { weight_kg: weightKg, height_cm: heightCm }, { enabled: valid })
  const bmi = valid && data ? data.bmi : NaN
  const idx = !isFinite(bmi) ? -1 : bmi < 18.5 ? 0 : bmi < 25 ? 1 : bmi < 30 ? 2 : 3
  const pct = isFinite(bmi) ? ((Math.min(40, Math.max(15, bmi)) - 15) / 25) * 100 : 0

  const hM = heightCm / 100
  const k = metric ? 1 : 1 / LB
  const range = valid ? `${Math.round(18.5 * hM * hM * k)}–${Math.round(24.9 * hM * hM * k)} ${metric ? 'kg' : 'lb'}` : '—'

  const fields = metric
    ? [
        <NumberField key="h" id="bmi-h" label="Height" suffix="cm" value={cm} onChange={setCm} min={100} max={220} step={1} />,
        <NumberField key="w" id="bmi-w" label="Weight" suffix="kg" value={kg} onChange={setKg} min={30} max={200} step={0.5} />,
      ]
    : [
        <NumberField key="ft" id="bmi-ft" label="Height · feet" suffix="ft" value={ft} onChange={setFt} min={3} max={7} step={1} />,
        <NumberField key="in" id="bmi-in" label="Height · inches" suffix="in" value={inch} onChange={setInch} min={0} max={11} step={1} />,
        <NumberField key="lb" id="bmi-lb" label="Weight" suffix="lb" value={lb} onChange={setLb} min={66} max={440} step={1} />,
      ]

  const inputs = (
    <>
      <Field label="Units">
        <Segmented label="Units" options={SYSTEMS} value={system} onChange={setSystem} />
      </Field>
      {fields}
    </>
  )

  const output = (
    <>
      <div className="tl-cap">Body mass index</div>
      <div className="tl-bmi__val">
        <CountUp className="tl-big" value={bmi} format={fmt1} />
        <span className="tl-bmi__cat">{valid && data ? data.category : '—'}</span>
      </div>
      <div className="tl-scale">
        <div className="tl-scale__mark" style={{ transform: `translateX(${pct}%)` }}><span /></div>
        <div className="tl-scale__bar">{SEGMENTS.map(([l, w], i) => <div key={l} style={{ flex: w }} className={i === idx ? 'on' : ''} />)}</div>
        <div className="tl-scale__labels">{SEGMENTS.map(([l, w], i) => <span key={l} style={{ flex: w }} className={i === idx ? 'on' : ''}>{l}</span>)}</div>
      </div>
      <div className="tl-bmi__foot">
        <span>Healthy weight for this height: {range}</span>
        <span>BMI is a screening measure. It does not account for muscle mass, age or sex.</span>
      </div>
    </>
  )

  const actions = <ActionButton primary label="Copy result" disabled={!isFinite(bmi)} onClick={() => copyText(`BMI ${fmt1(bmi)} · ${data.category}`)} />

  return <ToolFrame code={tool.code} inputs={inputs} output={output} actions={actions} error={valid ? error : 'Enter a height and weight above zero.'} busy={loading} />
}
