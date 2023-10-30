import ip from "public-ip";
import { useQuery } from "react-query";

export async function getIP() {
  return await ip.v4();
}

export function useIP() {
  return useQuery(["IP"], getIP);
}
