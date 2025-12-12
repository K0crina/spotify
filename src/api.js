let ACCESS_TOKEN = null;

export function setAccessToken(token) {
  ACCESS_TOKEN = token;
}

async function spotifyRequest(endpoint, params = {}) {
  if (!ACCESS_TOKEN) throw new Error("No access token set");

  const url = new URL(`https://api.spotify.com/v1/${endpoint}`);

  if (params.query) {
    Object.entries(params.query).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });
  }

  const res = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${ACCESS_TOKEN}`
    }
  });

  if (!res.ok) {
    const errText = await res.text();
    console.error("Spotify API error:", errText);
    throw new Error("Spotify API error");
  }

  return res.json();
}


//endpoint-uri

export const getUserProfile = () =>
  spotifyRequest("me");

export const getTopArtists = (limit = 5) =>
  spotifyRequest("me/top/artists", {
    query: {
      limit,
      time_range: "medium_term"
    }
  });

export const getTopTracks = (limit = 5) =>
  spotifyRequest("me/top/tracks", {
    query: {
      limit,
      time_range: "medium_term"
    }
  });

export const getRecentlyPlayed = (limit = 10) =>
  spotifyRequest("me/player/recently-played", {
    query: {
      limit
    }
  });


export const searchSpotify = (query, limit = 15) =>
  spotifyRequest("search", {
    query: {
      q: query,
      type: "track,artist,album",
      limit
    }
  });




