import axios_client from '../http/axios_client';
import { IMediaDetail, IMediaList, IMediaSearch } from '../types';
import tmdbEndpoints from './tmdb_endpoints';

export const tmdbApi = {
  mediaList: async (params: IMediaList) => axios_client.get(tmdbEndpoints.mediaList(params)),

  mediaDetail: async (params: IMediaDetail) => axios_client.get(tmdbEndpoints.mediaDetail(params)),

  mediaGenres: async (params: string) => axios_client.get(tmdbEndpoints.mediaGenres(params)),

  mediaCredits: async (params: IMediaDetail) => axios_client.get(tmdbEndpoints.mediaCredits(params)),

  mediaVideos: async (params: IMediaDetail) => axios_client.get(tmdbEndpoints.mediaVideos(params)),

  mediaRecommend: async (params: IMediaDetail) => axios_client.get(tmdbEndpoints.mediaRecommend(params)),

  mediaImages: async (params: IMediaDetail) => axios_client.get(tmdbEndpoints.mediaImages(params)),

  mediaSearch: async (params: IMediaSearch) => axios_client.get(tmdbEndpoints.mediaSearch(params)),

  personDetail: async (params: string) => axios_client.get(tmdbEndpoints.personDetail(params)),

  personMedias: async (params: string) => axios_client.get(tmdbEndpoints.personMedias(params)),
};
