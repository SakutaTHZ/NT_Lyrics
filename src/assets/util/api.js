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
  
      return res.data.topLyrics;
    } catch (err) {
      console.error("Error fetching top lyrics with artists:", err);
      throw err;
    }
  };
  
 export const fetchSingers = async (type) => {
    try {
      const res = await fetch(`http://localhost:3000/api/artists/getArtistsByType?type=${type}`);
      const data = await res.json();
      if (data.artists) {
        return data.artists
      } else {
        console.warn("No artists found in response:", data);
        return null
      }
    } catch (error) {
      console.error("Error fetching singers:", error);
    }
  };

  export const disableLyricById = async (lyricId, token) => {
    const response = await fetch(
      `http://localhost:3000/api/lyrics/disableLyrics/${lyricId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
  
    const data = await response.json();
  
    if (!response.ok) {
      throw new Error(data.errors?.[0]?.message || "Failed to disable lyric");
    }
  
    return data;
  };

  export const changeUserValidity = async (userId, isValid, token) => {
    const response = await fetch(
      `http://localhost:3000/api/users/${userId}?type=${
        isValid ? "activate" : "deactivate"
      }`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to update user validity");
    }
  };