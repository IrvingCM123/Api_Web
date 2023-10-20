-- CreateTable
CREATE TABLE "CatalogoClasificacion" (
    "id_catalogo_clasificacion" SERIAL NOT NULL,
    "nombre_catalogo_clasificacion" VARCHAR(30) NOT NULL,

    CONSTRAINT "CatalogoClasificacion_pkey" PRIMARY KEY ("id_catalogo_clasificacion")
);

-- CreateTable
CREATE TABLE "CatalogoEditorial" (
    "id_catalogo_editorial" SERIAL NOT NULL,
    "nombre_catalogo_editorial" VARCHAR(30) NOT NULL,

    CONSTRAINT "CatalogoEditorial_pkey" PRIMARY KEY ("id_catalogo_editorial")
);

-- CreateTable
CREATE TABLE "CatalogoSeccionBiblioteca" (
    "id_catalogo_seccion_biblioteca" SERIAL NOT NULL,
    "nombre_catalogo_seccion_biblioteca" VARCHAR(30) NOT NULL,

    CONSTRAINT "CatalogoSeccionBiblioteca_pkey" PRIMARY KEY ("id_catalogo_seccion_biblioteca")
);

-- CreateTable
CREATE TABLE "CatalogoGenero" (
    "id_catalogo_genero" SERIAL NOT NULL,
    "nombre_catalogo_genero" VARCHAR(30) NOT NULL,

    CONSTRAINT "CatalogoGenero_pkey" PRIMARY KEY ("id_catalogo_genero")
);
