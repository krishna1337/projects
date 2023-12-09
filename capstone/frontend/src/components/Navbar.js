import { Link, useHistory } from "react-router-dom";
import { Context, getCsrfToken } from "../App";
import { useContext } from "react";

export default function Navbar() {
  const context = useContext(Context);
  const history = useHistory();
  const linkBlur = (e) => e.target.blur();

  function handleLogout() {
    fetch("/api/logout/", {
      method: "POST",
      headers: { "X-CSRFToken": getCsrfToken() },
    }).then((response) => {
      if (response.ok) {
        context.socket.close();
        context.setUsers([]);
        context.setFetched([]);
        context.setMessages([]);
        context.setIsLogged(false);
        context.setSocket(null);
      }
    });
  }

  function handleMessage(e) {
    e.preventDefault();
    document.querySelector(".navbar-toggler").click();
    const username = e.target.elements.username;

    if (username.value) {
      fetch("/api/create-channel/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": getCsrfToken(),
        },
        body: JSON.stringify({
          user: username.value,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (!data.error) {
            context.getChannels();
            context.setScroll(true);
            history.push(`/channels/${data.id}/`);
            username.value = "";
            document.getElementById("input").focus();
          }
        });
    }
  }

  return (
    <>
      <nav className="navbar navbar-expand-sm navbar-dark bg-dark">
        <Link className="navbar-brand" to="/" onFocus={linkBlur}>
          Chat50
        </Link>
        <Context.Consumer>
          {({ isLogged }) =>
            isLogged ? (
              <>
                <ul className="navbar-nav mr-auto">
                  <li className="nav-item">
                    <Link
                      className="nav-link"
                      to="/login/"
                      onFocus={linkBlur}
                      onClick={handleLogout}
                    >
                      Logout - <b>{isLogged}</b>
                    </Link>
                  </li>
                </ul>
                <button
                  class="navbar-toggler"
                  type="button"
                  data-toggle="collapse"
                  data-target="#navbarToggleExternalContent"
                  onFocus={linkBlur}
                >
                  <span class="navbar-toggler-icon"></span>
                </button>
                <form
                  id="form-normal"
                  class="form-inline"
                  onSubmit={handleMessage}
                >
                  <input
                    class="form-control mr-sm-2"
                    name="username"
                    placeholder="Username"
                    style={{ background: "transparent", color: "#fff" }}
                  />
                  <button class="btn btn-outline-success" type="submit">
                    Message
                  </button>
                </form>
              </>
            ) : (
              <ul className="navbar-nav mr-auto">
                <li className="nav-item">
                  <Link className="nav-link" to="/login/" onFocus={linkBlur}>
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/register/" onFocus={linkBlur}>
                    Register
                  </Link>
                </li>
              </ul>
            )
          }
        </Context.Consumer>
      </nav>
      <Context.Consumer>
        {({ isLogged }) =>
          isLogged ? (
            <div class="collapse" id="navbarToggleExternalContent">
              <form
                id="form-responsive"
                class="form-inline bg-dark"
                onSubmit={handleMessage}
              >
                <input
                  class="form-control"
                  name="username"
                  placeholder="Username"
                  style={{ background: "transparent", color: "#fff" }}
                  autoComplete="off"
                />
                <button class="btn btn-outline-success my-2" type="submit">
                  Message
                </button>
              </form>
            </div>
          ) : null
        }
      </Context.Consumer>
    </>
  );
}
