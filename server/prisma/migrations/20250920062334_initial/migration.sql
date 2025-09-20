-- CreateTable
CREATE TABLE "public"."Diagnoser" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "organization" TEXT NOT NULL,

    CONSTRAINT "Diagnoser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Doctors" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "organization" TEXT NOT NULL,

    CONSTRAINT "Doctors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Patients" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "Patients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Disease" (
    "id" TEXT NOT NULL,
    "diagnoserid" TEXT NOT NULL,
    "patientid" TEXT NOT NULL,

    CONSTRAINT "Disease_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Files" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "metadata" TEXT NOT NULL,
    "uploadDate" TIMESTAMP(3) NOT NULL,
    "diseaseid" TEXT NOT NULL,

    CONSTRAINT "Files_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Analysis" (
    "id" TEXT NOT NULL,

    CONSTRAINT "Analysis_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Diagnoser_email_key" ON "public"."Diagnoser"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Doctors_email_key" ON "public"."Doctors"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Patients_email_key" ON "public"."Patients"("email");

-- AddForeignKey
ALTER TABLE "public"."Disease" ADD CONSTRAINT "Disease_diagnoserid_fkey" FOREIGN KEY ("diagnoserid") REFERENCES "public"."Diagnoser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Disease" ADD CONSTRAINT "Disease_patientid_fkey" FOREIGN KEY ("patientid") REFERENCES "public"."Patients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Files" ADD CONSTRAINT "Files_diseaseid_fkey" FOREIGN KEY ("diseaseid") REFERENCES "public"."Disease"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
