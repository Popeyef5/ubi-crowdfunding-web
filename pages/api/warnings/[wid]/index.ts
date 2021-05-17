import { NextApiRequest, NextApiResponse } from "next";
import { getWarning } from "@ubicrowd/prisma"
import { Warning } from "@prisma/client";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const {
    query: { wid },
    method,
  } = req;

  const warning = await getWarning(Number(wid))
  
  switch (method) {
    case "GET":
      handleGET(warning, res);
      break;
    case "PUT":
      handlePUT(warning, res)
      break;
    default:
      handleNotAllowed(method, res);
  }
};

async function handleGET(warning: Warning, res: NextApiResponse) {  
  res.status(200).json({ warning });
}

function handlePUT(warning: Warning, res: NextApiResponse) {
  res.status(200).json({ message: "Not implemented" })
}

function handleNotAllowed(method: string, res: NextApiResponse) {
  res.setHeader("Allow", ["GET", "PUT"]);
  res.status(405).end(`Method ${method} Not Allowed.`);
}
