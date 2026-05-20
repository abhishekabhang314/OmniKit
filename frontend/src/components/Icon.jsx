import {
  Zap, RefreshCw, Calculator, Type, Code2, Image,
  QrCode, Lock, Fingerprint, Ruler, Palette, CreditCard,
  Scale, CalendarDays,
} from 'lucide-react'

const TOOL_ICON_MAP = {
  'qr-code-generator':  QrCode,
  'password-generator': Lock,
  'uuid-generator':     Fingerprint,
  'unit-converter':     Ruler,
  'color-converter':    Palette,
  'emi-calculator':     CreditCard,
  'bmi-calculator':     Scale,
  'age-calculator':     CalendarDays,
}

const CATEGORY_ICON_MAP = {
  generators:  Zap,
  converters:  RefreshCw,
  calculators: Calculator,
  text:        Type,
  dev:         Code2,
  image:       Image,
}

export function ToolIcon({ id, size = 22, ...props }) {
  const IconComponent = TOOL_ICON_MAP[id]
  if (!IconComponent) return null
  return <IconComponent size={size} {...props} />
}

export function CategoryIcon({ category, size = 22, ...props }) {
  const IconComponent = CATEGORY_ICON_MAP[category]
  if (!IconComponent) return null
  return <IconComponent size={size} {...props} />
}
