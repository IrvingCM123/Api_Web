/*
  Warnings:

  - The primary key for the `HistorialPrestamo` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `Devoluciones_Realizadas` to the `GestionUsuario` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Prestamos_Pendientes` to the `GestionUsuario` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Fecha_Prestamo` to the `HistorialPrestamo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Pendiente` to the `HistorialPrestamo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ID_Usuario` to the `PrestamoDevolucion` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "GestionUsuario" ADD COLUMN     "Devoluciones_Realizadas" INTEGER NOT NULL,
ADD COLUMN     "Prestamos_Pendientes" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "HistorialPrestamo" DROP CONSTRAINT "HistorialPrestamo_pkey",
ADD COLUMN     "Fecha_Prestamo" VARCHAR(20) NOT NULL,
ADD COLUMN     "ID_Historial" SERIAL NOT NULL,
ADD COLUMN     "Pendiente" BOOLEAN NOT NULL,
ADD CONSTRAINT "HistorialPrestamo_pkey" PRIMARY KEY ("ID_Historial");

-- AlterTable
ALTER TABLE "PrestamoDevolucion" ADD COLUMN     "ID_Usuario" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "_GestionUsuarioToHistorialPrestamo" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_GestionUsuarioToHistorialPrestamo_AB_unique" ON "_GestionUsuarioToHistorialPrestamo"("A", "B");

-- CreateIndex
CREATE INDEX "_GestionUsuarioToHistorialPrestamo_B_index" ON "_GestionUsuarioToHistorialPrestamo"("B");

-- AddForeignKey
ALTER TABLE "PrestamoDevolucion" ADD CONSTRAINT "PrestamoDevolucion_ID_Usuario_fkey" FOREIGN KEY ("ID_Usuario") REFERENCES "User"("ID_Usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GestionUsuarioToHistorialPrestamo" ADD CONSTRAINT "_GestionUsuarioToHistorialPrestamo_A_fkey" FOREIGN KEY ("A") REFERENCES "GestionUsuario"("ID_Usuario") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GestionUsuarioToHistorialPrestamo" ADD CONSTRAINT "_GestionUsuarioToHistorialPrestamo_B_fkey" FOREIGN KEY ("B") REFERENCES "HistorialPrestamo"("ID_Historial") ON DELETE CASCADE ON UPDATE CASCADE;
