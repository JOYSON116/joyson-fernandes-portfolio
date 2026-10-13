import { useEffect, useState } from "react";
import { GitBranch, Star, GitFork, ArrowUpRight } from "lucide-react";

export default function GithubActivity() {
  const [state, setState] = useState({
    status: "loading",
    user: null,
    repos: [],
  });
  useEffect(() => {
    let live = true;
    Promise.all([
      fetch("https://api.github.com/users/JOYSON116"),
      fetch(
        "https://api.github.com/users/JOYSON116/repos?sort=updated&per_page=6",
      ),
    ])
      .then(async ([u, r]) => {
        if (!u.ok || !r.ok) throw Error();
        return [await u.json(), await r.json()];
      })
      .then(
        ([user, repos]) => live && setState({ status: "ready", user, repos }),
      )
      .catch(
        () => live && setState({ status: "fallback", user: null, repos: [] }),
      );
    return () => {
      live = false;
    };
  }, []);
  if (state.status === "loading")
    return (
      <div className="github-live loading">
        Connecting to public GitHub activity…
      </div>
    );
  if (state.status === "fallback")
    return (
      <a
        className="github-live fallback"
        href="https://github.com/JOYSON116"
        target="_blank"
        rel="noreferrer"
      >
        <GitBranch size={20} />
        <span>
          <b>GitHub profile</b>
          <small>
            Live activity is unavailable right now. View the profile directly.
          </small>
        </span>
        <ArrowUpRight size={17} />
      </a>
    );
  return (
    <div className="github-live">
      <div className="github-head">
        <div>
          <GitBranch size={20} />
          <b>Live GitHub activity</b>
          <small>Public data from github.com/JOYSON116</small>
        </div>
        <div className="github-stats">
          <span>
            <b>{state.user.public_repos}</b> public repos
          </span>
          <span>
            <b>{state.user.followers}</b> followers
          </span>
        </div>
      </div>
      <div className="repo-row">
        {state.repos.map((repo) => (
          <a
            key={repo.id}
            href={repo.html_url}
            target="_blank"
            rel="noreferrer"
          >
            <b>{repo.name}</b>
            <p>{repo.description || "No description provided."}</p>
            <small>
              {repo.language || "—"}{" "}
              <span>
                <Star size={11} />
                {repo.stargazers_count}
              </span>
              <span>
                <GitFork size={11} />
                {repo.forks_count}
              </span>
            </small>
          </a>
        ))}
      </div>
    </div>
  );
}
