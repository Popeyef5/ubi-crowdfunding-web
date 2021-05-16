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

  switch (method) {
    case "GET":
      handleGET(cid as string, applicant, res);
      break;
    case "PUT":
        handlePUT(applicant, res)
      break;
    default:
      handleNotAllowed(method, res);
  }
};

async function handleGET(
  id: string,
  applicant: Applicant,
  res: NextApiResponse
) {
  const certification = await prisma.certification.findUnique({
    where: {
      id: Number(id),
    },
  });
  res.status(200).json(certification);
}

function handlePUT(applicant: Applicant, res: NextApiResponse) {}

function handleNotAllowed(method: string, res: NextApiResponse) {
  res.setHeader("Allow", ["GET", "PUT"]);
  res.status(405).end(`Method ${method} Not Allowed.`);
}
