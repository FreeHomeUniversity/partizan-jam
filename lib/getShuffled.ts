export function shuffleArray<T>(array: Array<T>): Array<T> {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }

  return array
}

export default function getShuffled(length: number): Array<number> {
  const array = Array.from({ length }).map((_, idx) => idx)

  return shuffleArray<number>(array)
}
