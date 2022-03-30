import * as React from 'react'
import Head from 'next/head'
import { Howl } from 'howler'
import { css } from '@emotion/react'
import create from 'zustand'
import shallow from 'zustand/shallow'

import persist from '../lib/persist'
import Box from './Box'
import Play from './Play'
import Pause from './Pause'
import Next from './Next'
import { shuffleArray } from '../lib/getShuffled'

const secondsToMinutes = (s: number): string => {
  const min = Math.floor(s / 60)
  const secs = Math.floor(s % 60)

  return `${min >= 10 ? min : `0${min}`}:${secs >= 10 ? secs : `0${secs}`}`
}

type Track = {
  url: string
  caption: string | null
}

type State = {
  playlist: Track[]
  state: 'play' | 'pause'
  currentTrack: number
  seek: string
  duration: string
  setPlaylist: (arg: State['playlist']) => State
  setState: (arg?: State['state']) => State
  setCurrentTrack: () => State
  setSeek: (arg: State['seek']) => State
  setDuration: (arg: State['duration']) => State
}
const usePlaylist = create<State>(
  persist(
    (set) => ({
      playlist: [],
      state: 'pause',
      currentTrack: 0,
      seek: '--:--',
      duration: '--:--',
      setPlaylist: (playlist) => set(() => ({ playlist })),
      setState: (state) => set((prev) => (state ? { state } : { state: prev.state === 'pause' ? 'play' : 'pause' })),
      setCurrentTrack: () => set((prev) => ({ currentTrack: (prev.currentTrack + 1) % prev.playlist.length })),
      setSeek: (seek) => set(() => ({ seek })),
      setDuration: (duration) => set(() => ({ duration })),
    }),
    'playlist',
  ),
)

export const Playlist: React.FC = () => {
  const [sound, setSound] = React.useState<Howl | null>(null)
  const { playlist, state, currentTrack, seek, duration } = usePlaylist(
    (s) => ({
      playlist: s.playlist,
      state: s.state,
      currentTrack: s.currentTrack,
      seek: s.seek,
      duration: s.duration,
    }),
    shallow,
  )
  const setPlaylist = usePlaylist((state) => state.setPlaylist)
  const setState = usePlaylist((state) => state.setState)
  const setCurrentTrack = usePlaylist((state) => state.setCurrentTrack)
  const setSeek = usePlaylist((state) => state.setSeek)
  const setDuration = usePlaylist((state) => state.setDuration)

  const getPlaylist = async () => {
    const res = await fetch('/api/playlist').then((x) => x.json())
    if (res.playlist) {
      setPlaylist(shuffleArray(res.playlist))
    }
  }
  React.useEffect(() => {
    const restoredPlaylist = typeof window === 'undefined' ? null : JSON.parse(sessionStorage.getItem('playlist'))

    if (!restoredPlaylist) {
      getPlaylist()
    } else {
      setPlaylist(restoredPlaylist.playlist)
    }
  }, [])

  React.useEffect(() => {
    if (playlist.length) {
      // Setup the new Howl.
      setSound(
        new Howl({
          src: [playlist[currentTrack].url],
          loop: true,
          autoplay: false,
          preload: true,
          html5: true,
          onend: function () {
            setSeek('--:--')
            setDuration('--:--')
            setState('pause')
            setCurrentTrack()
            setTimeout(() => setState('play'))
          },
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
      setDuration(secondsToMinutes(sound.duration()))
    }
  }, [sound?.duration()])

  const handlePlay = () => {
    setState()
  }
  const handleNext = () => {
    const prevState = state
    setSeek('--:--')
    setDuration('--:--')
    setState('pause')
    setCurrentTrack()
    if (prevState === 'play') setTimeout(() => setState('play'))
  }

  if (playlist.length === 0) {
    return (
      <Box className="space-y-4 theme-inverted animate-pulse">
        <h2>Listen to the Jam</h2>
        <div className="text-base">...</div>
      </Box>
    )
  }

  return (
    <>
      <Head>
        {playlist.map((track) => (track?.url ? <link key={track.url} rel="preload" href={track.url} /> : null))}
      </Head>
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
    </>
  )
}

export default React.memo(Playlist)
