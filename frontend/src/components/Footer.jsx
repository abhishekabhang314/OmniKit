import { Separator } from '@/components/ui/separator'

export default function Footer() {
  return (
    <>
      <Separator />
      <footer className="footer">
        OmniKit — open source, community built.{' '}
        <a
          href="https://github.com/abhishekabhang314/toolbox"
          target="_blank"
          rel="noreferrer"
        >
          Contribute on GitHub
        </a>
      </footer>
    </>
  )
}