import Prismic from 'prismic-javascript'

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

async function fetchAPI(query, { previewData, variables }: any = {}) {
  const prismicAPI = await PrismicClient.getApi()
  const res = await fetch(
    `${GRAPHQL_API_URL}?query=${query}&variables=${JSON.stringify(variables)}`,
    {
      headers: {
        'Prismic-Ref': previewData?.ref || prismicAPI.masterRef.ref,
        'Content-Type': 'application/json',
        'Accept-Language': API_LOCALE,
        Authorization: `Token ${API_TOKEN}`,
      },
    }
  )

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
  `
    query HomepageQuery {
      allHomepages {
        edges {
          node {
            title
            description
            image
          }
        }
      }
    }
  `,
    { previewData }
  )

  return data.allHomepages.edges[0].node
}

export async function getAllSongs(previewData) {
  const data = await fetchAPI(
  `
    query AllSongsQuery {
      allSongs {
        edges {
          node {
            title
            description
            video
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
    { previewData }
  )

  return data.allSongs?.edges || [];
}

export async function getSong(uid, previewData) {
  const data = await fetchAPI(
  `
    query SongQuery($uid: String!) {
      allSongs(uid: $uid) {
        edges {
          node {
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
    { previewData, variables: { uid } }
  )

  return data.allSongs.edges?.[0]?.node;
}

export const FHUClient = Prismic.client(FHU_API_URL, {
  accessToken: FHU_API_TOKEN,
})

export async function getAboutFHU() {
  const api = await FHUClient.getApi()
  const { results } = await api.query(
    Prismic.Predicates.at('document.type', 'about')
  )

  return results[0]
}

export async function getAboutTEPJ() {
  const api = await FHUClient.getApi()
  const { results } = await api.query(
    Prismic.Predicates.at('my.text.uid', 'transeuropean-parizan-jam')
  )

  return results[0]
}

export async function getAboutKots() {
  const api = await FHUClient.getApi()
  const { results } = await api.query(
    Prismic.Predicates.at('my.text.uid', 'arkadiy-kots-band')
  )

  return results[0]
}
