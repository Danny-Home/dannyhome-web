import { createRouteHandler } from "uploadthing/next";

import { AppFileRouter } from "./core";

export const { GET, POST } = createRouteHandler({
  router: AppFileRouter,
  config: {
    logLevel: "Debug"
  }
});
