-- AlterTable
ALTER TABLE "projects" ALTER COLUMN "status" SET DEFAULT 'ACTIVE';

-- AlterTable
ALTER TABLE "tasks" ADD COLUMN     "completionDate" TIMESTAMP(3),
ALTER COLUMN "status" SET DEFAULT 'TODO',
ALTER COLUMN "priority" SET DEFAULT 'MEDIUM';

-- AlterTable
ALTER TABLE "workspace_members" ALTER COLUMN "role" SET DEFAULT 'MEMBER';
