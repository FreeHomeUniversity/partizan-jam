import { css } from '@emotion/react'
import { Howl } from 'howler'
import Head from 'next/head'
import * as React from 'react'
import { useClickAway } from 'react-use'
import create from 'zustand'
import shallow from 'zustand/shallow'
import { shuffleArray } from '../lib/getShuffled'
import persist from '../lib/persist'
import Box from './Box'
import List from './List'
import Next from './Next'
import Pause from './Pause'
import Play from './Play'

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
  setPlaylist: (arg: State['playlist']) => State
  setState: (arg?: State['state']) => State
  setNextTrack: (next: number) => State
  setCurrentTrack: (current: number) => State
  setSeek: (arg: State['seek']) => State
}
const usePlaylist = create<State>(
  persist(
    (set) => ({
      playlist: [],
      state: 'pause',
      currentTrack: 0,
      seek: '--:--',
      setPlaylist: (playlist) => set(() => ({ playlist })),
      setState: (state) =>
        set((prev) =>
          state
            ? { state }
            : { state: prev.state === 'pause' ? 'play' : 'pause' },
        ),
      setNextTrack: (next) =>
        set((prev) => ({
          currentTrack: (prev.currentTrack + next) % prev.playlist.length,
        })),
      setCurrentTrack: (current) => set((prev) => ({ currentTrack: current })),
      setSeek: (seek) => set(() => ({ seek })),
    }),
    'playlist',
  ),
)

