export interface IMediaList {
  mediaType: string;
  mediaCategory: string;
  page: any;
}

export interface IMediaDetail extends Pick<IMediaList, 'mediaType'> {
  mediaId: string;
}

export interface IMediaSearch extends Omit<IMediaList, 'mediaCategory'> {
  query: string;
}
