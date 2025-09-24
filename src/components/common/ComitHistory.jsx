import { useEffect, useState } from "react";

export default function CommitHistory() {
  const [commits, setCommits] = useState([]);

  useEffect(() => {
    async function fetchCommits() {
      try {
        const res = await fetch(
          "https://api.github.com/repos/SakutaTHZ/NT_Lyrics/commits"
        );
        const data = await res.json();
        setCommits(data);
      } catch (err) {
        console.error("Error fetching commits:", err);
      }
    }
    fetchCommits();
  }, []);

  return (
    <div className="mx-4">
      <ul>
        {commits.map((commit) => (
          <li key={commit.sha}>
            <strong>{commit.commit.author.name}</strong>:{" "}
            {commit.commit.message} <br />
            <small>{new Date(commit.commit.author.date).toLocaleString()}</small>
          </li>
        ))}
      </ul>
    </div>
  );
}
