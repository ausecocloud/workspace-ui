
const config = {};

export function loadConfig(url) {
  return fetch(url)
    .then(response => response.json())
    .then(data => Object.assign(config, data));
}

export function getConfig(section) {
  if (section) {
    return config[section];
  }
  return config;
}
