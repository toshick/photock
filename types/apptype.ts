export type AppState = {
  appName: string;
};

export type Album = {
  name: string;
  path: string;
  thumbnail?: string;
  description?: string;
};

export type FileData = {
  file: File;
  src: string;
  alt: string;
};

export type AlbumItem = {
  id: string;
  img: string;
};
