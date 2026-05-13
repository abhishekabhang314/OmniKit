import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

export default function Breadcrumb({ to, label }) {
  return (
    <Link to={to} className="breadcrumb">
      <ArrowLeft size={14} />
      {label}
    </Link>
  )
}
