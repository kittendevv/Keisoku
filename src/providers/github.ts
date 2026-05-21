export async function fetchGithubStars(repo: string) {
  const res = await fetch(`https://api.github.com/repos/${repo}`);
  const data = await res.json();
  return data.stargazers_count;
}

export async function fetchGithubForks(repo: string) {
  const res = await fetch(`https://api.github.com/repos/${repo}`);
  const data = await res.json();
  return data.forks_count;
}

export async function fetchGithubPackageDownloads(repo: string, pkg: string) {
  const res = await fetch(`https://github.com/${repo}/pkgs/container/${pkg}`);
  const html = await res.text();
  let totalDownloadsMatch = html.match(
    /<span[^>]*>Total downloads<\/span>\s*<h3 title="(\d+)">([^<]+)<\/h3>/i,
  );
  if (totalDownloadsMatch) {
    const numStr = totalDownloadsMatch[1].replace(/,/g, "");
    return parseInt(numStr);
  } else {
    throw new Error("Unable to find download count");
  }
}
