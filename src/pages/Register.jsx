import "./Auth.css";

export default function Register() {
  return (
    <div className="auth-container">
      <h2>Create Account</h2>

      <input type="text" placeholder="Full Name" />
      <input type="email" placeholder="Email" />
      <input type="password" placeholder="Password" />

      <button>Register</button>

      <p>Already have an account? <a href="/login">Login</a></p>
    </div>
  );
}
