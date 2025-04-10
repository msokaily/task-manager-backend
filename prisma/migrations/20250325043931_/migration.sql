-- DropForeignKey
ALTER TABLE "Log" DROP CONSTRAINT "Log_taskId_fkey";

-- AlterTable
ALTER TABLE "Log" ALTER COLUMN "taskId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Log" ADD CONSTRAINT "Log_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE SET NULL ON UPDATE CASCADE;
