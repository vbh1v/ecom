-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "status" "OrderEventStatus" NOT NULL DEFAULT 'PENDING';
