import * as React from 'react'

type Props = {
  width?: React.CSSProperties['width']
  height?: React.CSSProperties['height']
}

const Pause: React.FC<Props> = ({ width = '1em', height = '1em' }) => {
  return (
    <svg width={width} height={height} viewBox="0 0 50 50" fill="none">
      <rect x="10" y="5" width="10" height="40" fill="currentColor" />
      <rect x="30" y="5" width="10" height="40" fill="currentColor" />
    </svg>
  )
}

export default React.memo(Pause)
