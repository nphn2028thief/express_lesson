import config from '../config';

const tmdbBaseUrl = config.tmdbBaseUrl;
const apiKey = config.tmdbKey;

const getUrl = (endpoint: string, query?: any) => {
  const qs = new URLSearchParams(query);

  return `${tmdbBaseUrl}/${endpoint}?api_key=${apiKey}&${qs}`;
};

export default { getUrl };
