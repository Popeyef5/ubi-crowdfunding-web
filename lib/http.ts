import { signData } from "components/providers/web3";
import useSWR from "swr";

function fetcher(args: RequestInfo) {
  return fetch(args).then((res) => res.json());
}

export function useApplicants() {
  const { data, error } = useSWR("/api/applicants", fetcher);

  return {
    applicants: data,
    isLoading: !error && !data,
    isError: error,
  };
}

export function useApplicant(id: string | null) {
  const { data, error } = useSWR(id ? `/api/applicants/${id}` : null, fetcher);
  
  return {
    applicant: data,
    isLoading: !error && !data,
    isError: error,
  };
}

export function useTarget(id: string | null) {
  const { data, error, mutate } = useSWR(
    id ? `api/applicants/${id}/verify` : null,
    fetcher
  );

  return {
    target: data,
    isLoading: !error && !data,
    isError: error,
    mutate
  };
}

export function useWarnings() {
  const { data, error } = useSWR("/api/warnings", fetcher);

  return {
    warnings: data,
    isLoading: !error && !data,
    isError: error,
  };
}

async function postJSON(url: string, data: Object) {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  };
  return await fetch(url, requestOptions);
}

export async function createApplicant(poh_account: string) {
  const body = await signData({ poh_account }, poh_account);
  return await postJSON("/api/applicants", body);
}

export async function createCertification(issuer_id: string, target_id: string) {
  const body = await signData({ target_id }, issuer_id)
  return await postJSON(`/api/applicants/${issuer_id}/certifications`, body)
}

export async function createWarning(issuer_id: string, target_id: string) {
  const body = await signData({ target_id }, issuer_id)
  return await postJSON(`/api/applicants/${issuer_id}/warnings`, body)
}
