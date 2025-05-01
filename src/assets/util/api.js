import axios from "axios";

// Artist
export const fetchTop10Artists = async (authToken) => {
  try {
    const res = await axios.get(
      "http://localhost:3000/api/artists/getTopArtists",
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      }
    );

    return res.data.topArtists.map((artist) => ({
      photoLink: artist.photoLink,
      name: artist.name,
      searchCount: artist.searchCount,
    }));
  } catch (err) {
    console.error("Error fetching top 10 artists:", err);
    throw err; // optionally let the caller handle this
  }
};

export const fetchArtistOverview = async (authToken) => {
  try {
    const res = await axios.get(
      "http://localhost:3000/api/artists/getArtistOverview",
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      }
    );
    return {
      countDiff: res.data.totalCount,
      totalCount: res.data.totalCount,
      totalSingerCount: res.data.totalSingerCount,
      totalWrtierCount: res.data.totalWriterCount,
      totalBothCount: res.data.totalBothCount,
    };
  } catch (err) {
    console.error("Error fetching user overview:", err);
  }
};

export const fetchArtistById = async (authToken, artistId) => {
  try {
    const res = await axios.get(
      `http://localhost:3000/api/artists/getArtistById/${artistId}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      }
    );
    return res.data;
  } catch (err) {
    console.error("Error fetching artist by ID:", err);
  }
}

// User Overview
export const fetchUserOverview = async (authToken) => {
  try {
    const res = await axios.get(
      "http://localhost:3000/api/users/getUserOverview",
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      }
    );
    return res.data;
  } catch (err) {
    console.error("Error fetching user overview:", err);
  }
};

// Lyric Overview
export const fetchLyricOverview = async (authToken) => {
  try {
    const res = await axios.get(
      "http://localhost:3000/api/lyrics/getLyricsOverview",
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      }
    );
    return res.data;
  } catch (err) {
    console.error("Error fetching user overview:", err);
  }
};

export const fetchPopularLyrics = async (authToken) => {
    try {
      const res = await axios.get("http://localhost:3000/api/lyrics/getTopLyrics", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });
  
      const lyricsWithArtists = await Promise.all(
        res.data.topLyrics.map(async (lyric) => {
          const resolvedSingers = await Promise.all(
            lyric.singers.map(async (singerId) => {
              const artist = await fetchArtistById(authToken, singerId);
              return {
                name: artist?.name || "Unknown",
                photoLink: artist?.photoLink || null,
              };
            })
          );
  
          return {
            title: lyric.title,
            viewCount: lyric.viewCount,
            lyricsPhoto: lyric.lyricsPhoto,
            genre: lyric.genre,
            singers: resolvedSingers,
          };
        })
      );
  
      return lyricsWithArtists;
    } catch (err) {
      console.error("Error fetching top lyrics with artists:", err);
      throw err;
    }
  };
  
