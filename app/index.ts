// Load from ENV

const _userAgent: string | undefined = process.env.USER_AGENT;
const _xIgAppId: string | undefined = process.env.X_IG_APP_ID;
// const _cookie = process.env.COOKIE;
// const _csrfToken: string | undefined = process.env.CSRF_TOKEN;

if (!_userAgent || !_xIgAppId) {
  console.error("Required headers not found in ENV");
  process.exit(1);
}

// Function to get instagram post ID from URL string
const getId = (url: string): string | null => {
  const regex =
    /instagram.com\/(?:[A-Za-z0-9_.]+\/)?(p|reels|reel|stories)\/([A-Za-z0-9-_]+)/;
  const match = url.match(regex);
  return match && match[2] ? match[2] : null;
};

interface InstagramGraphqlResponse {
  __typename?: string;
  shortcode?: string;
  dimensions?: {
    height: number;
    width: number;
  };
  display_url?: string;
  display_resources?: Array<{
    src: string;
    config_width: number;
    config_height: number;
  }>;
  has_audio?: boolean;
  video_url?: string;
  video_view_count?: number;
  video_play_count?: number;
  is_video?: boolean;
  caption?: string;
  is_paid_partnership?: boolean;
  location?: {
    id: string;
    name: string;
  };
  owner?: {
    id: string;
    username: string;
  };
  product_type?: string;
  video_duration?: number;
  thumbnail_src?: string;
  clips_music_attribution_info?: unknown;
  sidecar?: Array<unknown>;
}

// Function to get instagram data from URL string
export const getInstagramGraphqlData = async (
  url: string
): Promise<InstagramGraphqlResponse | string> => {
  const igId = getId(url);
  if (!igId) return "Invalid URL";

  // Fetch graphql data from instagram post
  const graphql = new URL(`https://www.instagram.com/api/graphql`);
  graphql.searchParams.set("variables", JSON.stringify({ shortcode: igId }));
  graphql.searchParams.set("doc_id", "10015901848480474");
  graphql.searchParams.set("lsd", "AVqbxe3J_YA");

  const response = await fetch(graphql, {
    method: "POST",
    headers: {
      "User-Agent": _userAgent,
      "Content-Type": "application/x-www-form-urlencoded",
      "X-IG-App-ID": _xIgAppId,
      "X-FB-LSD": "AVqbxe3J_YA",
      "X-ASBD-ID": "129477",
      "Sec-Fetch-Site": "same-origin",
    },
  });

  const json = await response.json();
  const items = json?.data?.xdt_shortcode_media;
  // You can return the entire items or create your own JSON object from them
  // return items;

  // Return custom json object
  return {
    __typename: items?.__typename,
    shortcode: items?.shortcode,
    dimensions: items?.dimensions,
    display_url: items?.display_url,
    display_resources: items?.display_resources,
    has_audio: items?.has_audio,
    video_url: items?.video_url,
    video_view_count: items?.video_view_count,
    video_play_count: items?.video_play_count,
    is_video: items?.is_video,
    caption: items?.edge_media_to_caption?.edges[0]?.node?.text,
    is_paid_partnership: items?.is_paid_partnership,
    location: items?.location,
    owner: items?.owner,
    product_type: items?.product_type,
    video_duration: items?.video_duration,
    thumbnail_src: items?.thumbnail_src,
    clips_music_attribution_info: items?.clips_music_attribution_info,
    sidecar: items?.edge_sidecar_to_children?.edges,
  };
};

// interface GetByUsernameOptions {
//   pageSize?: number;
//   includeFeedVideo?: boolean;
//   csrfToken?: string;
//   xcsrfToken?: string;
// }

