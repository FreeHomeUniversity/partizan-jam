import * as React from 'react'
import { css } from '@emotion/react'

type Props = {
  /** YouTube id */
  youTubeId: string
  /** Aspect ratio of YouTube video */
  aspectRatio?: '1:1' | '16:9' | '4:3' | '3:2' | '8:5'
  /** Skip to a time in the video */
  skipTo?: {
    h?: number
    m: number
    s: number
  }
  /** Auto play the video */
  autoPlay?: boolean
}

const RATIOS = {
  '1:1': '100%',
  '16:9': '56.25%',
  '4:3': '75%',
  '3:2': '66.66%',
  '8.5': '62.5%',
}

export const YouTube: React.FC<Props> = ({
  youTubeId,
  aspectRatio = '16:9',
  autoPlay = false,
  skipTo = { h: 0, m: 0, s: 0 },
}) => {
  const { h, m, s } = skipTo

  const tH = h! * 60
  const tM = m * 60

  const startTime = tH + tM + s

  return (
    <div
      className="relative w-full"
      css={css`
        padding-bottom: ${RATIOS[aspectRatio]};
      `}
    >
      <iframe
        className="absolute inset-0 w-full h-full"
        title={`youTube-${youTubeId}`}
        src={`https://www.youtube.com/embed/${youTubeId}?&autoplay=${autoPlay}&start=${startTime}`}
        frameBorder="0"
        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  )
}
