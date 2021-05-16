import { NextApiRequest, NextApiResponse } from "next";
import prisma from '@ubicrowd/prisma'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req;

  switch (method) {
    case "GET":
      handleGET(res);
      break;
    default:
      handleNotAllowed(method, res);
  }
};

async function handleGET(res: NextApiResponse) {
  const warnings = await prisma.warning.findMany()
  res.status(200).json(warnings)
}

function handleNotAllowed(method: string, res: NextApiResponse) {
  res.setHeader("Allow", ["GET"]);
  res.status(405).end(`Method ${method} Not Allowed.`);
}
