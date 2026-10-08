  export const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return { label: "제보 접수", style: "bg-amber-100 text-amber-800" };
      case "IN_PROGRESS":
        return { label: "조치 중", style: "bg-blue-100 text-blue-800" };
      case "RESOLVED":
        return { label: "조치 완료", style: "bg-green-100 text-green-800" };
      default:
        return { label: "접수", style: "bg-amber-100 text-amber-800" };
    }
  };