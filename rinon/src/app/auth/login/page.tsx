"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "@/app/protected/AuthProvider";
import { useRouter } from "next/navigation";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [type, setType] = useState<"Patient" | "Doctor" | "Diagnoser">("Patient");
  const { login, user } = useAuth();
  const router = useRouter();

  // 🔑 navigate when user is updated
  useEffect(() => {
    if (user && type === "Diagnoser") {
      router.push("/dashboard/diagnoser");
    }
  }, [user, type, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("http://localhost:5000/auth/v1/sign-in", {
        creds: { email, password, type },
      });
      await login(data.token);
      // ❌ don’t check `user` here; let the useEffect run
    } catch (err) {
      console.error(err);
      alert("Error sending request");
    }
  };

  return (
    <div>
      <h2>Login Page</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <label htmlFor="type">Type</label>
        <select
          id="type"
          value={type}
          onChange={(e) =>
            setType(e.target.value as "Patient" | "Doctor" | "Diagnoser")
          }
        >
          <option value="Patient">Patient</option>
          <option value="Doctor">Doctor</option>
          <option value="Diagnoser">Diagnoser</option>
        </select>

        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default Login;
