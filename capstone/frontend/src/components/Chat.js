import { useContext, useLayoutEffect } from "react";
import { useHistory } from "react-router-dom";
import { Context } from "../App";
import Home, { addFocus } from "./Home";

export default function Chat() {
  const channelid = window.location.pathname.slice(10).slice(0, -1);
  const context = useContext(Context);
  const history = useHistory();

  useLayoutEffect(() => {
    addFocus();
    const wrapper = document.querySelector(".messages");
    if (context.scroll === true) {
      wrapper.scrollTop = wrapper.scrollHeight;
    }

    wrapper.onscroll = () => {
      if (wrapper.scrollTop === 0) {
        let before = 0;
        for (let i = 0; i < context.messages.length; i++) {
          if (context.messages[i].channel.toString() === channelid) {
            before += 1;
          }
        }

        fetch(`/api/get-messages/${channelid}/?before=${before}`)
          .then((res) => res.json())
          .then((data) => {
            if (data.length) {
              const scrollHeight = wrapper.scrollHeight;
              context.setScroll(false);
              context.setMessages((m) => [...data, ...m]);
              wrapper.scrollTop = wrapper.scrollHeight - scrollHeight;
            }
          });
      }
    };
  });

  useLayoutEffect(() => {
    context.setScroll(true);
    if (context.fetched.indexOf(channelid) === -1) {
      fetch(`/api/get-messages/${channelid}/`)
        .then((res) => {
          if (res.ok) {
            return res.json();
          } else {
            history.push("/");
          }
        })
        .then((data) => {
          if (data !== undefined) {
            context.setMessages((m) => m.concat(data));
            context.setFetched((f) => f.concat(channelid));
          }
        });
    }
    // eslint-disable-next-line
  }, [channelid]);

  return (
    <Home>
      <div className="messages">
        {context.messages.map(({ user, message, channel }) => {
          return channel.toString() === channelid ? (
            <div className="card mt-2">
              <div className="card-header">
                <b>{user}</b>
              </div>
              <div className="card-body">{message}</div>
            </div>
          ) : null;
        })}
      </div>
      <hr />
      <input
        id="input"
        className="form-control"
        placeholder="Message"
        data-channel={channelid}
        onKeyUp={context.enterHandler}
        autoComplete="off"
      />
    </Home>
  );
}
