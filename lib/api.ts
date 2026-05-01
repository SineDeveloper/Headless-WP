import { GraphQLClient, gql } from 'graphql-request';

let client: GraphQLClient | null = null;

function getClient() {
  if (!client) {
    const API_URL = process.env.NEXT_PUBLIC_WORDPRESS_API_URL;
    if (!API_URL) {
      console.warn('NEXT_PUBLIC_WORDPRESS_API_URL is not defined');
      return null;
    }

    const headers: Record<string, string> = {};
    const authUser = process.env.WP_AUTH_USER;
    const authPass = process.env.WP_AUTH_PASS;

    if (authUser && authPass) {
      const auth = Buffer.from(`${authUser}:${authPass}`).toString('base64');
      headers['Authorization'] = `Basic ${auth}`;
    }

    try {
      client = new GraphQLClient(API_URL, { headers });
    } catch (error) {
      console.error('Failed to initialize GraphQL client:', error);
      return null;
    }
  }
  return client;
}

export async function fetchAPI(query: string, variables = {}) {
  const apiClient = getClient();
  if (!apiClient) {
    return null;
  }
  try {
    const data = await apiClient.request(query, variables);
    return data;
  } catch (error) {
    console.error('Error fetching from WordPress API:', error);
    return null;
  }
}

export async function getAllPosts() {
  const query = gql`
    query AllPosts {
      posts(first: 20, where: { orderby: { field: DATE, order: DESC } }) {
        nodes {
          id
          title
          excerpt
          slug
          date
          featuredImage {
            node {
              sourceUrl
            }
          }
          author {
            node {
              name
              avatar {
                url
              }
            }
          }
        }
      }
    }
  `;

  const data: any = await fetchAPI(query);
  return data?.posts?.nodes || [];
}

export async function getPostBySlug(slug: string) {
  const query = gql`
    query PostBySlug($id: ID!, $idType: PostIdType!) {
      post(id: $id, idType: $idType) {
        id
        title
        content
        date
        slug
        featuredImage {
          node {
            sourceUrl
          }
        }
        author {
          node {
            name
            avatar {
              url
            }
          }
        }
      }
    }
  `;

  const data: any = await fetchAPI(query, { id: slug, idType: 'SLUG' });
  return data?.post;
}
