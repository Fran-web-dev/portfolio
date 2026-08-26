import { useEffect, useMemo, useState } from "react";
import { FiGitBranch, FiGithub, FiStar, FiUsers } from "react-icons/fi";

const USERNAME = "Fran2007";

const fallbackRepos = [
  {
    id: 1,
    name: "manager-link",
    description:
      "Full stack link manager with authentication, reusable UI patterns and a MongoDB-backed workflow.",
    html_url: "https://github.com/Fran2007/manager-link",
    stargazers_count: 0,
    forks_count: 0,
    language: "TypeScript",
  },
  {
    id: 2,
    name: "react-task-application",
    description:
      "Task management interface focused on fast CRUD flows, component structure and responsive UX.",
    html_url: "https://react-tasks-notify.netlify.app/",
    stargazers_count: 0,
    forks_count: 0,
    language: "JavaScript",
  },
  {
    id: 3,
    name: "ListOfBooks",
    description:
      "Interactive reading-list experience with filtering, state management and clean mobile layouts.",
    html_url: "https://listsofbooks.netlify.app/",
    stargazers_count: 0,
    forks_count: 0,
    language: "React",
  },
];

export default function GitHubInsights() {
  const [profile, setProfile] = useState(null);
  const [repos, setRepos] = useState(fallbackRepos);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    const controller = new AbortController();

    async function loadGitHub() {
      try {
        const [profileResponse, reposResponse] = await Promise.all([
          fetch(`https://api.github.com/users/${USERNAME}`, {
            signal: controller.signal,
          }),
          fetch(
            `https://api.github.com/users/${USERNAME}/repos?sort=updated&per_page=12`,
            { signal: controller.signal },
          ),
        ]);

        if (!profileResponse.ok || !reposResponse.ok) {
          throw new Error("GitHub API request failed.");
        }

        const [profileData, reposData] = await Promise.all([
          profileResponse.json(),
          reposResponse.json(),
        ]);

        const curatedRepos = reposData
          .filter((repo) => !repo.fork)
          .sort(
            (a, b) =>
              b.stargazers_count - a.stargazers_count ||
              new Date(b.updated_at).getTime() -
                new Date(a.updated_at).getTime(),
          )
          .slice(0, 3);

        setProfile(profileData);
        setRepos(curatedRepos.length ? curatedRepos : fallbackRepos);
        setStatus("ready");
      } catch (error) {
        if (error.name !== "AbortError") {
          setStatus("fallback");
        }
      }
    }

    loadGitHub();
    return () => controller.abort();
  }, []);

  const totals = useMemo(() => {
    return repos.reduce(
      (acc, repo) => ({
        stars: acc.stars + repo.stargazers_count,
        forks: acc.forks + repo.forks_count,
      }),
      { stars: 0, forks: 0 },
    );
  }, [repos]);

  const metrics = [
    {
      label: "Public repos",
      value: profile?.public_repos ?? "30+",
      icon: FiGithub,
    },
    {
      label: "Followers",
      value: profile?.followers ?? "Open",
      icon: FiUsers,
    },
    {
      label: "Stars",
      value: totals.stars,
      icon: FiStar,
    },
    {
      label: "Forks",
      value: totals.forks,
      icon: FiGitBranch,
    },
  ];

  return (
    <section
      id="github"
      className="scroll-mt-24 bg-[#0f141f] px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="section-eyebrow">Live GitHub API</p>
            <h2 className="section-title mt-3">Proof of work, pulled live.</h2>
          </div>
          <a
            href={`https://github.com/${USERNAME}`}
            target="_blank"
            rel="noreferrer"
            className="professional-button professional-button--ghost w-full sm:w-fit"
          >
            <FiGithub aria-hidden="true" />
            View profile
          </a>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {metrics.map((metric) => {
            const Icon = metric.icon;
            return (
              <div className="metric-card" key={metric.label}>
                <Icon className="text-xl text-[#7dd3fc]" aria-hidden="true" />
                <span className="mt-5 text-3xl font-semibold text-white">
                  {metric.value}
                </span>
                <span className="mt-1 text-sm text-slate-400">
                  {metric.label}
                </span>
              </div>
            );
          })}
        </div>

        <div className="mt-8 grid gap-5 lg:grid-cols-3">
          {repos.map((repo) => (
            <article className="project-card" key={repo.id}>
              <div className="flex items-start justify-between gap-4">
                <h3 className="text-xl font-semibold text-white">
                  {repo.name}
                </h3>
                <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-300">
                  {repo.language || "Code"}
                </span>
              </div>
              <p className="mt-4 min-h-24 text-sm leading-relaxed text-slate-300">
                {repo.description ||
                  "Repository with recent product engineering work."}
              </p>
              <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4 text-sm text-slate-400">
                <span className="inline-flex items-center gap-2">
                  <FiStar aria-hidden="true" /> {repo.stargazers_count}
                </span>
                <span className="inline-flex items-center gap-2">
                  <FiGitBranch aria-hidden="true" /> {repo.forks_count}
                </span>
                <a
                  href={repo.html_url}
                  target="_blank"
                  rel="noreferrer"
                  className="font-medium text-[#7dd3fc] transition hover:text-white"
                >
                  Open
                </a>
              </div>
            </article>
          ))}
        </div>

        <p className="mt-5 text-sm text-slate-500">
          {status === "loading"
            ? "Connecting to GitHub..."
            : status === "fallback"
              ? "Showing curated repositories while the GitHub API is unavailable."
              : "Repository data is loaded directly from the GitHub REST API."}
        </p>
      </div>
    </section>
  );
}
