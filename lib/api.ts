import { RichText } from 'prismic-dom'
import Prismic from 'prismic-javascript'
import { getCached, getWithCacheByUID } from './getWithCache'

const REPOSITORY = process.env.PRISMIC_REPOSITORY_NAME
const FHU_API_URL = `https://${process.env.FHU_REPOSITORY_NAME}.prismic.io/api/v2`
const REF_API_URL = `https://${REPOSITORY}.prismic.io/api/v2`
const GRAPHQL_API_URL = `https://${REPOSITORY}.prismic.io/graphql`
// export const API_URL = 'https://your-repo-name.cdn.prismic.io/api/v2'
export const FHU_API_TOKEN = process.env.FHU_API_TOKEN
export const API_TOKEN = process.env.PRISMIC_API_TOKEN
export const API_LOCALE = process.env.PRISMIC_REPOSITORY_LOCALE

export const PrismicClient = Prismic.client(REF_API_URL, {
  accessToken: API_TOKEN,
})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function fetchAPI(query, { previewData, variables }: any = {}) {
  const prismicAPI = await PrismicClient.getApi()

  const res = await fetch(`${GRAPHQL_API_URL}?query=${encodeURIComponent(query)}&variables=${encodeURIComponent(JSON.stringify(variables || {}))}`, {
    headers: {
      'Prismic-Ref': previewData?.ref || prismicAPI.masterRef.ref,
      'Content-Type': 'application/json',
      // 'Accept-Language': API_LOCALE,
      Authorization: `Token ${API_TOKEN}`,
    },
  })

  if (res.status !== 200) {
    console.log(await res.text())
    throw new Error('Failed to fetch API')
  }

  const json = await res.json()
  if (json.errors) {
    console.error(json.errors)
    throw new Error('Failed to fetch API')
  }
  return json.data
}

export async function getHomepage(previewData) {
  const data = await fetchAPI(
    /* GraphQL */ `
      query HomepageQuery {
        allHomepages {
          edges {
            node {
              title
              description
              image
              playlist {
                track {
                  ... on _FileLink {
                    name
                    url
                    size
                  }
                }
                track_caption
              }
            }
          }
        }
      }
    `,
    { previewData },
  )

  return data.allHomepages.edges[0].node
}

export async function getAllSongs(previewData) {
  const data = await fetchAPI(
    /* GraphQL */ `
      query AllSongsQuery {
        allSongs {
          edges {
            node {
              title
              description
              video
              musicians {
                ... on SongMusicians {
                  musician {
                    ... on Musician {
                      title
                      description
                      image
                      _meta {
                        id
                        uid
                      }
                    }
                  }
                }
              }
              artist {
                ... on Artist {
                  title
                  description
                  image
                  body {
                    ... on ArtistBodyArtwork {
                      primary {
                        artwork_title
                        artwork_description
                        artwork_image
                      }
                      fields {
                        artwork_slider_image
                        artwork_slider_description
                      }
                    }
                  }
                  _meta {
                    id
                    uid
                  }
                }
              }
              _meta {
                id
                uid
                tags
              }
            }
          }
        }
      }
    `,
    { previewData },
  )

  return data.allSongs.edges || []
}

export async function getSong(uid, previewData) {
  const data = await fetchAPI(
    /* GraphQL */ `
      query SongQuery($uid: String!, $lang: String!) {
        song(uid: $uid, lang: $lang) {
          title
          description
          video
          story {
            ... on Story {
              title
              description
              stories {
                language
                text
              }
              _meta {
                id
                uid
              }
            }
          }
          musicians {
            ... on SongMusicians {
              musician {
                ... on Musician {
                  title
                  description
                  image
                  _meta {
                    id
                    uid
                  }
                }
              }
            }
          }
          artist {
            ... on Artist {
              title
              description
              image
              body {
                ... on ArtistBodyArtwork {
                  primary {
                    artwork_title
                    artwork_description
                    artwork_image
                  }
                  fields {
                    artwork_slider_image
                    artwork_slider_description
                  }
                }
              }
              _meta {
                id
                uid
              }
            }
          }
          _meta {
            id
            uid
            tags
          }
        }
      }
    `,
    { previewData, variables: { uid, lang: API_LOCALE } },
  )

  return data.song
}

export async function getAllMusicians(previewData) {
  const data = await fetchAPI(
    /* GraphQL */ `
      query AllMusiciansQuery {
        allMusicians {
          edges {
            node {
              title
              description
              image
              _meta {
                id
                uid
              }
            }
          }
        }
      }
    `,
    { previewData },
  )

  return data.allMusicians.edges || []
}

export async function getMusician(uid, previewData) {
  const data = await fetchAPI(
    /* GraphQL */ `
      query MusicianQuery($uid: String!, $lang: String!) {
        musician(uid: $uid, lang: $lang) {
          title
          description
          image
          _meta {
            id
            uid
          }
        }
      }
    `,
    { previewData, variables: { uid, lang: API_LOCALE } },
  )

  return data.musician
}

export async function getAllArtists(previewData) {
  const data = await fetchAPI(
    /* GraphQL */ `
      query AllArtistsQuery {
        allArtists {
          edges {
            node {
              title
              description
              image
              _meta {
                id
                uid
              }
            }
          }
        }
      }
    `,
    { previewData },
  )

  return data.allArtists.edges || []
}

export async function getArtist(uid, previewData) {
  const data = await fetchAPI(
    /* GraphQL */ `
      query ArtistQuery($uid: String!, $lang: String!) {
        artist(uid: $uid, lang: $lang) {
          title
          description
          image
          body {
            ... on ArtistBodyArtwork {
              primary {
                artwork_title
                artwork_description
                artwork_image
              }
              fields {
                artwork_slider_image
                artwork_slider_description
              }
            }
          }
          _meta {
            id
            uid
          }
        }
      }
    `,
    { previewData, variables: { uid, lang: API_LOCALE } },
  )

  return data.artist
}

export async function getAllByID(IDs: string[], previewData?: any) {
  const data = await fetchAPI(
    /* GraphQL */ `
      query getAll($IDs: [String!]) {
        _allDocuments(id_in: $IDs) {
          edges {
            node {
              _meta {
                id
                uid
                type
              }
            }
          }
        }
      }
    `,
    { previewData, variables: { IDs, lang: API_LOCALE } },
  )

  return data._allDocuments.edges || []
}

export const FHUClient = Prismic.client(FHU_API_URL, {
  accessToken: FHU_API_TOKEN,
})

export async function getAboutFHU() {
  const api = await FHUClient.getApi()
  const { results } = await api.query(Prismic.Predicates.at('document.type', 'about'))

  return results[0]
}

export async function getAboutTEPJ() {
  const api = await FHUClient.getApi()
  const { results } = await api.query(Prismic.Predicates.at('my.text.uid', 'transeuropean-parizan-jam'))

  return results[0]
}

export async function getAboutKots() {
  const api = await FHUClient.getApi()
  const { results } = await api.query(Prismic.Predicates.at('my.text.uid', 'arkadiy-kots-band'))

  return results[0]
}

export const getCachedHomepage = getCached(getHomepage, 'index', 'homepage')

export async function getPlaylist() {
  const homepage = await getCachedHomepage()
  return homepage.playlist.map(({ track, track_caption }) => ({
    url: track.url,
    caption: RichText.asText(track_caption || []),
  }))
}
