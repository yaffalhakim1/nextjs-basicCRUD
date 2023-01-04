import React, { useState } from "react";
import { unAuthPage } from "../middleware/authorization";
import Link from "next/link";

export async function getServerSideProps(context) {
  await unAuthPage(context);

  return { props: {} };
}

export default function Register() {
  const [fields, setFields] = useState({ username: "", password: "" });

  const [status, setStatus] = useState("normal");

  async function registerHandler(event) {
    event.preventDefault();
    setStatus("loading");

    const registerReq = await fetch("http://localhost:3000/api/auth/register", {
      method: "POST",
      body: JSON.stringify(fields),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!registerReq.ok === 200) return setStatus("error" + registerReq.status);
    const registerRes = await registerReq.json();
    setStatus("success" + registerRes.message);
  }

  function fieldHandler(e) {
    setFields({ ...fields, [e.target.name]: e.target.value });
  }
  return (
    <div>
      <h1>Register</h1>
      <form onSubmit={registerHandler.bind(this)}>
        <input
          name="email"
          type="text"
          onChange={fieldHandler.bind(this)}
          placeholder="username"
        />{" "}
        <br />
        <input
          onChange={fieldHandler.bind(this)}
          type="password"
          name="password"
          placeholder="password"
        />
        <br />
        <button type="submit">register</button>
        <div>output : {status}</div>
        <Link href="/auth/login">
          <a> login</a>
        </Link>
      </form>
    </div>
  );
}
