-- AlterTable
ALTER TABLE "User" ADD COLUMN     "Ciudad_Usuario" VARCHAR(30),
ADD COLUMN     "Descripcion_Usuario" VARCHAR(255),
ADD COLUMN     "Direccion_Usuario" VARCHAR(30),
ADD COLUMN     "Edad_Usuario" INTEGER,
ADD COLUMN     "Telefono_Usuario" VARCHAR(30),
ALTER COLUMN "Nombre_Usuario" DROP NOT NULL,
ALTER COLUMN "Correo_Usuario" DROP NOT NULL,
ALTER COLUMN "Contrasena_Usuario" DROP NOT NULL,
ALTER COLUMN "ApellidoM_Usuario" DROP NOT NULL,
ALTER COLUMN "ApellidoP_Usuario" DROP NOT NULL;
