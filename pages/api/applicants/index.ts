import { NextApiRequest, NextApiResponse } from "next";
import { verifySignature } from "../../../components/providers/web3";
import prisma from "@ubicrowd/prisma";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const {
    body: { data, signature },
    method,
  } = req;

  switch (method) {
    case "GET":
      handleGET(res);
      break;
    case "POST":
      handlePOST(data, signature, res);
      break;
    default:
      handleNotAllowed(method, res);
  }
};

async function handleGET(res: NextApiResponse) {
  const applicants = await prisma.applicant.findMany();
  res.status(200).json(applicants);
}

async function handlePOST(data: any, signature: string, res: NextApiResponse) {
  const { poh_account } = data;
  if (!poh_account) return res.status(400).end("Bad Request.");
  const verified = await verifySignature(data, poh_account, signature);
  if (!verified) return res.status(400).end("Unauthorized.");

  const applicant = await prisma.applicant.upsert({
    where: {
      poh_account,
    },
    create: {
      poh_account,
      signature,
    },
    update: {},
  });
  res.status(200).json(applicant);
}

function handleNotAllowed(method: string, res: NextApiResponse) {
  res.setHeader("Allow", ["GET", "POST"]);
  res.status(405).end(`Method ${method} Not Allowed.`);
}
