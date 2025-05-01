// useArtistOverview.js
import { useEffect, useState, useCallback } from "react";
import axios from "axios";

export const useArtistOverview = (token) => {
  const [artistCounts, setArtistCounts] = useState({
    countDiff: 0,
    totalCount: 0,
    totalSingerCount: 0,
    totalWrtierCount: 0,
    totalBothCount: 0,
  });

  const fetchOverview = useCallback(async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/artists/getArtistOverview", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      setArtistCounts({
        countDiff: res.data.totalCount,
        totalCount: res.data.totalCount,
        totalSingerCount: res.data.totalSingerCount,
        totalWrtierCount: res.data.totalWriterCount,
        totalBothCount: res.data.totalBothCount,
      });
    } catch (err) {
      console.error("Error fetching artist overview:", err);
    }
  }, [token]);

  useEffect(() => {
    fetchOverview();
  }, [fetchOverview]);

  return { artistCounts, fetchOverview };
};
