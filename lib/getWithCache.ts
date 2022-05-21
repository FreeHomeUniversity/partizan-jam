import fetch from 'cross-fetch'
import fs from 'fs'
import path from 'path'

type Nilable<T> = T | null | undefined
type ValueOf<T> = T[keyof T]

const CACHE_FOLDER_PATH = path.resolve(process.cwd(), '.next/cache')
export const SERVER_FOLDER_PATH = path.resolve(process.cwd(), '.next/server/pages')

export async function getWithCacheByUID<InputType, ResultType>({
  fn,
  find,
  uid,
  skipCache,
}: {
  fn: (skipCache?: boolean) => Promise<InputType>
  find: (item: InputType) => ResultType | null
  uid: Nilable<string>
  skipCache?: boolean
}): Promise<ResultType | null> {
  if (!uid) return null

  const xs = await fn(skipCache)
  let x = find(xs)

  if (!x && !skipCache) {
    x = await getWithCacheByUID({ fn, find, uid, skipCache: true })
  }

  return x
}

export function getCached<PageProps, DataType = ValueOf<PageProps>>(
  fn: (...args: any) => Promise<DataType>,
  pathname: string,
  propKey: keyof PageProps,
) {
  return async function getWithCache(skipCache?: boolean): Promise<DataType> {
    if (!skipCache) {
      if (process.env.NODE_ENV === 'development' || process.env.TEST_NODE_ENV === 'development') {
        try {
          const cache = fs.readFileSync(path.join(CACHE_FOLDER_PATH, `.${pathname}`), 'utf8')

          if (cache) {
            console.log(`Read from ${pathname} cache`)
            return JSON.parse(cache) as DataType
          }
        } catch {
          console.log('There is not cache for this query yet')
        }
      } else {
        try {
          let cache
          if (process.env.VERCEL_URL) {
            const res = await fetch(
              `${`${`https://${process.env.VERCEL_URL}`}/_next/data/${
                process.env.VERCEL_GIT_COMMIT_SHA
              }`}/${pathname}.json`,
            )
            cache = await res.json()
          } else {
            cache = JSON.parse(fs.readFileSync(path.join(SERVER_FOLDER_PATH, `${pathname}.json`), 'utf8'))
          }

          console.log(`Read from ${pathname}.json`)
          return (cache?.pageProps as PageProps)?.[propKey] as unknown as DataType
        } catch {
          console.log('There is not this page yet', pathname)
        }
      }
    }

    const data = await fn()

    if (process.env.NODE_ENV === 'development' || process.env.TEST_NODE_ENV === 'development') {
      try {
        fs.writeFileSync(path.join(CACHE_FOLDER_PATH, `.${pathname}`), JSON.stringify(data), 'utf8')
        console.log(`Wrote to ${pathname} cache at`, path.join(CACHE_FOLDER_PATH, `.${pathname}`))
      } catch (error) {
        console.error(error)
      }
    }

    return data
  }
}
