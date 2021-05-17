import { NextApiRequest, NextApiResponse } from "next";
import { getCertification } from "@ubicrowd/prisma"
import { Certification } from "@prisma/client";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const {
    query: { cid },
    method,
  } = req;

  const certification = await getCertification(Number(cid))
  
  switch (method) {
    case "GET":
      handleGET(certification, res);
      break;
    case "PUT":
      handlePUT(certification, res)
      break;
    default:
      handleNotAllowed(method, res);
  }
};

async function handleGET(certification: Certification, res: NextApiResponse) {  
  res.status(200).json({ certification });
}

function handlePUT(certification: Certification, res: NextApiResponse) {
  res.status(200).json({ message: "Not implemented" })
}

function handleNotAllowed(method: string, res: NextApiResponse) {
  res.setHeader("Allow", ["GET", "PUT"]);
  res.status(405).end(`Method ${method} Not Allowed.`);
}
