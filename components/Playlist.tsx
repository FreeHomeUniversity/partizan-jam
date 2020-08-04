import * as React from 'react'
import { Howl } from 'howler'

import { Box } from './Box'
import { css } from '@emotion/react'

const secondsToMinutes = (s: number): string => {
  const min = Math.floor(s / 60)
  const secs = Math.floor(s % 60)

  return `${min >= 10 ? min : `0${min}`}:${secs >= 10 ? secs : `0${secs}`}`
}

type Track = {
  url: string
  caption: string | null
}

export type PlaylistProps = {
  playlist: Track[]
}
export const Playlist: React.FC<PlaylistProps> = ({ playlist }) => {
  const [sound, setSound] = React.useState<Howl | null>(null)
  const [state, setState] = React.useState<'play' | 'pause'>('pause')
  const [currentTrack, setCurrentTrack] = React.useState<number>(0)
  const [seek, setSeek] = React.useState<string>('--:--')
  const [duration, setDuration] = React.useState<string>('--:--')

  React.useEffect(() => {
    if (playlist.length) {
      // Setup the new Howl.
      setSound(
        new Howl({
          src: [playlist[currentTrack].url],
          loop: false,
          autoplay: false,
          preload: true,
          html5: true,
        }),
      )
    }
    setSeek('--:--')
    setDuration('--:--')

    return () => {
      sound?.unload()
    }
  }, [playlist.length, currentTrack])

  React.useEffect(() => {
    if (sound) {
      switch (state) {
        case 'play':
          sound.play()
          break
        case 'pause':
          sound.pause()

          break

        default:
          break
      }
    }
  }, [state])

  React.useEffect(() => {
    let interval
    if (state === 'play') {
      interval = setInterval(() => {
        if (!isNaN(sound?.seek())) {
          setSeek(secondsToMinutes(sound?.seek()))
        }
      }, 1000)
    }

    return () => {
      clearInterval(interval)
    }
  }, [sound, state])

  React.useEffect(() => {
    if (sound?.duration()) {
      setDuration(secondsToMinutes(sound?.duration()))
    }
  }, [sound?.duration()])

  const handlePlay = () => {
    setState((prev) => (prev === 'pause' ? 'play' : 'pause'))
  }
  const handleNext = () => {
    setState('pause')
    setCurrentTrack((prev) => (prev + 1) % playlist.length)
  }

  if (playlist.length === 0) {
    return null
  }

  return (
    <Box className="space-y-4">
      <div className="flex flex-row items-center space-x-4">
        <h2>Listen the Jam</h2>
        <div
          className={`text-sm w-24 text-center ${!duration ? 'text-gray-200' : 'text-gray-700'}`}
          css={css`
            font-variant-numeric: tabular-nums;
          `}
        >
          {seek} / {duration}
        </div>
        <button className="inline-grid px-2 cursor-pointer" onClick={handlePlay}>
          {state === 'play' ? 'Pause' : 'Play'}
        </button>
        <button className="inline-grid px-2 cursor-pointer" onClick={handleNext}>
          Next
        </button>
      </div>
      {playlist[currentTrack]?.caption ? (
        <div className="text-base" dangerouslySetInnerHTML={{ __html: playlist[currentTrack].caption }} />
      ) : (
        <div className="text-base">...</div>
      )}
    </Box>
  )
}

export default React.memo(Playlist)
