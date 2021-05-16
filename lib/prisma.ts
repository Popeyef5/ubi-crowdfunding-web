import {
  Applicant,
  Certification,
  PrismaClient,
  Warning,
} from "@prisma/client";
import { formatDate, formatUndefined } from "./util";

const prisma = new PrismaClient();

export default prisma;

export type FullApplicant = Applicant & {
  certifications_emitted: Certification[];
  certifications_received: Certification[];
  warnings_emitted: Warning[];
  warnings_received: Warning[];
};

async function getFormattedData(model) {
  const results = await model.findMany();
  results.forEach((result) => {
    formatDate(result);
    formatUndefined(result);
  });
  return results;
}

export async function getFormattedApplicants() {
  return await getFormattedData(prisma.applicant);
}

export async function getFormattedCertifications() {
  return await getFormattedData(prisma.certification);
}

export async function getFormattedWarnings() {
  return await getFormattedData(prisma.warning);
}

export async function getFullApplicant(poh_account: string) {
  const applicant = await prisma.applicant.findUnique({
    where: {
      poh_account,
    },
    include: {
      certifications_emitted: true,
      certifications_received: true,
      warnings_emitted: true,
      warnings_received: true,
    },
  });
  return applicant;
}


