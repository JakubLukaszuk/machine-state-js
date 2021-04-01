import logo from './logo.svg';
import './App.css';
import { createMachine } from 'xstate';
import { useMachine } from '@xstate/react';
import React from 'react'

const playerMachine = (ref, {autoplay} = {autoplay: false}) => createMachine({
  id: "player",
  initial: "unknown",
  context: {ref},
  states: {
    unknown: {
      always: [
        {
          target: "playing",
          cond: "shouldAutoPlay"
        },
        {
          target: "paused"
        }
      ]
    },
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
    guards: {
      shouldAutoPlay: () => autoplay
    },
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

const fetchMachine = createMachine({
  id: "fetch",
  initial: "idle",
  on:{
    FETCH: {
      target: "pending"
    }
  },
  states: {
    idle: {},
    pending: {
      on: {
        FETCH: undefined
      },
      invoke: {
        src: "fetch",
        onDone: {
          target: "success"
        },
        onError: {
          target: "error"
        }
      }
    },
    success: {},
    error: {}
  }
},
{
  services: {
    fetch: async () => {
      return new Promise((resolve, reject)=> {
        setTimeout(() => {
          const random = Math.random()

          if(random> 0.5)
          {
            resolve()
          }
          else
          {
            reject()
          }
        }, 1000)
      })
    }
  }
});

function App() {
  const ref = React.useRef(null);
  const machine = playerMachine(ref, {autoplay: true});
  const [current, send] = useMachine(machine);
  const [currentSrvice, sendService] = useMachine(fetchMachine);
  console.log(current);
  return (
    <div>
      <video ref={ref} src="https://cdn.videvo.net/videvo_files/video/premium/video0293/small_watermarked/_TeaserNewYear109_preview.webm" />
      <br/>
      <button onClick={() => send("STOP")}>STOP</button>
      <button onClick={() => send("PLAY")}>PLAY</button>
      <br/>
      <br/>
      {currentSrvice.value}
      <button onClick={() => sendService("FETCH")}>fetch</button>
    </div>
  );
}

export default App;
