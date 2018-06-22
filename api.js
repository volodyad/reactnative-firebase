import config from './config';
const MIN_LOADING_TIME = 200;

const waitFor = promise => {
  const timeout = new Promise(resolve => {
    setTimeout(resolve, MIN_LOADING_TIME);
  });

  return Promise.all([promise, timeout]).then(([arg]) => arg);
};

const getAuthHeaders = () => ({});

const getOptions = () => {
  return { API: config.API_HOST };
};

export const METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
};

const api = {
  fetch(
    method,
    url,
    headers = getAuthHeaders(),
    body = {},
    options = getOptions()
  ) {
    const bodyObj = body && { body: JSON.stringify(body) };

    return waitFor(
      fetch(`${options.API}${url}`, {
        method,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          ...headers,
        },
        ...bodyObj,
      })
    )
      .catch(err => {
        throw err;
      })
      .then(res => {
        if (res.status !== 200) return Promise.reject(res);
        return res.json();
      });
  },

  get(...args) {
    return this.fetch(METHODS.GET, ...args);
  },

  post(...args) {
    return this.fetch(METHODS.POST, ...args);
  },

  put(...args) {
    return this.fetch(METHODS.PUT, ...args);
  },

  delete(...args) {
    return this.fetch(METHODS.DELETE, ...args);
  },
};

export default api;
