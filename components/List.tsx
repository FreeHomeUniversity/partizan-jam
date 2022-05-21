import * as React from 'react'

type Props = {
  width?: React.CSSProperties['width']
  height?: React.CSSProperties['height']
  opened?: boolean
}

const List: React.FC<Props> = ({
  width = '1em',
  height = '1em',
  opened = false,
}) => {
  return (
    <svg width={width} height={height} viewBox="0 0 50 50" fill="none">
      {opened ? (
        <>
          <path
            d="M6 11.6569L11.6569 6L44.1838 38.5269L38.5269 44.1838L6 11.6569Z"
            fill="currentColor"
          />
          <path
            d="M11.6569 44.1838L6 38.5269L38.5269 6L44.1838 11.6569L11.6569 44.1838Z"
            fill="currentColor"
          />
        </>
      ) : (
        <>
          <path d="M5 29L5 21L45 21V29L5 29Z" fill="currentColor" />
          <path d="M5 44L5 36L45 36V44H5Z" fill="currentColor" />
          <path d="M5 14L5 6L45 6V14L5 14Z" fill="currentColor" />
        </>
      )}
    </svg>
  )
}

export default React.memo(List)
