export interface IMediaData {
  blob: Blob;
  name: string;
  date: string;
  isVideo: boolean;
  comment: string;
  orientation: number;
  token?: string;
}

export const transformMapping = {
  1: '0',
  3: '180',
  6: '90',
  8: '270',
};