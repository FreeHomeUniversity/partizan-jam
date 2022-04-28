import * as React from 'react'

export type BoxProps = {
  p?: number
  className?: React.HTMLAttributes<any>['className']
  onClick?: () => void
  children: React.ReactNode
}
export const Box = React.forwardRef<HTMLDivElement, BoxProps>(
  ({ children, onClick, className = '', p = 4 }, ref) => {
    return (
      <div
        ref={ref}
        onClick={onClick}
        className={`grid place-stretch ${
          p === 0 ? 'p-0' : `p-${p / 2} md:p-${p}`
        } theme theme-outline ${className}`}
      >
        {children}
      </div>
    )
  },
)

export default React.memo(Box)
