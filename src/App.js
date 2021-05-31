import React, { useEffect, useState, useRef } from "react";
// import { io } from "socket.io-client";
import axios from "axios";

import { useSocket } from "./contexts/socketProvider";

const URL = "http://localhost:8080";

export default function App() {
  const [messages, setMessages] = useState([]);
  const messageRef = useRef();
  const roomRef = useRef();
  const socket = useSocket();
  useEffect(() => {
    if (socket === undefined) return;
    const displayConnection = () => {
      console.log(`user have been connected with id ${socket.id} from context`);
      socket.on("message-received", (newMessage) => {
        console.log(newMessage);
        setMessages((prevMessage) => {
          return [...prevMessage, newMessage];
        });
      });
    };
    socket.on("connect", displayConnection);

    return () => socket.off("connect", displayConnection);
  }, [socket]);

  const submitHandler = (e) => {
    e.preventDefault();
    const { name, value } = messageRef.current;
    const room = roomRef.current.value;
    const body = {
      name,
      value,
    };
    const cb = ({ status }) => {
      if (status) {
        setMessages((prevMessage) => {
          return [...prevMessage, body];
        });
      }
    };
    socket.emit("send-message", body, room, cb);
  };

  const joinHandler = (e) => {
    e.preventDefault();
    const { value } = roomRef.current;
    socket.emit("join-room", value, ({ status }) => {
      if (status) console.log(`user joined ${value} room`);
    });
  };

  return (
    <div>
      <h1>App</h1>
      <button
        onClick={() => {
          axios
            .post(
              URL,
              {
                msg: "Hello World",
              },
              {
                headers: {
                  "x-access-token": "new-app",
                },
              }
            )
            .then((res) => console.log(res.data))
            .catch((err) => console.error(err));
        }}
      >
        Post
      </button>
      <button
        onClick={() => {
          axios
            .patch(
              URL,
              {
                msg: "Hello World",
              },
              {
                headers: {
                  "x-access-token": "new-app",
                },
              }
            )
            .then((res) => console.log(res.data))
            .catch((err) => console.error(err));
        }}
      >
        Patch
      </button>
      <button
        onClick={() => {
          axios
            .delete(URL, {
              headers: {
                "x-access-token": "new-app",
              },
            })
            .then((res) => console.log(res.data))
            .catch((err) => console.error(err));
        }}
      >
        Delete
      </button>
      <br />
      <form onSubmit={submitHandler}>
        <input type="text" name="message" ref={messageRef} />
        <button type="submit">Send Message</button>
      </form>
      <form onSubmit={joinHandler}>
        <input type="text" name="room" ref={roomRef} />
        <button type="submit">Join Room</button>
      </form>
      <div className="message-list">
        {messages.map((message, index) => {
          return <p key={index}>{message.value}</p>;
        })}
      </div>
    </div>
  );
}
