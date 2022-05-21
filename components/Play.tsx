import * as React from 'react'

type Props = {
  width?: React.CSSProperties['width']
  height?: React.CSSProperties['height']
  className?: string
}

const Play: React.FC<Props> = ({
  width = '1em',
  height = '1em',
  className,
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 50 50"
      fill="none"
      className={className}
    >
      <path d="M10 45V5l30 20-30 20z" fill="currentColor" />
    </svg>
  )
}

export default React.memo(Play)
