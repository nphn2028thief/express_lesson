import config from '../config';

const tmdbBaseUrl = config.tmdbBaseUrl;
const apiKey = config.tmdbKey;

const getUrl = (endpoint: string, query?: any) => {
  const qs = new URLSearchParams(query);

  return `${tmdbBaseUrl}/${endpoint}?api_key=${apiKey}&${qs}`;
};

const getEpisode = (tvId: string, seasonNumber: string) => {
  return `${tmdbBaseUrl}/tv/${tvId}/season/${seasonNumber}?api_key=${apiKey}`;
};

export default { getUrl, getEpisode };
