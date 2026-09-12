import { z } from "zod";

const paramsIdSchema = z.object({
  id: z.string(),
});

export { paramsIdSchema };
