import { NextApiRequest, NextApiResponse } from "next";
import { Applicant, Certification, PrismaClient } from "@prisma/client";
import prisma from "@ubicrowd/prisma";
import { verifySignature } from "components/providers/web3";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const {
    body: { data, signature },
    query: { aid },
    method,
  } = req;

  const applicant = await prisma.applicant.findUnique({
    where: {
      poh_account: aid as string,
    },
  });

  switch (method) {
    case "GET":
      handleGET(applicant, res);
      break;
    case "POST":
      handlePOST(data, signature, applicant, res);
      break;
    default:
      handleNotAllowed(method, res);
  }
};

async function handleGET(applicant: Applicant, res: NextApiResponse) {
  const certifications = await prisma.certification.findMany({
    where: {
      issuer: applicant,
    },
  });
  res.status(200).json({ certifications });
}

async function handlePOST(
  data: any,
  signature: string,
  applicant: Applicant,
  res: NextApiResponse
) {
  const { target_id } = data
  if (!target_id) return res.status(400).end("Bad Request.");
  const verified = await verifySignature(data, applicant.poh_account, signature)
  if (!verified) return res.status(400).end("Unauthorized.")

  const target: Applicant = await prisma.applicant.findUnique({
    where: {
      poh_account: target_id,
    },
  });

  if (!target) return res.status(400).end("Bad Request.");

  const certification: Certification = await prisma.certification.upsert({
    where:{
      issuer_id_target_id: {
        issuer_id: applicant.poh_account,
        target_id: target.poh_account
      }
    },
    create: {
      issuer: {
        connect: {
          poh_account: applicant.poh_account,
        },
      },
      target: {
        connect: {
          poh_account: target_id,
        },
      },
      signature
    },
    update: {}
  });
  res.status(200).json({ certification });
}

function handleNotAllowed(method: string, res: NextApiResponse) {
  res.setHeader("Allow", ["GET", "POST"]);
  res.status(405).end(`Method ${method} Not Allowed.`);
}
