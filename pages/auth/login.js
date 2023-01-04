import React, { useState, useEffect } from "react";
import Cookie from "js-cookie";
import Router from "next/router";
import cookies from "next-cookies";
import { unAuthPage } from "../middleware/authorization";
import Link from "next/link";

export async function getServerSideProps(context) {
  //get server side props is a function that is executed on the server side before the page is rendered
  //caranya cuma kasih token, kalo ada token yang sebelumnya didapet dari login/register, langsung arahin ke halaman post
  //token disimpen di cookies, ada di function login handler yg cookies.set
  await unAuthPage(context);

  return { props: {} };
}

export default function Login() {
  const [fields, setFields] = useState({ username: "", password: "" });
  const [status, setStatus] = useState("normal");

  useEffect(
    () => {
      const token = Cookie.get("token");
      if (token) return Router.push("/posts");
    },
    [
      /* empty dependency array means this effect will only run once (like componentDidMount in classes) */
    ]
  );

  function fieldHandler(e) {
    setFields({ ...fields, [e.target.name]: e.target.value });
  }

  async function loginHandler(e) {
    e.preventDefault();

    const loginReq = await fetch("http://localhost:3000/api/auth/login", {
      method: "POST",
      body: JSON.stringify(fields),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!loginReq.ok) return console.log("error" + loginReq.message);
    const loginRes = await loginReq.json();
    setStatus("success" + loginRes.message);

    Cookie.set("token", loginRes.token); // set cookie token
    Router.push("/posts");
  }
  return (
    <div>
      <h1>login</h1>
      <form onSubmit={loginHandler.bind(this)}>
        <input
          type="text"
          onChange={fieldHandler}
          name="email"
          placeholder="username"
        />{" "}
        <br />
        <input
          type="password"
          onChange={fieldHandler}
          name="password"
          placeholder="password"
        />
        <br />
        <button type="submit">login</button>
        <div> output : {status}</div>
        <Link href="/auth/register">
          <a> register</a>
        </Link>
      </form>
    </div>
  );
}
