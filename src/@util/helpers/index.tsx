export const getTextColor = (isDark: boolean) => ({
  color: isDark ? "#ffffff" : "#000000",
});

export const getBackgroundColor = (isDark: boolean) => ({
  background: isDark ? "#1f1f1f" : "#ffffff",
});

export const convertToHumanTime = (isoDate: string) => {
  const date = new Date(isoDate);

  const day = date.getDate();
  const month = date.toLocaleString("en-US", { month: "short" });
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");

  return `${day} ${month} ${hours}:${minutes}`;
};
