-- CreateTable
CREATE TABLE "Applicant" (
    "poh_account" TEXT NOT NULL,
    "poh_status" TEXT NOT NULL DEFAULT E'Submitted',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "signature" TEXT NOT NULL,

    PRIMARY KEY ("poh_account")
);

-- CreateTable
CREATE TABLE "Certification" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "issuer_id" TEXT NOT NULL,
    "target_id" TEXT NOT NULL,
    "signature" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Warning" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dismissed_at" TIMESTAMP(3),
    "issuer_id" TEXT NOT NULL,
    "target_id" TEXT NOT NULL,
    "signature" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Certification.issuer_id_target_id_unique" ON "Certification"("issuer_id", "target_id");

-- CreateIndex
CREATE UNIQUE INDEX "Warning.issuer_id_target_id_unique" ON "Warning"("issuer_id", "target_id");

-- AddForeignKey
ALTER TABLE "Certification" ADD FOREIGN KEY ("issuer_id") REFERENCES "Applicant"("poh_account") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Certification" ADD FOREIGN KEY ("target_id") REFERENCES "Applicant"("poh_account") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Warning" ADD FOREIGN KEY ("issuer_id") REFERENCES "Applicant"("poh_account") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Warning" ADD FOREIGN KEY ("target_id") REFERENCES "Applicant"("poh_account") ON DELETE CASCADE ON UPDATE CASCADE;
