import { WebSocket } from 'ws';

export interface ActiveConnections {
  [id: string]: WebSocket;
}

export interface Coordinates {
  x: number;
  y: number;
}

export interface IncomingCoordinates {
  type: 'SET_PIXELS';
  payload: Coordinates;
}
