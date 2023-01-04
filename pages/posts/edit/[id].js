import React, { useState } from "react";
import { AuthPage } from "../middleware/authorization";
import Router from "next/router";
import Nav from "../../components/nav";

export async function getServerSideProps(context) {
  const { token } = await AuthPage(context);

  const { id } = context.query;

  const postHistoryReq = await fetch("http://localhost:3000/api/post/" + id, {
    method: "GET",
    headers: {
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify({ id: id }),
  });

  const postHistoryRes = await postHistoryReq.json();

  return {
    props: {
      token: token,
      post: postHistoryRes.data,
    },
  };
}

export default function PostEdit(props) {
  const { token, post } = props;

  const [fields, setFields] = useState({
    title: post.title,
    content: post.content,
  });
  const [status, setStatus] = useState("normal");

  async function updateHandler(e) {
    e.preventDefault();
    setStatus("loading");
    const postEditReq = await fetch(
      "http://localhost:3000/api/update" + post.id,
      {
        method: "PUT",
        headers: {
          Auhtorization: "Bearer " + token,
        },
        body: JSON.stringify(fields),
      }
    );

    if (!postEditReq.ok) return setStatus("error");
    const postEditRes = await postEditReq.json();
    setStatus("success");
    Router.push("/posts");
  }

  function fieldHandler(e) {
    setFields({ ...fields, [e.target.name]: e.target.value });
  }

  return (
    <div>
      <h1>Edit Post</h1>
      <Nav />
      <p>post id : {post.id}</p>
      <form onSubmit={updateHandler.bind(this)}>
        <input
          onChange={fieldHandler.bind(this)}
          type="text"
          placeholder="title"
          name="title"
          defaultValue={post.title}
        />
        <br />
        <textarea
          onChange={fieldHandler.bind(this)}
          name="content"
          id=""
          cols="30"
          rows="10"
          defaultValue={post.content}
        ></textarea>
        <br />
        <button type="submit">create post</button>
        <div>status : {status}</div>
      </form>
    </div>
  );
}
