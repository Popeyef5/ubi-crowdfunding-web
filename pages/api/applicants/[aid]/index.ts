import { NextApiRequest, NextApiResponse } from "next";
import { FullApplicant, getFullApplicant } from "@ubicrowd/prisma"

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const {
    query: { aid },
    method,
  } = req;

  const applicant = await getFullApplicant(aid as string)
  
  switch (method) {
    case "GET":
      handleGET(applicant, res);
      break;
    case "PUT":
      handlePUT(applicant, res)
      break;
    default:
      handleNotAllowed(method, res);
  }
};

async function handleGET(applicant: FullApplicant, res: NextApiResponse) {  
  res.status(200).json({ applicant });
}

function handlePUT(applicant: FullApplicant, res: NextApiResponse) {
  res.status(200).json({ message: "Not implemented" })
}

function handleNotAllowed(method: string, res: NextApiResponse) {
  res.setHeader("Allow", ["GET", "PUT"]);
  res.status(405).end(`Method ${method} Not Allowed.`);
}
