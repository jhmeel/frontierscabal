import toast from "react-hot-toast";
export const genUniqueShortname = (email: string): string => {
  const username: string = email.split("@")[0];
  return `@` + username;
};

export const genRandomColor = () => {
  const n = (Math.random() * 0xfffff * 1000000).toString(16);
  return "#" + n.slice(0, 6);
};

export const isOnline = () => {
  return navigator.onLine;
};

export const formatTime = (time: number): string => {
  //formarting duration of video
  if (isNaN(time)) {
    return "00:00";
  }

  const date = new Date(time * 1000);
  const hours = date.getUTCHours();
  const minutes = date.getUTCMinutes();
  const seconds = date.getUTCSeconds().toString().padStart(2, "0");
  if (hours) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")} `;
  } else {
    return `${minutes}:${seconds}`;
  }
};

export const formatBytes = (bytes: number | null) => {
  if (bytes === null) return "N/A";
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  if (bytes === 0) return "0 Byte";
  const i = parseInt(String(Math.floor(Math.log(bytes) / Math.log(1024))));
  return Math.round(100 * (bytes / Math.pow(1024, i))) / 100 + " " + sizes[i];
};

export const isYouTubeVideoActive = async (
  videoUrl: string
): Promise<{ response: boolean | Response; loading: boolean }> => {
  let loading = false;
  const videoId = videoUrl.split("v=")[1];

  try {
    loading = true;

    const response = await fetch(
      `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}`
    );
    loading = false;

    return { response: response.ok, loading };
  } catch (error: any) {
    loading = false;
    return { response: false, loading };
  }
};
