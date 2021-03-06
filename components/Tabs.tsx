import * as React from 'react'
import { motion, useAnimation } from 'framer-motion'
import { css } from '@emotion/react'

import { Box } from './Box'

type TabsProps = {
  buttons: string[]
  tabs: string[]
  title?: string
}
export const Tabs: React.FC<TabsProps> = ({ tabs, buttons, title }) => {
  const [current, setCurrent] = React.useState<number>(0)
  const controls = useAnimation()

  if (tabs.length === 0) return null

  controls.start((i) => ({
    x: `-${(current * 100) / tabs.length}%`,
    transition: {
      x: { type: 'spring', stiffness: 300, damping: 200 },
    },
  }))

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
                onClick={() => idx !== current && setCurrent(idx)}
              >
                {button}
              </button>
            </Box>
          ))}
        </div>
      </div>
      <Box p={0} className="relative w-full overflow-hidden">
        <motion.div
          className="flex flex-row flex-no-wrap"
          animate={controls}
          style={{
            width: `${tabs.length * 100}%`,
          }}
        >
          {tabs.map((tab) => (
            <Box
              key={tab}
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
          ))}
        </motion.div>
      </Box>
    </>
  )
}

export default Tabs
