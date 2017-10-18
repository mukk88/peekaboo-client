export interface IMediaData {
  blob?: Blob;
  name: string;
  date: string;
  isVideo: boolean;
  comment: string;
  orientation: number;
  token: string;
}

export const transformMapping = {
  1: '0',
  3: '180',
  6: '90',
  8: '270',
};

export const centerStyle: React.CSSProperties = {
  textAlign: 'center',
};

export const leftStyle: React.CSSProperties = {
  float: 'left',
};

export const rightStyle: React.CSSProperties = {
  float: 'right',
};

export const daysSinceStyle: React.CSSProperties = {
  width: '100%',
};

export const mediaStyle: React.CSSProperties = {
  maxWidth: '100%',
  maxHeight: '425px',
  verticalAlign: 'middle',
};

export const helperStyle: React.CSSProperties = {
  display: 'inline-block',
  height: '100%',
  verticalAlign: 'middle',
};

export const containerStyle: React.CSSProperties = {
  height: '425px',
  ...centerStyle,
  whiteSpace: 'nowrap',
  margin: '1em 0',
};

export const rootStyle: React.CSSProperties = {
  paddingTop: '1em',
  ...centerStyle,
};

export const playButtonStyle: React.CSSProperties = {
  cursor: 'pointer',
  zIndex: 99,
  color: 'white',
  fontSize: '3em',
  position: 'absolute',
  opacity: 0.85,
};
