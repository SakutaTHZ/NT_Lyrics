import axios from "axios";


export const apiUrl = import.meta.env.VITE_API_URL;
export const siteUrl = import.meta.env.VITE_SITE_URL;
// Artist
export const fetchTop10Artists = async (authToken) => {
  try {
    const res = await axios.get(
      `${apiUrl}/artists/getTopArtists`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      }
    );

    return res.data.topArtists.map((artist) => ({
      id: artist._id,
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
      `${apiUrl}/artists/getArtistOverview`,
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
      `${apiUrl}/artists/getArtistById/${artistId}`,
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
      `${apiUrl}/users/getUserOverview`,
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
      `${apiUrl}/lyrics/getLyricsOverview`,
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
      const res = await axios.get(`${apiUrl}/lyrics/getTopLyrics`, {
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
      const res = await fetch(`${apiUrl}/artists/getArtistsByType`);
      const data = await res.json();
      if (data.artists) {
        return data.artists
      } else {
        console.warn("No artists found in response:", data, type);
        return null
      }
    } catch (error) {
      console.error("Error fetching singers:", error);
    }
  };

  export const disableLyricById = async (lyricId, token) => {
    const response = await fetch(
      `${apiUrl}/lyrics/disableLyrics/${lyricId}`,
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

  export const enableLyricById = async (lyricId, token) => {
    const response = await fetch(
      `${apiUrl}/lyrics/enableLyrics/${lyricId}`,
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
      throw new Error(data.errors?.[0]?.message || "Failed to enable lyric");
    }
  
    return data;
  };

  export const changeUserValidity = async (userId, isValid, token) => {
    const response = await fetch(
      `${apiUrl}/users/${userId}?type=${
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
  

  export const changeLyricsEnableFlag = async (lyricId, token) => {
    const response = await fetch(
      `${apiUrl}/lyrics/changeEnableFlag/${lyricId}`,
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

  export const fetchLyricById = async (lyricId,token) => {
  try {
    const res = await axios.get(
      `${apiUrl}/lyrics/getLyricsById/${lyricId}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data;
  } catch (err) {
    console.error("Error fetching lyric by ID:", err);
  }
}

// Collection
export const addLyricsToCollection = async (lyricId, token) => {

  const response = await fetch(`${apiUrl}/collections/addToCollection`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ lyricsId: lyricId }), // double check this key name
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.errors?.[0]?.message || "Failed to add/remove lyric");
  }

  return data;
};

export const removeLyricsFromCollection = async (lyricId,group, token) => {

  const response = await fetch(`${apiUrl}/collections/removeFromGroup`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ lyricsId: lyricId,group: group }), // double check this key name
  });

  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.errors?.[0]?.message || "Failed to add/remove lyric");
  }

  return data;
};

export const fetchCollectionOverview = async (authToken) => {
  try {
    const res = await axios.get(
      `${apiUrl}/collections/getCollectionOverview`,
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

export const fetchPaymentOverview = async (authToken) => {
  try {
    const res = await axios.get(
      `${apiUrl}/paymentRequests/paymentOverview`,
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

export const fetchLyricsByGroup = async (group, authToken) => {
  try {
    const res = await axios.get(
      `${apiUrl}/collections/getLyricsByGroup?group=${group}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      }
    );
    return res.data.lyrics;
  } catch (err) {
    console.error("Error fetching lyrics by group:", err);
  }
}

export const validateUser = async (id,token) => {
  try {
    const res = await axios.get(`${apiUrl}/users/userProfile/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (err) {
    console.error("Error validating user:", err);

    localStorage.removeItem("user");
    localStorage.removeItem("token");

    window.location.href = "/login";
    
    throw err; // optionally let the caller handle this
  }
}

export const checkUserStatus = async (token) => {
  try {
    const res = await axios.get(`${apiUrl}/users/getcurrentUser`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (err) {
    console.error("Error validating user:", err);
    throw err; // optionally let the caller handle this
  }
}

export const addLyricToGroups = async (lyricId, groups, token) => {
  if (!Array.isArray(groups) || groups.length === 0) {
    throw new Error("Groups must be a non-empty array");
  }
  if (!lyricId || typeof lyricId !== "string") {
    throw new Error("Invalid lyricId");
  }
  if (!token || typeof token !== "string") {
    throw new Error("Invalid token");
  }

  const results = [];

  for (const group of groups) {
    const response = await fetch(`${apiUrl}/collections/addToGroup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ lyricsId: lyricId, group: group }), // Send one group at a time
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.errors?.[0]?.message || `Failed to add lyric to group: ${group}`);
    }

    results.push(data);
  }

  return results;
};

export const removeLyricFromGroups = async (lyricId, groups, token) => {
  if (!Array.isArray(groups) || groups.length === 0) {
    throw new Error("Groups must be a non-empty array");
  }
  if (!lyricId || typeof lyricId !== "string") {
    throw new Error("Invalid lyricId");
  }
  if (!token || typeof token !== "string") {
    throw new Error("Invalid token");
  }

  const results = [];

  for (const group of groups) {
    const response = await fetch(`${apiUrl}/collections/removeFromGroup`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ lyricsId: lyricId, group: group }), // Send one group at a time
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.errors?.[0]?.message || `Failed to remove lyric from group: ${group}`);
    }

    results.push(data);
  }

  return results;
}

export const lookForGroups = async (lyricId, token) => {
  if (!lyricId || !token) {
    throw new Error("Missing lyricId or token");
  }

  const collectionOverview = await fetchCollectionOverview(token);
  const groupNames = collectionOverview?.collections?.map((c) => c.group) || [];

  const matchedGroups = [];

  for (const group of groupNames) {
    const lyrics = await fetchLyricsByGroup(group, token);
    if (Array.isArray(lyrics)) {
      const found = lyrics.some((lyric) => lyric._id === lyricId);
      if (found) {
        matchedGroups.push(group);
      }
    }
  }

  return matchedGroups;
};

export const checkIfPaymentRequested = async (token) => {
  try {
    const res = await axios.get(`${apiUrl}/paymentRequests/checkPaymentExists`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (err) {
    console.error("Error checking payment request status:", err);
    throw err;
  }
}