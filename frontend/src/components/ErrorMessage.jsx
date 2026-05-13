import { AlertCircle } from 'lucide-react'

export default function ErrorMessage({ message }) {
  if (!message) return null
  return (
    <div className="error-message">
      <AlertCircle size={16} />
      <span>{message}</span>
    </div>
  )
}
