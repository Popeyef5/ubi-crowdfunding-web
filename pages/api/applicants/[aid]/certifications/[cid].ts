import { NextApiRequest, NextApiResponse } from "next";
import { Applicant } from "@prisma/client";
import prisma from "@ubicrowd/prisma"

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const {
    query: { aid, cid },
    method,
  } = req;

  const applicant = await prisma.applicant.findUnique({
    where: {
      poh_account: aid as string,
    },
  });

  if (!applicant) return res.status(400).end("Bad Request.")

  switch (method) {
    case "GET":
      handleGET(aid as string, cid as string, res);
      break;
    case "PUT":
        handlePUT(applicant, res)
      break;
    default:
      handleNotAllowed(method, res);
  }
};

async function handleGET(
  issuer_id: string,
  target_id: string,
  res: NextApiResponse
) {
  const certification = await prisma.certification.findUnique({
    where: {
      issuer_id_target_id: {
        issuer_id,
        target_id
      }
    },
  });
  res.status(200).json(certification);
}

function handlePUT(applicant: Applicant, res: NextApiResponse) {}

function handleNotAllowed(method: string, res: NextApiResponse) {
  res.setHeader("Allow", ["GET", "PUT"]);
  res.status(405).end(`Method ${method} Not Allowed.`);
}
