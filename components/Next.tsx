import * as React from 'react'

type Props = {
  width?: React.CSSProperties['width']
  height?: React.CSSProperties['height']
  className?: string
}

const Next: React.FC<Props> = ({ width = '1em', height = '1em', className }) => {
  return (
    <svg width={width} height={height} className={className} viewBox="0 0 50 50" fill="none">
      <path d="M8.54077 45.2597V5.2597L38.5408 25.2597L8.54077 45.2597Z" fill="currentColor" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M37.4592 45.2597L37.4592 4.7403L41.4592 4.7403V45.2597H37.4592Z"
        fill="currentColor"
      />
    </svg>
  )
}

export default React.memo(Next)
