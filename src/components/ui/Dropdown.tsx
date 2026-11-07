import { useEffect, useRef, useState, type ReactNode } from 'react'

interface DropdownProps {
  trigger: ReactNode
  children: ReactNode
}

export function Dropdown({ trigger, children }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handlePointerDown)
    return () => document.removeEventListener('mousedown', handlePointerDown)
  }, [])

  return (
    <div ref={containerRef} className="relative inline-block">
      <div onClick={() => setIsOpen((value) => !value)}>{trigger}</div>
      {isOpen ? (
        <div className="absolute right-0 top-full z-20 mt-2 w-56 rounded-lg border border-[#2A3442] bg-[#121A22] p-2 shadow-xl">
          {children}
        </div>
      ) : null}
    </div>
  )
}
