export interface Coordinates {
  x: number;
  y: number;
}

export interface IncomingCoordinates {
  type: 'SET_PIXELS';
  payload: Coordinates;
}
