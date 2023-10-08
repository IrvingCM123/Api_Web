/*
  Warnings:

  - You are about to drop the column `ID_Usuario` on the `PrestamoDevolucion` table. All the data in the column will be lost.
  - Added the required column `ApellidoM_Usuario` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ApellidoP_Usuario` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "PrestamoDevolucion" DROP CONSTRAINT "PrestamoDevolucion_ID_Usuario_fkey";

-- AlterTable
ALTER TABLE "GestionUsuario" ALTER COLUMN "Fecha_Registro" SET DATA TYPE VARCHAR(20);

-- AlterTable
ALTER TABLE "PrestamoDevolucion" DROP COLUMN "ID_Usuario";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "ApellidoM_Usuario" VARCHAR(20) NOT NULL,
ADD COLUMN     "ApellidoP_Usuario" VARCHAR(20) NOT NULL;
