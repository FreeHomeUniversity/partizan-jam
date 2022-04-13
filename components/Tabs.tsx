import { css } from '@emotion/react'
import { AnimatePresence, motion } from 'framer-motion'
import * as React from 'react'
import { Box } from './Box'

type TabsProps = {
  buttons: string[]
  tabs: string[]
  title?: string
}
export const Tabs: React.FC<TabsProps> = ({ tabs, buttons, title }) => {
  const [[current, direction], setCurrent] = React.useState<[number, number]>([0, 0])

  if (tabs.length === 0) return null

  return (
    <>
      <div className="flex flex-row">
        {title && (
          <Box className="px-8">
            <h1 className="text-5xl font-bold">{title}</h1>
          </Box>
        )}
        <div className="flex flex-row ml-auto">
          {buttons.map((button, idx) => (
            <Box
              key={button}
              className={`px-8 ${
                idx !== current
                  ? 'transition-colors duration-300 ease-out hover:bg-theme-blue-600 hover:text-white'
                  : 'text-theme-red-600'
              }`}
            >
              <button
                className={`text-2xl font-bold outline-none focus:outline-none  ${
                  idx !== current ? 'cursor-pointer' : 'cursor-default'
                }`}
                onClick={() => idx !== current && setCurrent((prev) => [idx, prev[0] > idx ? 1 : -1])}
              >
                {button}
              </button>
            </Box>
          ))}
        </div>
      </div>
      <Box p={0} className="relative w-full overflow-hidden">
        <div className="flex flex-row flex-no-wrap w-[200%] overflow-hidden">
          <Tab tab={tabs[current]} current={current} direction={direction} />
        </div>
      </Box>
    </>
  )
}

export default Tabs

const Tab = React.memo(function Tab({ tab, current, direction }: { tab: string; current: number; direction: number }) {
  const variants = {
    enter: (direction: number) => {
      return {
        x: direction > 0 ? '-200%' : '0%',
      }
    },
    center: (direction: number) => {
      return {
        x: direction > 0 ? '-100%' : '-100%',
        transitionEnd: {
          x: '0%',
        },
      }
    },
    exit: (direction: number) => {
      return {
        x: direction < 0 ? '-100%' : '100%',
      }
    },
  }

  const [transition] = React.useState(() => ({
    x: { duration: 1.2, type: 'tween' },
  }))

  return (
    <AnimatePresence initial={false} custom={direction}>
      {tab ? (
        <motion.div
          key={current}
          className="w-1/2"
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={transition}
        >
          <Box
            className="content-center w-full"
            css={css`
              align-content: flex-start;
            `}
          >
            <div
              className="prose"
              css={css`
                @media (min-width: 768px) {
                  font-size: 1.125rem;
                  line-height: 1.7777778;
                }
                @media (min-width: 1024px) {
                  font-size: 1.25rem;
                  line-height: 1.8;
                }
              `}
              dangerouslySetInnerHTML={{ __html: tab }}
            />
          </Box>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
})
