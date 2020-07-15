import * as React from 'react'

export type BoxProps = {
  p?: number
  className?: React.HTMLAttributes<any>['className']
}
export const Box: React.FC<BoxProps> = ({
  children,
  className = '',
  p = 4,
}) => {
  return (
    <div className={`grid content-center p-${p} box box-outline ${className}`}>
      {children}
    </div>
  )
}

export default React.memo(Box)
