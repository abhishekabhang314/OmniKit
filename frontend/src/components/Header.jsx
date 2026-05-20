import { Link } from 'react-router-dom'
import { Wrench } from 'lucide-react'
import NavbarSearch from '@/components/NavbarSearch'

const Github = ({ size = 24, className = '', ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.02c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A4.8 4.8 0 0 0 8 18v4" />
  </svg>
)

import { ThemeToggler } from '@/components/animate-ui/buttons/ThemeToggler'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

export default function Header() {
  return (
    <TooltipProvider>
      <header className="header">
        <div className="header-inner">
          {/* Logo */}
          <Link to="/" className="header-logo">
            <span className="header-logo-icon">
              <img src="/OmniKit-Logo.png" alt="OmniKit Logo" height={25} width={25} />
            </span>
            OmniKit
          </Link>



          {/* Right side actions */}
          <div className="header-actions">
            <NavbarSearch />
            <Tooltip>
              <TooltipTrigger asChild>
                <a
                  href="https://github.com/abhishekabhang314/OmniKit/blob/main/CONTRIBUTING.md"
                  target="_blank"
                  rel="noreferrer"
                  className="btn-ghost"
                  style={{ fontSize: 13 }}
                >
                  Contribute
                </a>
              </TooltipTrigger>
              <TooltipContent>
                <p>Contribute a new tool</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <a
                  href="https://github.com/abhishekabhang314/OmniKit"
                  target="_blank"
                  rel="noreferrer"
                  className="btn-icon"
                  aria-label="View on GitHub"
                >
                  <Github size={18} />
                </a>
              </TooltipTrigger>
              <TooltipContent>
                <p>View on GitHub</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <ThemeToggler />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Toggle Theme</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </header>
    </TooltipProvider>
  )
}