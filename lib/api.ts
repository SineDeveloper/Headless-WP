import { GraphQLClient, gql } from 'graphql-request';

let client: GraphQLClient | null = null;

function getClient() {
  if (!client) {
    const API_URL = process.env.NEXT_PUBLIC_WORDPRESS_API_URL;
    if (!API_URL) {
      console.warn('NEXT_PUBLIC_WORDPRESS_API_URL is not defined');
      return null;
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    const authUser = process.env.WP_AUTH_USER;
    const authPass = process.env.WP_AUTH_PASS;

    if (authUser && authPass) {
      const auth = Buffer.from(`${authUser}:${authPass}`).toString('base64');
      headers['Authorization'] = `Basic ${auth}`;
    }

    // Ensure URL is clean
    const cleanUrl = API_URL.replace(/\/$/, '');

    try {
      client = new GraphQLClient(cleanUrl, { headers });
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
  } catch (error: any) {
    const is404 = error.response?.status === 404;
    const isTimeout = error.message?.includes('timeout') || error.response?.status === 504;
    const isCustomFieldMissing = error.message?.includes('Cannot query field "acf"') || error.message?.includes('Cannot query field "scf"');

    if (isCustomFieldMissing) {
      console.warn('SCHEMA WARNING: Custom fields (ACF/SCF) are missing from the GraphQL schema.');
      console.info('FALLBACK: Attempting to recover by stripping custom fields from the query...');
      
      // Attempt fallback: RE-TRY without custom fields to keep the app functional
      try {
        const fallingBackQuery = query.replace(/(acf|scf)\s*{[\s\S]*?}/g, '');
        const fallbackData = await apiClient.request(fallingBackQuery, variables);
        // Mark the data so the UI can detect it if needed
        if (fallbackData) {
          (fallbackData as any)._metadata_missing = true;
          console.info('RECOVERY SUCCESS: Core WordPress content retrieved successfully.');
        }
        return fallbackData;
      } catch (fallbackError) {
        console.error('RECOVERY FAILED: Could not retrieve even core WordPress content:', (fallbackError as any).message);
      }
    }

    if (is404) {
      console.error('CRITICAL: WordPress GraphQL Endpoint returned 404.');
      console.error('Target URL:', process.env.NEXT_PUBLIC_WORDPRESS_API_URL);
      console.error('Please verify:');
      console.error('1. The WPGraphQL plugin is installed AND ACTIVATED on your WordPress site.');
      console.error('2. Settings -> Permalinks is NOT set to "Plain". Use "Post name" instead.');
      console.error('3. If using LocalWP, ensure your "Live Link" tunnel is active and the URL matches exactly.');
    } else if (isTimeout) {
      console.error('TIMEOUT: The WordPress server took too long to respond. This is common with local tunnels (Localtunnel/ngrok).');
    } else {
      console.error('WordPress API Error:', error.message || error);
    }
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

export async function getHomePage() {
  const query = gql`
    query HomePage {
      page(id: "/", idType: URI) {
        id
        title
        content
        featuredImage {
          node {
            sourceUrl
          }
        }
        acf {
          subtitle
          hero_full_width
          system_id
          accent_color
        }
      }
    }
  `;

  const data: any = await fetchAPI(query);
  return data?.page;
}

export async function getPageBySlug(slug: string) {
  const query = gql`
    query PageBySlug($id: ID!, $idType: PageIdType!) {
      page(id: $id, idType: $idType) {
        id
        title
        content
        slug
        featuredImage {
          node {
            sourceUrl
          }
        }
        acf {
          subtitle
          hero_full_width
          system_id
          accent_color
        }
      }
    }
  `;

  // Ensure URI starts with a slash
  const uri = slug.startsWith('/') ? slug : `/${slug}`;
  const data: any = await fetchAPI(query, { id: uri, idType: 'URI' });
  return data?.page;
}
