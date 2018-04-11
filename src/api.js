

export function fetchToken() {
  return fetch('/oidc/token', { credentials: 'same-origin' })
    .then(response => response.json())
    .then(data => data);
}

export function listProjects() {
  return fetch('/api/v1/projects', { credentials: 'same-origin' })
    .then(response => response.json())
    .then(data => data);
}

export function listContents(project) {
  const url = new URL('/api/v1/folders', document.baseURI);
  const params = { project };
  Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
  return fetch(url, { credentials: 'same-origin' })
    .then(response => response.json())
    .then(data => data);
}
