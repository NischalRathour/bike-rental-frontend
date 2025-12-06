import "./Auth.css";

export default function Login() {
  return (
    <div className="auth-container">
      <h2>Login</h2>

      <input type="email" placeholder="Email" />
      <input type="password" placeholder="Password" />

      <button>Login</button>

      <p>Don’t have an account? <a href="/register">Register</a></p>
    </div>
  );
}
