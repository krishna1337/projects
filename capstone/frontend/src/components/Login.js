import { Link, useHistory } from "react-router-dom";
import { Context, getCsrfToken } from "../App";
import { useContext } from "react";

export default function Login() {
  const context = useContext(Context);
  const history = useHistory();

  if (context.isLogged) {
    history.push("/");
  }

  function handleLogin(e) {
    e.preventDefault();
    const form = e.target.elements;

    fetch("/api/login/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": getCsrfToken(),
      },
      body: JSON.stringify({
        username: form.username.value,
        password: form.password.value,
      }),
    }).then((res) => {
      if (res.ok) {
        context.setIsLogged(form.username.value);
        history.push("/");
      }
    });
  }

  return (
    <div className="container">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div className="form-group">
          <input
            className="form-control"
            type="text"
            name="username"
            placeholder="Username"
            required=""
          />
        </div>
        <div className="form-group">
          <input
            className="form-control"
            type="password"
            name="password"
            placeholder="Password"
            required=""
          />
        </div>
        <input className="btn btn-primary" type="submit" value="Login" />
      </form>
      <hr />
      <p>
        Don't have an account? <Link to="/register/">Register here</Link>
      </p>
    </div>
  );
}
