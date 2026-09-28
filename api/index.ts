import createApp from "../src/app";
import { swaggerUi, swaggerDocument } from "../src/config/swagger";

const app = createApp();

app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

export default app;
