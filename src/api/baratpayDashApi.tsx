import axios from "axios";
import { getToken, removeToken } from "@/utills/tokenUtills";
import { v4 as uuidv4 } from "uuid";
import FingerprintJS from "@fingerprintjs/fingerprintjs";
import { showToast } from "@/utills/toasterContext";

/** Indian FY (Apr–Mar) as API session header, e.g. 25-26 for FY 2025-26. Uses Asia/Kolkata. */
export function getIndianFinancialYearSession(date: Date = new Date()): string {
  const formatter = new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "numeric",
  });
  const parts = formatter.formatToParts(date);
  const year = Number(parts.find((p) => p.type === "year")?.value ?? "0");
  const month = Number(parts.find((p) => p.type === "month")?.value ?? "0");
  const startYear = month >= 4 ? year : year - 1;
  const yy = (y: number) => String(y % 100).padStart(2, "0");
  return `${yy(startYear)}-${yy(startYear + 1)}`;
}

const getFingerprint = async () => {
  try {
    const fp = await FingerprintJS.load();
    const result = await fp.get();
    return result.visitorId;
  } catch (error) {
    console.error("Failed to get fingerprint", error);
    return null;
  }
};

// Create Axios instance
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_REACT_APP_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(async (config) => {
  const token = getToken();

  const id = localStorage.getItem("menuKey");
  if (token) {
    const uniqueid = uuidv4();
    const fingerprint = await getFingerprint();

    config.headers.Authorization = `${token}`;
    config.headers["authorization"] = `${token}`;
    config.headers["session"] = getIndianFinancialYearSession();
    config.headers["x-click-token"] = uniqueid;
    config.headers["fingerprint"] = fingerprint || "unknown";
    config.headers["menukey"] = id||"";
  }

  return config;
});

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
     if (error.response?.status === 401) {
    removeToken();
     window.location.href = "/login";
    }
    showToast(error.response?.data?.message ? error.response?.data?.message : error.response?.data?.message?.msg, "error");
    return Promise.reject(error);
  }
);

export default axiosInstance;
