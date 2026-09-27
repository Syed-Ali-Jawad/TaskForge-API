import { z } from "zod";
import { SortOrder } from "../generated/prisma/internal/prismaNamespace";
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from "../../constants";

const paramsIdSchema = z.object({
  id: z.uuid("Invalid UUID"),
});

const sortQuerySchema = z
  .object({
    sortBy: z.string().transform((val) => val.trim()),
    sortOrder: z.enum(SortOrder),
  })
  .optional();

const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(DEFAULT_PAGE),
  pageSize: z.coerce.number().int().min(5).max(100).default(DEFAULT_PAGE_SIZE),
});

export { paramsIdSchema, sortQuerySchema, paginationSchema };
