import { useState } from 'react'
import { ActionButton, Chips, CountUp, Field, Segmented, ToolFrame } from '@/components/instrument'
import { useLiveApi } from '@/hooks/useLiveApi'
import { copyText } from '@/lib/output'

// [pint unit sent to the API, chip label, full name]
const QUANTITIES = {
  length: {
    label: 'Length', def: ['kilometer', 'mile'],
    units: [['meter', 'm', 'Metre'], ['kilometer', 'km', 'Kilometre'], ['centimeter', 'cm', 'Centimetre'], ['millimeter', 'mm', 'Millimetre'], ['mile', 'mi', 'Mile'], ['yard', 'yd', 'Yard'], ['foot', 'ft', 'Foot'], ['inch', 'in', 'Inch']],
  },
  weight: {
    label: 'Weight', def: ['kilogram', 'pound'],
    units: [['kilogram', 'kg', 'Kilogram'], ['gram', 'g', 'Gram'], ['pound', 'lb', 'Pound'], ['ounce', 'oz', 'Ounce'], ['ton', 'ton', 'Ton']],
  },
  temperature: {
    label: 'Temp', def: ['celsius', 'fahrenheit'],
    units: [['celsius', '°C', 'Celsius'], ['fahrenheit', '°F', 'Fahrenheit'], ['kelvin', 'K', 'Kelvin']],
  },
  speed: {
    label: 'Speed', def: ['kilometer_per_hour', 'mile_per_hour'],
    units: [['meter_per_second', 'm/s', 'Metre/second'], ['kilometer_per_hour', 'km/h', 'Kilometre/hour'], ['mile_per_hour', 'mph', 'Mile/hour'], ['knot', 'kn', 'Knot']],
  },
  area: {
    label: 'Area', def: ['square_meter', 'square_mile'],
    units: [['square_meter', 'm²', 'Square metre'], ['square_kilometer', 'km²', 'Square kilometre'], ['square_mile', 'mi²', 'Square mile'], ['acre', 'ac', 'Acre'], ['hectare', 'ha', 'Hectare']],
  },
}

const TYPE_OPTIONS = Object.entries(QUANTITIES).map(([value, q]) => ({ value, label: q.label }))

const IRREGULAR = { Foot: 'Feet', Inch: 'Inches', Celsius: 'Celsius', Fahrenheit: 'Fahrenheit', Kelvin: 'Kelvin' }

// "Square metre" → "Square metres", "Metre/second" → "Metres/second".
function plural(name, n) {
  if (Math.abs(n) === 1) return name
  const [head, ...rest] = name.split('/')
  const words = head.split(' ')
  const last = words.pop()
  words.push(IRREGULAR[last] || last + 's')
  return [words.join(' '), ...rest].join('/')
}
const fmtNum = v => {
  const a = Math.abs(v)
  if (a !== 0 && (a >= 1e12 || a < 1e-6)) return v.toExponential(4)
  return v.toLocaleString('en-US', { maximumFractionDigits: a >= 1000 ? 2 : a >= 1 ? 4 : 6 })
}

export default function UnitConverter({ tool }) {
  const [type, setType] = useState('length')
  const [value, setValue] = useState('100')
  const [from, setFrom] = useState('kilometer')
  const [to, setTo] = useState('mile')

  const Q = QUANTITIES[type]
  const unit = id => Q.units.find(u => u[0] === id) || [id, id, id]
  const num = parseFloat(value.replace(/,/g, ''))
  const valid = isFinite(num)

  const { data, error, loading } = useLiveApi('/api/converters/unit', { value: num, from_unit: from, to_unit: to }, { enabled: valid })
  const result = valid && data && data.from_unit === from && data.to_unit === to ? data.result : NaN

  const pickType = t => {
    setType(t)
    setFrom(QUANTITIES[t].def[0])
    setTo(QUANTITIES[t].def[1])
  }
  const swap = () => { setFrom(to); setTo(from) }
  const chips = Q.units.map(([id, label, title]) => ({ value: id, label, title }))

  const inputs = (
    <>
      <Field label="Quantity">
        <Segmented label="Quantity" options={TYPE_OPTIONS} value={type} onChange={pickType} wrap />
      </Field>
      <Field label="Value" htmlFor="un-val">
        <input id="un-val" className="tl-text" type="text" inputMode="decimal" value={value} onChange={e => setValue(e.target.value)} style={{ fontSize: 24 }} />
      </Field>
      <Field label="From"><Chips label="From" options={chips} value={from} onChange={setFrom} /></Field>
      <button type="button" className="tl-ghost" onClick={swap} aria-label="Swap units" data-magnetic="">⇅ Swap</button>
      <Field label="To"><Chips label="To" options={chips} value={to} onChange={setTo} /></Field>
    </>
  )

  const output = (
    <>
      <div className="tl-unit__from">{valid ? fmtNum(num) : '—'} {plural(unit(from)[2], num)} =</div>
      <div className="tl-unit__res">
        <CountUp className="tl-big" value={result} format={fmtNum} />
        <span className="tl-unit__name">{plural(unit(to)[2], result)}</span>
      </div>
      {data?.formula && <div className="tl-unit__formula">{data.formula}</div>}
    </>
  )

  const actions = (
    <>
      <ActionButton primary label="Copy" disabled={!isFinite(result)} onClick={() => copyText(`${fmtNum(result)} ${unit(to)[1]}`)} />
      <ActionButton label="Swap ⇄" done="Swapped ✓" onClick={swap} />
    </>
  )

  return <ToolFrame code={tool.code} inputs={inputs} output={output} actions={actions} error={valid ? error : 'Enter a number to convert.'} busy={loading} />
}
