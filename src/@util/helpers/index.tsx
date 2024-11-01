export const getTextColor = (isDark: boolean) => ({
  color: isDark ? "#ffffff" : "#000000",
});

export const getBackgroundColor = (isDark: boolean) => ({
  background: isDark ? "#1f1f1f" : "#ffffff",
});

export const convertToHumanTime = (isoDate: string) => {
  const date = new Date(isoDate);

  const formattedDate = new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);

  return formattedDate;
};
