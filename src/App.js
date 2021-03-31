import logo from './logo.svg';
import './App.css';
import { createMachine } from 'xstate';
import { useMachine } from '@xstate/react';

const playerMachine = createMachine({
  id: "player",
  initial: "paused",
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
      play: () => { console.log("PLAY"); },
      stop: () => { console.log("STOP"); }

    }
  }
)

function App() {
  const [current, send] = useMachine(playerMachine);
  console.log(current);
  return (
    <div>
      <button onClick={() => send("STOP")}>STOP</button>
      <button onClick={() => send("PLAY")}>PLAY</button>
    </div>
  );
}

export default App;
