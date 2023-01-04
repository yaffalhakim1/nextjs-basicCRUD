import Link from "next/link";
import Cookie from "js-cookie";
import Router from "next/router";

export default function Nav() {
  function logoutHandler(e) {
    e.preventDefault();
    Cookie.remove("token");
    Router.replace("/auth/login");
  }

  return (
    <>
      <Link href="/posts">
        <a href="">post</a>
      </Link>
      <Link href="/posts/create">
        <a>create a new post</a>
      </Link>
      <a href="#" onClick={logoutHandler.bind(this)}>
        logout
      </a>
    </>
  );
}
