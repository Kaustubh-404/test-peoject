import { useApi } from "../../../../apis/base";

export const createSite = async (data: any): Promise<any> => {
  const { post } = useApi;
  return post("/client-sites", data);
};

export const getClientSites = async (clientId: string, page?: number, limit?: number): Promise<any> => {
  const { get } = useApi;

  const params = new URLSearchParams();
  if (page) params.append("page", page.toString());
  if (limit) params.append("limit", limit.toString());

  const queryString = params.toString() ? `?${params.toString()}` : "";
  return get(`/client-sites/${clientId}${queryString}`);
};

export const getClientSitesWithCounts = async (
  clientId: string,
  page: number = 1,
  limit: number = 10
): Promise<any> => {
  const { get } = useApi;
  return get(`/client-sites/count/${clientId}?limit=${limit}&page=${page}`);
};
