import { useState } from 'react'
import axios from 'axios'
import { ToolButton, ToolResult, FieldGroup } from '@/components/ui-kit'
import { Calendar as CalendarIcon } from 'lucide-react'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Label } from '@/components/ui/label'

export default function AgeCalculator() {
  const [date, setDate] = useState(null)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleAction = async () => {
    if (!date) {
      setError('Please select your birth date.')
      return
    }
    setError('')
    setLoading(true)
    setResult(null)
    
    // Format to YYYY-MM-DD
    const birthDateStr = format(date, 'yyyy-MM-dd')
    
    try {
      const res = await axios.post('/api/calculators/age', { birth_date: birthDateStr })
      setResult(res.data)
    } catch (err) {
      let errorMessage = 'Invalid date format.';
      if (err.response?.data?.detail) {
        if (typeof err.response.data.detail === 'string') {
          errorMessage = err.response.data.detail;
        } else if (Array.isArray(err.response.data.detail) && err.response.data.detail.length > 0) {
          errorMessage = err.response.data.detail[0].msg;
        }
      }
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <FieldGroup cols={1}>
        <div className="flex flex-col gap-2">
          <Label htmlFor="birthDate" className="field-label">Birth Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal py-3 h-auto input-field",
                  !date && "text-muted-foreground",
                  error && "border-[var(--color-error)] focus-visible:ring-[var(--color-error)]"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full min-w-[340px] p-0 border-[var(--color-border)] shadow-[var(--shadow-card)]" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                captionLayout="dropdown"
                fromYear={1900}
                toYear={new Date().getFullYear()}
                initialFocus
                className="w-full [--cell-size:2.75rem]"
              />
            </PopoverContent>
          </Popover>
          {error && (
            <p style={{ fontSize: 12, color: 'var(--color-error)', marginTop: 4, fontFamily: 'var(--font-sans)' }}>
              {error}
            </p>
          )}
        </div>
      </FieldGroup>
      
      <ToolButton loading={loading} onClick={handleAction}>
        Calculate Age
      </ToolButton>

      <ToolResult visible={!!result}>
        {result && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'Years', value: result.years },
              { label: 'Months', value: result.months },
              { label: 'Days', value: result.days },
              { label: 'Total Days', value: result.total_days.toLocaleString() }
            ].map((item, idx) => (
              <div key={idx} className="flex flex-col items-center justify-center p-4 bg-[var(--color-bg-subtle)] rounded-xl border border-[var(--color-border)]">
                <div className="text-3xl font-black text-[var(--color-primary)]">
                  {item.value}
                </div>
                <div className="text-xs text-[var(--color-text-secondary)] uppercase tracking-wider font-semibold mt-1">
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        )}
      </ToolResult>
    </div>
  )
}