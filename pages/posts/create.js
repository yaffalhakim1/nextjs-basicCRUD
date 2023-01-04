import React, { useState } from "react";
import { AuthPage } from "../middleware/authorization";
import Router from "next/router";
import Nav from "../../components/nav";

export async function getServerSideProps(context) {
  const { token } = await AuthPage(context);
  return {
    props: {
      token: token,
    },
  };
}

export default function PostCreate(props) {
  const [fields, setFields] = useState({ title: "", content: "" });

  const [status, setStatus] = useState("normal");

  async function createHandler(e) {
    e.preventDefault();
    setStatus("loading");
    const postCreateReq = await fetch("http://localhost:3000/api/create", {
      method: "POST",
      headers: {
        Auhtorization: "Bearer " + token,
      },
      body: JSON.stringify(fields),
    });

    if (!postCreateReq.ok) return setStatus("error");
    const postCreateRes = await postCreateReq.json();
    setStatus("success");
    Router.push("/posts");
  }

  function fieldHandler(e) {
    setFields({ ...fields, [e.target.name]: e.target.value });
  }

  return (
    <div>
      <h1>Create Post</h1>
      <Nav />
      <form onSubmit={createHandler.bind(this)}>
        <input
          onChange={fieldHandler.bind(this)}
          type="text"
          placeholder="title"
          name="title"
        />
        <br />
        <textarea
          onChange={fieldHandler.bind(this)}
          name="content"
          id=""
          cols="30"
          rows="10"
        ></textarea>
        <br />
        <button type="submit">create post</button>
        <div>status : {status}</div>
      </form>
    </div>
  );
}
