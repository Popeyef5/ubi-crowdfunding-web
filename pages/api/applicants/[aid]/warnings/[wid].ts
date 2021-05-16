import { NextApiRequest, NextApiResponse } from "next";
import { Applicant } from "@prisma/client";
import prisma from "@ubicrowd/prisma"

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const {
    query: { aid, wid },
    method,
  } = req;

  const applicant = await prisma.applicant.findUnique({
    where: {
      poh_account: aid as string,
    },
  });

  switch (method) {
    case "GET":
      handleGET(wid as string, applicant, res);
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
  const warning = await prisma.warning.findUnique({
    where: {
      id: Number(id),
    },
  });
  res.status(200).json(warning);
}

function handlePUT(applicant: Applicant, res: NextApiResponse) {}

function handleNotAllowed(method: string, res: NextApiResponse) {
  res.setHeader("Allow", ["GET", "PUT"]);
  res.status(405).end(`Method ${method} Not Allowed.`);
}
