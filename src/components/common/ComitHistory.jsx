import { useEffect, useState } from "react";

export default function CommitHistory() {
  const [latestCommit, setLatestCommit] = useState(null);

  useEffect(() => {
    async function fetchCommits() {
      try {
        const res = await fetch(
          "https://api.github.com/repos/SakutaTHZ/NT_Lyrics/commits?per_page=1"
        );
        const data = await res.json();
        setLatestCommit(data[0]); // only first commit
      } catch (err) {
        console.error("Error fetching commits:", err);
      }
    }
    fetchCommits();
  }, []);

  if (!latestCommit) {
    return <p className="mx-4">Loading latest commit...</p>;
  }

  return (
    <p>
      {latestCommit.commit.message}
    </p>
  );
}
