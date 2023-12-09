import { Link, useHistory } from "react-router-dom";
import { Context, getCsrfToken } from "../App";
import { useContext } from "react";

export default function Register() {
  const context = useContext(Context);
  const history = useHistory();

  if (context.isLogged) {
    history.push("/");
  }

  function handleRegister(e) {
    e.preventDefault();
    const form = e.target.elements;

    fetch("/api/register/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": getCsrfToken(),
      },
      body: JSON.stringify({
        username: form.username.value,
        password: form.password.value,
        email: form.email.value,
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
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        <div className="form-group">
          <input
            className="form-control"
            type="email"
            name="email"
            placeholder="Email"
          />
        </div>
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
        <input className="btn btn-primary" type="submit" value="Register" />
      </form>
      <hr />
      <p>
        Already have an account? <Link to="/login/">Log In here</Link>
      </p>
    </div>
  );
}
