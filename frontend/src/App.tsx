import { Container, Typography } from '@mui/material';
import { useEffect, useRef } from 'react';
import { Coordinates, IncomingCoordinates } from './types';

function App() {
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    ws.current = new WebSocket('ws://localhost:8000/paint');
    ws.current.onclose = () => console.log('ws closed');

    const canvas = document.querySelector<HTMLCanvasElement>('#canvas')!;

    const ctx = canvas.getContext('2d')!;

    let paint = false;

    let coordinates: Coordinates = {
      x: 0,
      y: 0,
    };

    ws.current.addEventListener('message', async (msg) => {
      const parsedMessage = JSON.parse(msg.data) as IncomingCoordinates;
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.strokeStyle = 'blue';
      ctx.lineTo(parsedMessage.payload.x, parsedMessage.payload.y);
      ctx.stroke();
    });

    const getPosition = (event: MouseEvent) => {
      coordinates.x = event.clientX - canvas.offsetLeft;
      coordinates.y = event.clientY - canvas.offsetTop;
    };

    const startPainting = (event: MouseEvent) => {
      paint = true;
      getPosition(event);
    };

    const stopPainting = () => {
      paint = false;
    };

    const draw = (event: MouseEvent) => {
      if (!paint) return;

      ctx.beginPath();
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.strokeStyle = 'blue';

      ctx.moveTo(coordinates.x, coordinates.y);

      getPosition(event);

      ctx.lineTo(coordinates.x, coordinates.y);

      ctx.stroke();
      if (!ws.current) return;
      ws.current.send(
        JSON.stringify({ type: 'SET_PIXELS', payload: coordinates })
      );
    };

    canvas.addEventListener('mousedown', startPainting);
    canvas.addEventListener('mouseup', stopPainting);
    canvas.addEventListener('mousemove', draw);

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, []);

  return (
    <Container sx={{ py: 4 }}>
      <Typography
        fontWeight='bold'
        variant='h4'
        textAlign='center'
        sx={{
          background: '-webkit-linear-gradient(135deg, #42d392, #647eff);',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      >
        Painter
      </Typography>
      <Typography variant='h6' textAlign='center' sx={{ mb: 1 }}>
        Draw anything you want
      </Typography>
      <canvas
        id='canvas'
        width='1200px'
        height='750px'
        style={{ border: '1px solid #000' }}
      ></canvas>
    </Container>
  );
}

export default App;
