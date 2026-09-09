import createApp from "./src/app";
import env from "./src/config/env";

const server = createApp();

server.listen(env.port, () => {
  console.log(`Server is running on port ${env.port}`);
});
