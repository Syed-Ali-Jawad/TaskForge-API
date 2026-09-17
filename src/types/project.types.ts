import { ProjectStatus } from "../generated/prisma/enums";
import { SortOrder } from "../generated/prisma/internal/prismaNamespace";

interface ProjectBody {
  name: string;
  shortKey: string;
  description?: string;
}

interface ProjectQueries {
  page: number;
  pageSize: number;
  search?: string;
  shortKey?: string[];
  status?: ProjectStatus[];
  sortOrder?: SortOrder;
}

export { ProjectBody, ProjectQueries };
