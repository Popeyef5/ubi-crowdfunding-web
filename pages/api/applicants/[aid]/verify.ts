import prisma, {
  FullApplicant,
  getFullApplicant,
} from "@ubicrowd/prisma";
import { verifySignature } from "components/providers/web3";
import { NextApiRequest, NextApiResponse } from "next";

async function getPossibleTargets(applicant: FullApplicant) {
  // No influence traffic or revenge warnings allowed
  const exempted: string[] = Array.prototype.concat(
    applicant.certifications_emitted.map((c) => c.target_id),
    applicant.certifications_received.map((c) => c.issuer_id),
    applicant.warnings_emitted.map((w) => w.target_id),
    applicant.warnings_received.map((w) => w.issuer_id)
  );

  const targets = await prisma.applicant.findMany({
    where: {
      poh_account: {
        not: applicant.poh_account,
        notIn: exempted,
      },
      poh_status: "Submitted",
    },
  });

  return targets;
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const {
    body: { data, signature },
    query: { aid },
    method,
  } = req;

  const applicant = await getFullApplicant(aid as string);

  if (!applicant) return res.status(400).end("Bad Request.");

  switch (method) {
    case "GET":
      handleGET(applicant, res);
      break;
    default:
      handleNotAllowed(method, res);
  }
};

async function handleGET(applicant: FullApplicant, res: NextApiResponse) {
  const targets = await getPossibleTargets(applicant);
  if (!targets || !targets.length)
    return res.status(200).json({ target: null });
  const luckyId = Math.floor(Math.random() * targets.length);
  const target = targets[luckyId];
  res.status(200).json( target );
}

async function handleNotAllowed(method: string, res: NextApiResponse) {
  res.setHeader("Allow", ["GET"]);
  res.status(400).end(`Method ${method} Not Allowed.`);
}
