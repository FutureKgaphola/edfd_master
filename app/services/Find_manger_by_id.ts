import axios from "axios";

export const getManager = async (managerId: string): Promise<object> => {
  if (!managerId) return {};

  try {
    const resp = await axios.get(`/api/manager/retrivebyid?id=${managerId}`);
    if (resp.status === 200 && resp.data.Manager) {
      return resp.data.Manager;
    }
  } catch (error) {
    console.error("Error fetching manager:", error);
     return {};
  }

  return {};
};
