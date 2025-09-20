"use client";

import { useState } from "react";
import axios from "axios";

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [organization, setOrganization] = useState("");
  const [userType, setUserType] =
    useState<"Patient" | "Doctor" | "Diagnoser">("Patient");

  const handleSubmit = async () => {
    try {
      // wrap all fields inside a `creds` object
      const payload = {
        creds: {
          name,
          email,
          password,
          type: userType,
          ...(userType !== "Patient" && { organization }),
        },
      };

      const res = await axios.post("http://localhost:5000/auth/v1/sign-up", payload);

      console.log("Signup success:", res.data);
      alert("Signup request sent!");
    } catch (err) {
      console.error("Signup error:", err);
      alert("Something went wrong");
    }
  };

  return (
    <div>
      <h1>Signup</h1>

      <label htmlFor="name">Name</label>
      <input
        id="name"
        placeholder="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <label htmlFor="email">Email</label>
      <input
        id="email"
        placeholder="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <label htmlFor="password">Password</label>
      <input
        id="password"
        placeholder="password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <label htmlFor="type">Type</label>
      <select
        id="type"
        value={userType}
        onChange={(e) =>
          setUserType(e.target.value as "Patient" | "Doctor" | "Diagnoser")
        }
      >
        <option value="Patient">Patient</option>
        <option value="Doctor">Doctor</option>
        <option value="Diagnoser">Diagnoser</option>
      </select>

      {userType !== "Patient" && (
        <>
          <label htmlFor="organization">Organization</label>
          <input
            id="organization"
            placeholder="organization"
            value={organization}
            onChange={(e) => setOrganization(e.target.value)}
          />
        </>
      )}

      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
}

export default Signup;
