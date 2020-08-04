import * as React from 'react'
import { Howl } from 'howler'
import { css } from '@emotion/react'

import Box from './Box'
import Play from './Play'
import Pause from './Pause'
import Next from './Next'

const secondsToMinutes = (s: number): string => {
  const min = Math.floor(s / 60)
  const secs = Math.floor(s % 60)

  return `${min >= 10 ? min : `0${min}`}:${secs >= 10 ? secs : `0${secs}`}`
}

type Track = {
  url: string
  caption: string | null
}

export const Playlist: React.FC = () => {
  const [playlist, setPlaylist] = React.useState<Track[]>([])
  const [sound, setSound] = React.useState<Howl | null>(null)
  const [state, setState] = React.useState<'play' | 'pause'>('pause')
  const [currentTrack, setCurrentTrack] = React.useState<number>(0)
  const [seek, setSeek] = React.useState<string>('--:--')
  const [duration, setDuration] = React.useState<string>('--:--')

  const getPlaylist = async () => {
    const res = await fetch('/api/playlist').then((x) => x.json())
    if (res.playlist) {
      setPlaylist(res.playlist)
    }
  }
  React.useEffect(() => {
    getPlaylist()
  }, [])

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
    return (
      <Box className="h-24 theme-inverted animate-pulse">
        <h2>Listen the Jam</h2>
      </Box>
    )
  }

  return (
    <Box className="space-y-4">
      <div className="flex flex-row items-center space-x-4">
        <h2>Listen the Jam</h2>
        <div
          className={`text-sm w-24 theme text-center ${!duration ? 'opacity-50' : 'opacity-75'}`}
          css={css`
            font-variant-numeric: tabular-nums;
          `}
        >
          {seek} / {duration}
        </div>
        {playlist[currentTrack]?.url ? (
          <>
            <button
              className="inline-block transition-colors duration-300 ease-in-out opacity-75 cursor-pointer theme focus:outline-none hover:opacity-100"
              onClick={handlePlay}
            >
              {state === 'play' ? <Pause /> : <Play />}
            </button>
            <button
              className="inline-block transition-colors duration-300 ease-in-out opacity-75 cursor-pointer theme focus:outline-none hover:opacity-100"
              onClick={handleNext}
            >
              <Next />
            </button>
          </>
        ) : null}
      </div>
      {playlist[currentTrack]?.caption ? (
        <div
          className="text-base opacity-75 theme"
          dangerouslySetInnerHTML={{ __html: playlist[currentTrack].caption }}
        />
      ) : (
        <div className="text-base opacity-75 theme">...</div>
      )}
    </Box>
  )
}

export default React.memo(Playlist)
