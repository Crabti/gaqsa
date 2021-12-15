import { CommonType } from '@types';

export interface Announcement extends CommonType {
  title: string;
  content: string;
  file_url: string;
}

export interface CreateAnnouncement extends CommonType {
  title: string;
  content: string;
  file: Blob;
}
