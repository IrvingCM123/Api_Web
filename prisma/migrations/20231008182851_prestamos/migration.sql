/*
  Warnings:

  - Changed the type of `Numero_Copias` on the `Inventario` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `Copias_Disponibles` on the `Inventario` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `Copias_Disponibles_minimas` on the `Inventario` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Inventario" DROP COLUMN "Numero_Copias",
ADD COLUMN     "Numero_Copias" INTEGER NOT NULL,
DROP COLUMN "Copias_Disponibles",
ADD COLUMN     "Copias_Disponibles" INTEGER NOT NULL,
DROP COLUMN "Copias_Disponibles_minimas",
ADD COLUMN     "Copias_Disponibles_minimas" INTEGER NOT NULL;
