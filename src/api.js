

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

export function listContents(params) {
  // params should be an object with {project:, path:}
  const url = new URL('/api/v1/folders', document.baseURI);
  Object.keys(params).forEach((key) => {
    if (params[key]) {
      url.searchParams.append(key, params[key]);
    }
  });
  return fetch(url, { credentials: 'same-origin' })
    .then(response => response.json())
    .then(data => data);
}