export const Playlist: React.FC = () => {
  const [sound, setSound] = React.useState<Howl | null>(null)
  const {
    playlist,
    state,
    currentTrack,
    seek,
    setPlaylist,
    setState,
    setNextTrack,
    setCurrentTrack,
    setSeek,
  } = usePlaylist(
    React.useCallback(
      (s) => ({
        playlist: s.playlist,
        state: s.state,
        currentTrack: s.currentTrack,
        seek: s.seek,
        setPlaylist: s.setPlaylist,
        setState: s.setState,
        setNextTrack: s.setNextTrack,
        setCurrentTrack: s.setCurrentTrack,
        setSeek: s.setSeek,
      }),
      [],
    ),
    shallow,
  )
  const prevState = React.useRef(state)
  const [openPlaylist, setOpenPlaylist] = React.useState(false)
  const ref = React.useRef<HTMLDivElement>(null)
  useClickAway(ref, () => setOpenPlaylist(false))

  const getPlaylist = async () => {
    const res = await fetch('/api/playlist').then((x) => x.json())
    if (res.playlist) {
      setPlaylist(shuffleArray(res.playlist))
    }
  }
  React.useEffect(() => {
    const restoredPlaylist =
      typeof window === 'undefined'
        ? null
        : JSON.parse(sessionStorage.getItem('playlist'))

    if (!restoredPlaylist) {
      getPlaylist()
    } else {
      setPlaylist(restoredPlaylist.playlist)
    }
  }, [])

  React.useEffect(() => {
    if (playlist.length) {
      setSeek('--:--')
      setState('pause')
      setSound(
        new Howl({
          src: [playlist[currentTrack].url],
          loop: false,
          autoplay: false,
          preload: true,
          html5: true,
          onend: function () {
            prevState.current = 'play'
            sound?.stop()
            sound?.unload()
            setSound(null)
            setNextTrack(1)
          },
          onplay: function () {
            setState('play')
          },
          onpause: function () {
            setState('pause')
            prevState.current = 'pause'
          },
        }),
      )
    }

    return () => {
      sound?.stop()
      sound?.unload()
      setSound(null)
    }
  }, [playlist.length, currentTrack])

  React.useEffect(() => {
    let interval
    if (state === 'play') {
      interval = setInterval(() => {
        if (!isNaN(sound?.seek())) {
          setSeek(secondsToMinutes(sound?.seek()))
        }
      }, 1000)
    } else if (prevState.current === 'play' && sound) {
      sound.play()
    }

    return () => {
      clearInterval(interval)
    }
  }, [!sound, state])

  const handlePlay = () => {
    if (state === 'play') {
      sound?.pause()
    } else {
      sound?.play()
    }
  }
  const handlePrev = () => {
    prevState.current = state
    sound?.stop()
    sound?.unload()
    setSound(null)
    setNextTrack(-1)
  }
  const handleNext = () => {
    prevState.current = state
    sound?.stop()
    sound?.unload()
    setSound(null)
    setNextTrack(1)
  }
  const handleCurrent = (idx: number) => {
    prevState.current = 'play'
    sound?.stop()
    sound?.unload()
    setSound(null)
    setCurrentTrack(idx)
  }

  if (playlist.length === 0) {
    return (
      <Box className="space-y-4 theme-inverted animate-pulse">
        <h2>RADIO PARTIZAN</h2>
        <div className="text-base">...</div>
      </Box>
    )
  }

  return (
    <>
      <Head>
        {playlist.map((track) =>
          track?.url ? (
            <link
              key={track.url}
              rel="preload"
              href={track.url}
              as="audio"
              type="audio/mp3"
              crossOrigin="true"
            />
          ) : null,
        )}
      </Head>
      <Box
        ref={ref}
        className="sticky isolate top-0 z-50 gap-4 items-center md:grid-cols-[min-content,1fr] theme-inverted"
      >
        <div className="flex flex-row items-center space-x-4">
          <h2 className="whitespace-nowrap">RADIO PARTIZAN</h2>
          <div
            className={`text-sm w-24 text-center ${
              !sound?.duration() ? 'opacity-50' : 'opacity-75'
            }`}
            css={css`
              font-variant-numeric: tabular-nums;
            `}
          >
            {seek} /{' '}
            {sound?.duration() ? secondsToMinutes(sound?.duration()) : '--:--'}
          </div>
          {playlist[currentTrack]?.url ? (
            <>
              <button
                className="inline-block transition-colors duration-300 ease-in-out opacity-75 cursor-pointer focus:outline-none hover:opacity-100"
                onClick={handlePrev}
                disabled={!sound}
              >
                <Next className="rotate-180" />
              </button>
              <button
                className="inline-block transition-colors duration-300 ease-in-out opacity-75 cursor-pointer focus:outline-none hover:opacity-100"
                onClick={handlePlay}
                disabled={!sound}
              >
                {state === 'play' ? <Pause /> : <Play />}
              </button>
              <button
                className="inline-block transition-colors duration-300 ease-in-out opacity-75 cursor-pointer focus:outline-none hover:opacity-100"
                onClick={handleNext}
                disabled={!sound}
              >
                <Next />
              </button>
              <button
                className="inline-block transition-colors duration-300 ease-in-out opacity-75 cursor-pointer focus:outline-none hover:opacity-100"
                onClick={() => setOpenPlaylist((c) => !c)}
                disabled={!playlist.length}
              >
                <List opened={openPlaylist} />
              </button>
            </>
          ) : null}
        </div>
        {playlist[currentTrack]?.caption ? (
          <div
            className="w-full text-base truncate opacity-75"
            dangerouslySetInnerHTML={{ __html: playlist[currentTrack].caption }}
          />
        ) : (
          <div className="text-base opacity-75">...</div>
        )}
        {openPlaylist && (
          <Box className="absolute left-0 right-0 z-50 md:max-w-xl max-h-[75vh] overflow-y-auto gap-2 top-full theme-inverted">
            {playlist.map((item, idx) => (
              <div
                key={item.url}
                className="flex items-center max-w-[calc(100vw-3rem)] md:max-w-[34rem] gap-2"
              >
                <button
                  className="inline-block transition-colors duration-300 ease-in-out opacity-75 cursor-pointer focus:outline-none hover:opacity-100"
                  onClick={() =>
                    state === 'play' && currentTrack === idx
                      ? sound?.pause()
                      : currentTrack === idx
                      ? sound?.play()
                      : handleCurrent(idx)
                  }
                  disabled={!sound}
                >
                  {state === 'play' && currentTrack === idx ? (
                    <Pause />
                  ) : (
                    <Play />
                  )}
                </button>
                <div
                  className="flex-1 truncate"
                  css={css`
                    font-weight: ${currentTrack === idx ? 'bold' : 'normal'};
                  `}
                >
                  {item.caption}
                </div>
              </div>
            ))}
          </Box>
        )}
      </Box>
    </>
  )
}

export default React.memo(Playlist)
