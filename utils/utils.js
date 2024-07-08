export const provideBaseUrl = function (host, side) {
  if (side === "server") {
    return host === "localhost"
      ? "http://localhost:3036/"
      : "https://ecommerce-api-five-mocha.vercel.app/";
  } else if ((side = "client")) {
    return host === "localhost"
      ? "http://localhost:5173/"
      : "https://ecommerce-cli.vercel.app/";
  }
  return null;
};
