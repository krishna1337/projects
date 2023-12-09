import { Link, useHistory } from "react-router-dom";
import { useContext } from "react";
import { Context } from "../App";

export default function Home(props) {
  const channelid = window.location.pathname.slice(10).slice(0, -1);
  const context = useContext(Context);
  const history = useHistory();

  if (context.isLogged === false) {
    history.push("/login/");
  }

  document.addEventListener("touchstart", handleTouchStart, false);
  document.addEventListener("touchmove", handleTouchMove, false);

  var xDown = null;
  var yDown = null;

  function getTouches(evt) {
    return (
      evt.touches || // browser API
      evt.originalEvent.touches
    ); // jQuery
  }

  function handleTouchStart(evt) {
    const firstTouch = getTouches(evt)[0];
    xDown = firstTouch.clientX;
    yDown = firstTouch.clientY;
  }

  function handleTouchMove(evt) {
    if (!xDown || !yDown) {
      return;
    }

    var xUp = evt.touches[0].clientX;
    var yUp = evt.touches[0].clientY;
    var xDiff = xDown - xUp;
    var yDiff = yDown - yUp;

    if (Math.abs(xDiff) > Math.abs(yDiff)) {
      if (xDiff > 0) {
        addFocus();
      } else {
        document.querySelector(".sidebar").classList.add("sidebar-show");
        const messages = document.querySelector(".messages");
        if (messages !== null) messages.style.opacity = ".5";
        document.getElementById("wrapper").classList.add("unclickable");
      }
    }
    xDown = null;
    yDown = null;
  }

  return (
    <div className="container view">
      <div className="sidebar sidebar-show">
        <div className="list-group">
          {context.users.map(({ id, name }) => {
            return (
              <Link
                className={`list-group-item list-group-item-action ${
                  channelid === id.toString() ? "active" : ""
                }`}
                to={`/channels/${id}/`}
              >
                {name}
              </Link>
            );
          })}
        </div>
      </div>
      <div id="wrapper">{props.children}</div>
    </div>
  );
}

export function addFocus() {
  document.querySelector(".sidebar").classList.remove("sidebar-show");
  const messages = document.querySelector(".messages");
  if (messages !== null) messages.style.removeProperty("opacity");
  document.getElementById("wrapper").classList.remove("unclickable");
}
