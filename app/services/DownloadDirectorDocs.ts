
import axios from "axios";
import { failureMessage } from "../notifications/successError";

export const Handle_Download_DirectorDownload = async (
  id: string,
  email: string,
  regNo: string,
  index: string,
  ServerFileName:string
) => {
  const url = `/api/users/download/company/director?id=${id}&email=${email}&regNo=${regNo}&index=${index}`
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
