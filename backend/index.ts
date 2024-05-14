import express from 'express';
import expressWs from 'express-ws';
import cors from 'cors';
import { ActiveConnections, Coordinates, IncomingCoordinates } from './types';

const app = express();
expressWs(app);

const port = 8000;

app.use(cors());

const router = express.Router();

const activeConnections: ActiveConnections = {};

router.ws('/paint', (ws, _req) => {
  const id = crypto.randomUUID();
  console.log('client connected id =', id);
  activeConnections[id] = ws;

  ws.on('message', (message) => {
    const parsedMessage = JSON.parse(message.toString()) as IncomingCoordinates;

    switch (parsedMessage.type) {
      case 'SET_PIXELS':
        Object.values(activeConnections).forEach((connection) => {
          connection.send(
            JSON.stringify({
              type: 'NEW_PIXELS',
              payload: parsedMessage.payload,
            })
          );
        });
        break;

      default:
        console.log('Unknown message type:', parsedMessage.type);
    }
    console.log(parsedMessage);
  });

  ws.on('close', () => {
    console.log('client disconnected id =', id);
    delete activeConnections[id];
  });
});

app.use(router);

app.listen(port, () => {
  console.log(`Server started on ${port} port!`);
});
