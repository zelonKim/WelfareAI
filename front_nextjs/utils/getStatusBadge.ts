export const getStatusBadge = (status: string, locale: "ko" | "en" = "ko") => {
  const isKo = locale === "ko";

  switch (status) {
    case "PENDING":
      return {
        label: isKo ? "제보 접수" : "Pending",
        style: "bg-amber-100 text-amber-800",
      };
    case "IN_PROGRESS":
      return {
        label: isKo ? "조치 중" : "In Progress",
        style: "bg-blue-100 text-blue-800",
      };
    case "RESOLVED":
      return {
        label: isKo ? "조치 완료" : "Resolved",
        style: "bg-green-100 text-green-800",
      };
    default:
      return {
        label: isKo ? "접수" : "Received",
        style: "bg-amber-100 text-amber-800",
      };
  }
};