export const getByUsername = async (
  username: string,
  targetUserId: string
): Promise<string[] | null> => {
  // Default headers for Instagram GraphQL API

  // Required parameters for the API request

  try {
    const userId = targetUserId;
    const body = `av=17841472271385147&__d=www&__user=0&__a=1&__req=7o&__hs=20116.HYP%3Ainstagram_web_pkg.2.1.0.0.1&dpr=2&__ccg=GOOD&__rev=1019638294&__s=e7kx0i%3A9p2kh4%3Aeog9dw&__hsi=7465027097652423254&__dyn=7xeUjG1mxu1syUbFp41twpUnwgU7SbzEdF8aUco2qwJxS0k24o1DU2_CwjE1EE2Cw8G11wBz81s8hwGxu786a3a1YwBgao6C0Mo2iyo7u3ifK0EUjwGzEaE2iwNwmE2eUlwhEe87q0nKq2-azqwt8d-2u2J0bS1LwTwKG1pg2fwxyo6O1FwlEcUed6goK2O4Xxui2qi7E5y4UrwHwGwa6bBK4o&__csr=gqjMQx48N7bMPNkizqd8OinkGfAHiWaH8-n9mGRAlkmWJF9LHi9p4Wiy8H8iiLGDGKmqAHWAKfAhV9WKWABFbAKq8RBZ4FeV8N4yfGp95ACzuq4VA9DVF8oyqGHga4UiUj-qqDQEhLK9Knlox5hUyuqm9GexvGqqdoG4ufAiK9x7xupaQ4U01euU2GAu1Xggp9Qigg0C83xIAxU2No882iXw8JyomwFw2Zp81vo0xi0ly08qCg4i44dh1cw2sEErwctt3A2E-pp1o4WhCAJo6e8ocAymV8do4x0sr9g464Eip9A9w9bwSgbE3bw86q0yQ8ojg80z2e2e2q0BE0nKAu01r3w3LU1go&__comet_req=7&fb_dtsg=NAcMLh94Hpdh0q5Aw0YY9_e8j7ikyNWZwrLaDaNu8GMAGWMAzEX4OZg%3A17843676607167008%3A1737927345&jazoest=26153&lsd=_h2x2eACSXWcKFIwn5nSlh&__spin_r=1019638294&__spin_b=trunk&__spin_t=1738087064&fb_api_caller_class=RelayModern&fb_api_req_friendly_name=PolarisProfileReelsTabContentQuery_connection&variables=%7B%22after%22%3A%22QVFBNHpieGItdERKOVNVTVNqWjdFR18wMk5tNm9UQzdvVS1zd3NkZzNjdEhaT1pBQ2k4dlZEUXBuMVNDZnZycWxpXzdjU2E4MXVVQzUwWDlzS3l1azBVZw%3D%3D%22%2C%22before%22%3Anull%2C%22data%22%3A%7B%22include_feed_video%22%3Atrue%2C%22page_size%22%3A12%2C%22target_user_id%22%3A%22${userId}%22%7D%2C%22first%22%3A3%2C%22last%22%3Anull%7D&server_timestamps=true&doc_id=8515196628595751`;
    // const reqbody = body.replace("${userId}", targetUserId);
    const response = await fetch("https://www.instagram.com/graphql/query", {
      headers: {
        accept: "*/*",
        "accept-language": "en-GB,en-US;q=0.9,en;q=0.8",
        "content-type": "application/x-www-form-urlencoded",
        priority: "u=1, i",
        "sec-ch-prefers-color-scheme": "light",
        "sec-ch-ua":
          '"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
        "sec-ch-ua-full-version-list":
          '"Google Chrome";v="131.0.6778.265", "Chromium";v="131.0.6778.265", "Not_A Brand";v="24.0.0.0"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-model": '""',
        "sec-ch-ua-platform": '"macOS"',
        "sec-ch-ua-platform-version": '"15.2.0"',
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "x-asbd-id": "129477",
        "x-bloks-version-id":
          "0e060251e1b0f688757fc85e86223bcf86d771ecddaa2fe9f1d86dabd2eda227",
        "x-csrftoken": "plwf2qQJbr2RLHolyfFQhM6K7S2Yn0fZ",
        "x-fb-friendly-name": "PolarisProfileReelsTabContentQuery_connection",
        "x-fb-lsd": "_h2x2eACSXWcKFIwn5nSlh",
        "x-ig-app-id": "936619743392459",
        cookie:
          'datr=u5qWZzl8AsV5WljCbaTb1mGZ; ig_did=EA8A1FBA-2613-49A1-A41C-31061EAF2129; mid=Z5aauwAEAAE5c1KeninP8s0DUOEF; ig_nrcb=1; ps_l=1; ps_n=1; csrftoken=plwf2qQJbr2RLHolyfFQhM6K7S2Yn0fZ; ds_user_id=72281177046; sessionid=72281177046%3Add1Yh28AzQTP1K%3A25%3AAYdf_mX-G4CsezCEDr19QwwoBRhbyWxtmG2fqZkqIg; wd=554x812; rur="CLN\\05472281177046\\0541769627310:01f74ed89ec8a65a5a6570d928176072d1584f6fdf4249979b20f1a14320cfd7e1ab38fd"',
        Referer: "https://www.instagram.com/bhuvan.bam22/reels/",
        "Referrer-Policy": "strict-origin-when-cross-origin",
      },
      body: body,
      method: "POST",
    });

    if (!response.ok) {
      throw new Error(`Request failed with status: ${response.status}`);
    }

    const data = await response.json();
    const edges = data?.data?.xdt_api__v1__clips__user__connection_v2?.edges;
    const nodes = edges?.map(
      (edge: { node: { media: { code: string } } }) => edge?.node?.media?.code
    );
    console.log(nodes);
    return nodes;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error fetching Instagram data:", error.message);
    }
    return null;
  }
};

