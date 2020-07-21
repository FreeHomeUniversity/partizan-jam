import * as React from 'react'

export type BoxProps = {
  p?: number
  className?: React.HTMLAttributes<any>['className']
  children: React.ReactNode
}
export const Box: React.FC<BoxProps> = ({
  children,
  className = '',
  p = 4,
}) => {
  return (
    <div
      className={`grid place-center p-${p} theme theme-outline ${className}`}
    >
      {children}
    </div>
  )
}

export default React.memo(Box)
