// tslint:disable-next-line
export const baseUri = (process as any).env.NODE_ENV === 'development' ? 
  'http://localhost:6060' : 'http://54.251.150.187:6060';

// tslint:disable-next-line  
export const bucket = (process as any).env.NODE_ENV === 'development' ? 
  'peekaboos1' : 'peekaboos';