-- AlterTable
ALTER TABLE "Meetup" ALTER COLUMN "endTime" SET DEFAULT NOW() + interval '1 hour';
