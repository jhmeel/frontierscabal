/* eslint-disable @typescript-eslint/no-explicit-any */

import LocalForageProvider from "./localforage";
// import yts from 'yt-search';

export const FormattedCount = (count: number | undefined): string | number => {
  if (!count) return 0;

  let formattedCount: string | number;

  if (count >= 1000000) {
    formattedCount = (count / 1000000).toFixed(1) + "m";
  } else if (count >= 1000) {
    formattedCount = (count / 1000).toFixed(1) + "k";
  } else {
    formattedCount = count.toString();
  }

  return formattedCount;
};

export function removeHtmlAndHashTags(caption: string): string {
  // Replace #/ with an empty string
  caption = caption.replace(/#\/+/g, "");

  // Replace HTML elements with an empty string
  caption = caption.replace(/<\/?([a-z][a-z0-9]*)\b[^>]*>/gi, "");

  // Replace ## with an empty string
  caption = caption.replace(/##/g, "");

  return caption;
}

export const padBalance = (balance: number | undefined): string => {
  if (!balance) {
    return "0.00";
  }
  balance = Number(balance);
  if (balance < 10 || (balance > 10 && balance < 1000)) {
    return balance.toFixed(2);
  } else {
    return balance.toLocaleString(undefined, { minimumFractionDigits: 2 });
  }
};

export const errorParser = (error: any): string => {
  const errMsg =
    error?.response?.data?.message ||
    error?.response?.statusText ||
    error?.message;
  if (errMsg?.includes("jwt")) {
    LocalForageProvider.removeAuthToken();
    return "Your session has expired, relogin into your account";
  } else if (
    errMsg?.includes("timeout") ||
    errMsg?.includes("Network Error") ||
    errMsg?.includes("timed out")
  ) {
    return "Request timeout. Please Check your network status and try again.";
  } else {
    return errMsg || "An error occurred.";
  }
};

export const getVideoDuration = async (
  youtubeUrl: string
): Promise<string | null> => {
  try {
    const video = { seconds: 343 };
    // await yts({ videoId: youtubeUrl });

    const durationSeconds = video.seconds;

    const hours = Math.floor(durationSeconds / 3600);
    const minutes = Math.floor((durationSeconds % 3600) / 60);
    const seconds = durationSeconds % 60;

    const formattedDuration = `${String(hours).padStart(2, "0")}h ${String(
      minutes
    ).padStart(2, "0")}m ${String(seconds).padStart(2, "0")}s`;
    return formattedDuration;
  } catch (error: any) {
    console.error("Error:", error.message);
    return null;
  }
};

export const getColonTimeFromDate = (date: Date | null): string | undefined => {
  return date?.toTimeString().slice(0, 8);
};
