import { AuthPage } from "../middleware/authorization";
import React, { useState } from "react";
import Router from "next/router";
import Nav from "../../components/nav";

export async function getServerSideProps(context) {
  const { token } = await AuthPage(context);
  const postReq = await fetch("http://localhost:3000/api/posts", {
    method: "GET",
    headers: {
      Authorization: "Bearer " + token,
    },
  });

  const postRes = await postReq.json();

  return {
    props: {
      postRes: postRes.data,
      token,
    },
  };
}

export default function PostIndex(props) {
  const [posts, setPosts] = useState(props.postRes);

  async function deleteHandler(e) {
    e.preventDefault();
    const { token } = props;
    const deleteWarning = confirm("Are you sure you want to delete this post?");
    if (deleteWarning) {
      const deleteReq = await fetch("http://localhost:3000/api/delete/" + id, {
        method: "DELETE",
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      const deleteRes = await deleteReq.json(); //ngilangin di database

      const postsFiltered = posts.filter((post) => post.id !== id && post);
      setPosts(postsFiltered); //ngilangin di tampilan
    }
  }

  function editHandler(id) {
    Router.push("/posts/edit/" + id);
  }
  return (
    <div>
      <h1>Post Index</h1>
      <Nav />
      {posts.map((post) => {
        return (
          <div key={post.id}>
            <h2>{post.title}</h2>
            <p>{post.body}</p>
            <div>
              <button onClick={editHandler.bind(this, post.id)}>edit</button>
              <button onClick={deleteHandler.bind(this, post.id)}>
                delete
              </button>
            </div>
            <hr />
          </div>
        );
      })}
    </div>
  );
}
