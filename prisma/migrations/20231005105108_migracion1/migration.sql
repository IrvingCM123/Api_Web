-- CreateTable
CREATE TABLE "User" (
    "ID_Usuario" SERIAL NOT NULL,
    "url_imagen" VARCHAR(255),
    "Nombre_Usuario" VARCHAR(30) NOT NULL,
    "Correo_Usuario" VARCHAR(30) NOT NULL,
    "Contrasena_Usuario" VARCHAR(30) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("ID_Usuario")
);

-- CreateTable
CREATE TABLE "GestionUsuario" (
    "ID_Usuario" INTEGER NOT NULL,
    "Candidato_Prestamo" BOOLEAN NOT NULL,
    "Fecha_Registro" VARCHAR(10) NOT NULL,

    CONSTRAINT "GestionUsuario_pkey" PRIMARY KEY ("ID_Usuario")
);

-- CreateTable
CREATE TABLE "Libro" (
    "ISBN" VARCHAR(20) NOT NULL,

    CONSTRAINT "Libro_pkey" PRIMARY KEY ("ISBN")
);

-- CreateTable
CREATE TABLE "Revista" (
    "ISSN" VARCHAR(20) NOT NULL,

    CONSTRAINT "Revista_pkey" PRIMARY KEY ("ISSN")
);

-- CreateTable
CREATE TABLE "PrestamoDevolucion" (
    "ID_Prestamo" SERIAL NOT NULL,
    "ISBN" VARCHAR(20),
    "ISSN" VARCHAR(20),
    "ID_Usuario" INTEGER NOT NULL,
    "Status" BOOLEAN NOT NULL,
    "Fecha_prestamo" VARCHAR(20) NOT NULL,
    "Fecha_devolucion" VARCHAR(20) NOT NULL,

    CONSTRAINT "PrestamoDevolucion_pkey" PRIMARY KEY ("ID_Prestamo")
);

-- CreateTable
CREATE TABLE "Inventario" (
    "ID_Articulo" SERIAL NOT NULL,
    "ISBN" VARCHAR(20),
    "ISSN" VARCHAR(20),
    "Seccion_Biblioteca" VARCHAR(10) NOT NULL,
    "Numero_Copias" VARCHAR(10) NOT NULL,
    "Copias_Disponibles" VARCHAR(10) NOT NULL,
    "Copias_Disponibles_minimas" VARCHAR(10) NOT NULL,

    CONSTRAINT "Inventario_pkey" PRIMARY KEY ("ID_Articulo")
);

-- CreateTable
CREATE TABLE "HistorialPrestamo" (
    "ID_Usuario" INTEGER NOT NULL,
    "ID_Prestamo" INTEGER NOT NULL,

    CONSTRAINT "HistorialPrestamo_pkey" PRIMARY KEY ("ID_Usuario","ID_Prestamo")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_Correo_Usuario_key" ON "User"("Correo_Usuario");

-- AddForeignKey
ALTER TABLE "GestionUsuario" ADD CONSTRAINT "GestionUsuario_ID_Usuario_fkey" FOREIGN KEY ("ID_Usuario") REFERENCES "User"("ID_Usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PrestamoDevolucion" ADD CONSTRAINT "PrestamoDevolucion_ISSN_fkey" FOREIGN KEY ("ISSN") REFERENCES "Revista"("ISSN") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PrestamoDevolucion" ADD CONSTRAINT "PrestamoDevolucion_ISBN_fkey" FOREIGN KEY ("ISBN") REFERENCES "Libro"("ISBN") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PrestamoDevolucion" ADD CONSTRAINT "PrestamoDevolucion_ID_Usuario_fkey" FOREIGN KEY ("ID_Usuario") REFERENCES "User"("ID_Usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inventario" ADD CONSTRAINT "Inventario_ISSN_fkey" FOREIGN KEY ("ISSN") REFERENCES "Revista"("ISSN") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inventario" ADD CONSTRAINT "Inventario_ISBN_fkey" FOREIGN KEY ("ISBN") REFERENCES "Libro"("ISBN") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HistorialPrestamo" ADD CONSTRAINT "HistorialPrestamo_ID_Usuario_fkey" FOREIGN KEY ("ID_Usuario") REFERENCES "User"("ID_Usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HistorialPrestamo" ADD CONSTRAINT "HistorialPrestamo_ID_Prestamo_fkey" FOREIGN KEY ("ID_Prestamo") REFERENCES "PrestamoDevolucion"("ID_Prestamo") ON DELETE RESTRICT ON UPDATE CASCADE;
