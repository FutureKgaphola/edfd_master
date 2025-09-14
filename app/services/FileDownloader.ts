import axios from "axios";
import { failureMessage } from "../notifications/successError";

export const handleDownload = async (
  id: string,
  username: string,
  ServerFileName: string,
  requester: string
) => {
  const apiRoutes: Record<string, string> = {
    holderId: `/api/users/download/leadpersonId?id=${id}&m=${username}`,
    marital: `/api/users/download/maritaldoc?id=${id}&m=${username}`,
    SpouceId: `/api/users/download/spouceId?id=${id}&m=${username}`,
    leadproofAddress: `/api/users/download/leadAddress?id=${id}&m=${username}`,
    leadproofBankng: `/api/users/download/leadBanking?id=${id}&m=${username}`,
    companyproofAddress : `/api/users/download/company/address/proofaddress?id=${id}&m=${username}`,
    leaseAgrement: `/api/users/download/company/address/lease?id=${id}&m=${username}`,
    companyproofBankng: `/api/users/download/company/banking/proof?id=${id}&m=${username}`,
  };

  const url = apiRoutes[requester];
  if (!url) {
    failureMessage("Invalid download request type.");
    return;
  }

  try {
    const resp = await axios.get(url, { responseType: 'blob' });
    if (resp.status !== 200 || !resp.data.size) {
      failureMessage(resp.statusText || "Download failed");
      return;
    }

    const blob = new Blob([resp.data]);
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.setAttribute('download', ServerFileName);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(downloadUrl);
  } catch (error: any) {
    failureMessage(error?.response?.statusText || "Network error during file download.");
  }
};
