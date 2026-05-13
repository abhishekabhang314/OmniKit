import { useState } from 'react'
import axios from 'axios'
import { DownloadIcon } from '@/components/animate-ui/icons/DownloadIcon'
import { ToolInput, ToolSlider, ToolButton, ToolResult, FieldGroup, ToolSelect } from '@/components/ui-kit'
import { Button } from '@/components/ui/button'

export default function QRCodeGenerator() {
  const [content, setContent] = useState('')
  const [size, setSize] = useState(10)
  const [border, setBorder] = useState(4)
  const [theme, setTheme] = useState('dark')
  const [transparent, setTransparent] = useState('false')
  const [qrImage, setQrImage] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const generate = async () => {
    if (!content.trim()) {
      setError('Please enter some text or a URL.')
      return
    }
    setError('')
    setLoading(true)
    try {
      const res = await axios.post('/api/generators/qr-code', { 
        content, 
        size, 
        border,
        theme,
        transparent: transparent === 'true'
      })
      setQrImage(res.data.image_base64)
    } catch (err) {
      setError(err.response?.data?.detail || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const download = () => {
    const link = document.createElement('a')
    link.href = qrImage
    link.download = 'qrcode.png'
    link.click()
  }

  return (
    <div className="flex flex-col gap-6">
      <ToolInput
        label="Text or URL"
        id="qr-content"
        textarea
        rows={3}
        placeholder="https://example.com"
        value={content}
        onChange={e => setContent(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && !e.shiftKey && generate()}
        error={error}
      />

      <FieldGroup cols={2}>
        <ToolSlider
          label="Size"
          id="qr-size"
          min={5}
          max={20}
          value={size}
          onChange={setSize}
        />
        <ToolSlider
          label="Border"
          id="qr-border"
          min={1}
          max={10}
          value={border}
          onChange={setBorder}
        />
      </FieldGroup>

      <FieldGroup cols={2}>
        <ToolSelect
          label="Theme"
          id="qr-theme"
          value={theme}
          onChange={e => setTheme(e.target.value)}
          options={[
            { value: 'dark', label: 'Dark (Black QR)' },
            { value: 'light', label: 'Light (White QR)' }
          ]}
        />
        <ToolSelect
          label="Transparent Background"
          id="qr-transparent"
          value={transparent}
          onChange={e => setTransparent(e.target.value)}
          options={[
            { value: 'false', label: 'No' },
            { value: 'true', label: 'Yes' }
          ]}
        />
      </FieldGroup>

      <ToolButton loading={loading} onClick={generate}>
        Generate QR Code
      </ToolButton>

      <ToolResult visible={!!qrImage}>
        <div className="text-center flex flex-col items-center">
          <div 
            className="inline-block p-4 rounded-[var(--radius-md)] shadow-[var(--shadow-sm)] mb-4"
            style={{ backgroundColor: theme === 'light' ? '#222' : '#fff' }}
          >
            <img
              src={qrImage}
              alt="Generated QR Code"
              width={size * 20}
              height={size * 20}
              className="block rounded"
            />
          </div>
          <Button variant="outline" onClick={download} className="gap-2 font-semibold">
            <DownloadIcon size={16} />
            Download PNG
          </Button>
        </div>
      </ToolResult>
    </div>
  )
}
