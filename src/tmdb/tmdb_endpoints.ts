import { IMediaDetail, IMediaList, IMediaSearch, ITvEpisode } from '../types';
import tmdbConfig from './tmdb.config';

const tmdbEndpoints = {
  mediaList: (parameters: IMediaList) => {
    const { mediaType, mediaCategory, page } = parameters;

    return tmdbConfig.getUrl(`${mediaType}/${mediaCategory}`, page);
  },

  mediaDetail: (parameters: IMediaDetail) => {
    const { mediaType, mediaId } = parameters;

    return tmdbConfig.getUrl(`${mediaType}/${mediaId}`);
  },

  mediaGenres: (mediaType: string) => tmdbConfig.getUrl(`genre/${mediaType}/list`),

  mediaCredits: (parameters: IMediaDetail) => {
    const { mediaType, mediaId } = parameters;

    return tmdbConfig.getUrl(`${mediaType}/${mediaId}/credits`);
  },

  mediaVideos: (parameters: IMediaDetail) => {
    const { mediaType, mediaId } = parameters;

    return tmdbConfig.getUrl(`${mediaType}/${mediaId}/videos`);
  },

  mediaRecommend: (parameters: IMediaDetail) => {
    const { mediaType, mediaId } = parameters;

    return tmdbConfig.getUrl(`${mediaType}/${mediaId}/recommendations`);
  },

  mediaImages: (parameters: IMediaDetail) => {
    const { mediaType, mediaId } = parameters;

    return tmdbConfig.getUrl(`${mediaType}/${mediaId}/images`);
  },

  tvEpisodes: (parameters: ITvEpisode) => {
    const { tvId, seasonNumber } = parameters;

    return tmdbConfig.getEpisode(tvId, seasonNumber);
  },

  mediaSearch: (parameters: IMediaSearch) => {
    const { mediaType, query, page } = parameters;

    return tmdbConfig.getUrl(`search/${mediaType}`, { query, page });
  },

  personDetail: (personId: string) => tmdbConfig.getUrl(`person/${personId}`),

  personMedias: (personId: string) => tmdbConfig.getUrl(`person/${personId}/combined_credits`),
};

export default tmdbEndpoints;
