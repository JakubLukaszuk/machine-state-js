import logo from './logo.svg';
import './App.css';
import { createMachine } from 'xstate';
import { useMachine } from '@xstate/react';
import React from 'react'

const playerMachine = (ref) => createMachine({
  id: "player",
  initial: "paused",
  context: {ref},
  states: {
    paused: {
      entry: "stop",
      on: {
        PLAY: "playing"
      },
    },
    playing: {
      entry: "play",
      on: {
        STOP: "paused"
      }
    }
  },
},
  {
    actions: {
      play: (context) => {
        console.log("PLAY");
        if(context.ref.current)
        {
          context.ref.current.play()
        }
      },
      stop: (context) => {
        console.log("STOP");
        if(context.ref.current)
        {
          context.ref.current.pause()
        }
      }

    }
  }
)

function App() {
  const ref = React.useRef(null);
  const machine = playerMachine(ref);
  const [current, send] = useMachine(machine);
  console.log(current);
  return (
    <div>
    <video ref={ref} src="https://cdn.videvo.net/videvo_files/video/premium/video0293/small_watermarked/_TeaserNewYear109_preview.webm" />
      <br/>
      <button onClick={() => send("STOP")}>STOP</button>
      <button onClick={() => send("PLAY")}>PLAY</button>
    </div>
  );
}

export default App;