// const options: GetByUsernameOptions = {
//   pageSize: 20,
//   includeFeedVideo: true,
//   csrfToken: _csrfToken,
//   xcsrfToken:"plwf2qQJbr2RLHolyfFQhM6K7S2Yn0fZ"
// };

// const nodes = await getByUsername("carlossainz55", 220765521, options);

export const getUserIdByUsername = async (
  username: string
): Promise<string> => {
  try {
    console.log(username, "username is");
    const response = await fetch(
      `https://www.instagram.com/web/search/topsearch/?query=${username}`,
      {
        headers: {
          accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
          "accept-language": "en-GB,en-US;q=0.9,en;q=0.8",
          "cache-control": "max-age=0",
          dpr: "2",
          priority: "u=0, i",
          "sec-ch-prefers-color-scheme": "light",
          "sec-ch-ua":
            '"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
          "sec-ch-ua-full-version-list":
            '"Google Chrome";v="131.0.6778.265", "Chromium";v="131.0.6778.265", "Not_A Brand";v="24.0.0.0"',
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-model": '""',
          "sec-ch-ua-platform": '"macOS"',
          "sec-ch-ua-platform-version": '"15.2.0"',
          "sec-fetch-dest": "document",
          "sec-fetch-mode": "navigate",
          "sec-fetch-site": "none",
          "sec-fetch-user": "?1",
          "upgrade-insecure-requests": "1",
          "viewport-width": "554",
          cookie:
            'datr=u5qWZzl8AsV5WljCbaTb1mGZ; ig_did=EA8A1FBA-2613-49A1-A41C-31061EAF2129; mid=Z5aauwAEAAE5c1KeninP8s0DUOEF; ig_nrcb=1; ps_l=1; ps_n=1; csrftoken=plwf2qQJbr2RLHolyfFQhM6K7S2Yn0fZ; ds_user_id=72281177046; sessionid=72281177046%3Add1Yh28AzQTP1K%3A25%3AAYdf_mX-G4CsezCEDr19QwwoBRhbyWxtmG2fqZkqIg; wd=554x812; rur="CLN\\05472281177046\\0541769629496:01f7d79f4aeae993554097cfa5c85b97813ed6ea4e70171b8e441135e02a0bae2faf8890"',
        },
        referrerPolicy: "strict-origin-when-cross-origin",
        body: null,
        method: "GET",
      }
    );
    console.log(response, "response is");
    const data = await response.json();
    const userId = data?.users[0]?.user?.pk;
    console.log(userId, "user id is");
    if (!userId) {
      throw new Error("no user found");
    }
    return userId;
  } catch (error) {
    console.log(error, "error is");
    return "";
  }
};

export const getVideosByUserName = async (
  username: string
): Promise<(InstagramGraphqlResponse | string)[]> => {
  const userId = await getUserIdByUsername(username);
  console.log(userId, "user id is");
  const videosId = await getByUsername(username, userId);
  console.log(videosId, "videos is is");
  if (!videosId) {
    return [];
  }
  const videosData = await Promise.all(
    videosId.map(async (videoId: string) => {
      const videoData = await getInstagramGraphqlData(
        `https://www.instagram.com/reel/${videoId}/`
      );
      // console.log(videoData);
      return videoData;
    })
  );
  return videosData;
};
