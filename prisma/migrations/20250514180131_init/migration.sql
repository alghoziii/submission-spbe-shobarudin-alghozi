/*
  Warnings:

  - You are about to drop the `BookProduct` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "BookProduct" DROP CONSTRAINT "BookProduct_bookId_fkey";

-- DropForeignKey
ALTER TABLE "BookProduct" DROP CONSTRAINT "BookProduct_warehouseId_fkey";

-- DropForeignKey
ALTER TABLE "CartItem" DROP CONSTRAINT "CartItem_productId_fkey";

-- DropForeignKey
ALTER TABLE "InvoiceItem" DROP CONSTRAINT "InvoiceItem_productId_fkey";

-- DropTable
DROP TABLE "BookProduct";

-- CreateTable
CREATE TABLE "BooksProduct" (
    "id" TEXT NOT NULL,
    "bookId" TEXT NOT NULL,
    "format" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "stock" INTEGER NOT NULL,
    "warehouseId" TEXT NOT NULL,

    CONSTRAINT "BooksProduct_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "BooksProduct" ADD CONSTRAINT "BooksProduct_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BooksProduct" ADD CONSTRAINT "BooksProduct_warehouseId_fkey" FOREIGN KEY ("warehouseId") REFERENCES "Warehouse"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "BooksProduct"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvoiceItem" ADD CONSTRAINT "InvoiceItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "BooksProduct"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
