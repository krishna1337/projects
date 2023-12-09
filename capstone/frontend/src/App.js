import Register from "./components/Register";
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import Home from "./components/Home";
import Chat from "./components/Chat";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import React, { useState, useEffect } from "react";

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isLogged, setIsLogged] = useState(null);
  const [messages, setMessages] = useState([]);
  const [fetched, setFetched] = useState([]);
  const [scroll, setScroll] = useState(true);
  const [socket, setSocket] = useState(null);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch("/api/set-csrf-cookie/");
    fetch("/api/is-logged/")
      .then((res) => res.json())
      .then((data) => {
        setIsLogged(data.isLogged);
        setInterval(() => {
          setIsLoading(false);
        }, 500);
      });
  }, []);

  useEffect(() => {
    if (isLogged) getChannels();
  }, [isLogged]);

  useEffect(() => {
    if (isLogged) {
      if (socket === null) {
        const socket = new WebSocket(`ws://${window.location.host}/`);
        setSocket(socket);
      } else {
        socket.onmessage = (e) => {
          setScroll(true);
          const data = JSON.parse(e.data);
          if (fetched.indexOf(data.channel.toString()) !== -1) {
            setMessages((m) => m.concat(data));
          } else {
            getChannels();
          }
        };
      }
    }
  }, [isLogged, fetched, socket]);

  function getChannels() {
    fetch("/api/get-channels/")
      .then((res) => res.json())
      .then((data) => {
        setUsers(data);
      });
  }

  function enterHandler(e) {
    const input = e.target;
    if (e.keyCode === 13) {
      if (socket.readyState === 1 && input.value) {
        socket.send(
          JSON.stringify({
            message: input.value,
            channel: input.dataset.channel,
          })
        );
        input.value = "";
      }
    }
  }

  return isLoading === true ? (
    <p class="loading">
      Loading<span>.</span>
      <span>.</span>
      <span>.</span>
    </p>
  ) : (
    <Router>
      <Context.Provider
        value={{
          isLogged,
          setIsLogged,
          messages,
          setMessages,
          fetched,
          setFetched,
          scroll,
          setScroll,
          socket,
          setSocket,
          users,
          setUsers,
          enterHandler,
          getChannels,
        }}
      >
        <Navbar />
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/login/" component={Login} />
          <Route exact path="/register/" component={Register} />
          <Route exact path="/channels/:id/" component={Chat} />
        </Switch>
      </Context.Provider>
    </Router>
  );
}

export const Context = React.createContext({
  isLogged: null,
  setIsLogged: () => {},
  messages: [],
  setMessages: () => {},
  fetched: [],
  setFetched: () => {},
  scroll: null,
  setScroll: () => {},
  socket: null,
  setSocket: () => {},
  users: [],
  setUsers: () => {},
  enterHandler: () => {},
  getChannels: () => {},
});

export const getCsrfToken = () => {
  const name = "csrftoken";
  const cookies = document.cookie.split(";");
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim();
    if (cookie.substring(0, name.length + 1) === `${name}=`) {
      return cookie.substring(name.length + 1);
    }
  }
};
