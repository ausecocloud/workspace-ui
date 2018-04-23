

export function fetchToken() {
  return fetch('/oidc/token', { credentials: 'same-origin' })
    .then(response => response.json());
}

export function listProjects() {
  return fetch('/api/v1/projects', { credentials: 'same-origin' })
    .then(response => response.json());
}

export function listContents(params) {
  // params should be an object with {project:, path:}
  const url = new URL('/api/v1/folders', document.baseURI);
  // TODO: better check for parameter value empty or not.... just don't send it at all?
  Object.keys(params).forEach((key) => {
    if (params[key]) {
      url.searchParams.append(key, params[key]);
    }
  });
  return fetch(url, { credentials: 'same-origin' })
    .then(response => response.json());
}

export function addFolder(params) {
  // project, path, name
  const url = new URL('/api/v1/folders', document.baseURI);
  // TODO: better check for parameter value empty or not.... just don't send it at all?
  Object.keys(params).forEach((key) => {
    if (key !== 'folder' && !(params[key] === undefined || params[key] === null)) {
      url.searchParams.append(key, params[key]);
    }
  });
  return fetch(
    url,
    {
      credentials: 'same-origin',
      method: 'POST',
      body: JSON.stringify(params.folder),
      headers: {
        'Content-Type': 'application/json',
      },
    },
  // We get a NoContent 204 respoense here
  ).then(response => response);
}

export function deleteFolder(params) {
  // project, path, name
  const url = new URL('/api/v1/folders', document.baseURI);
  // TODO: see addFolder
  Object.keys(params).forEach((key) => {
    if (params[key]) {
      url.searchParams.append(key, params[key]);
    }
  });
  return fetch(
    url,
    {
      credentials: 'same-origin',
      method: 'DELETE',
    },
  );
}
