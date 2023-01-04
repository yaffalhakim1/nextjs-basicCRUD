import cookies from "next-cookies";

export function unAuthPage(ctx) {
  return new Promise((resolve) => {
    const tokenCookies = cookies(ctx);

    if (tokenCookies.token) {
      return ctx.res.writeHead(302, { Location: "/posts" }).end();
    }
    return resolve("unauthorized");
  });
  //writeHead is a method of the response object that allows us to redirect the user to a different page
  //302 is a status code that means "temporary redirect"
}

export function AuthPage(ctx) {
  return new Promise((resolve) => {
    const tokenCookies = cookies(ctx);

    if (!tokenCookies.token) {
      return ctx.res.writeHead(302, { Location: "/auth/login" }).end();
    }
    return resolve({
      token: tokenCookies.token,
    });
  });
  //writeHead is a method of the response object that allows us to redirect the user to a different page
  //302 is a status code that means "temporary redirect"
}
