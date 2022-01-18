export type AppState = {
  appName: string;
};

export type FileData = {
  file: File;
  src: string;
  alt: string;
};

export type AlbumItem = {
  index?: string;
  id: string;
  img: string;
  title: string;
  description: string;
};

export type Album = {
  name: string;
  path: string;
  thumbnail?: string;
  albumDescription: string;
  items: AlbumItem[];
};
