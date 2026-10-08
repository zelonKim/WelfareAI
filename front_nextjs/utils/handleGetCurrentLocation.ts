import { LocationSetters } from "@/types/common/LocationSetters";

export const handleGetCurrentLocation = async ({
  setLatitude,
  setLongitude,
  setAddress,
}: LocationSetters) => {
  if (!navigator.geolocation) {
    alert("이 브라우저에서는 위치 서비스를 지원하지 않습니다.");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;

      setLatitude(lat);
      setLongitude(lng);

      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1&accept-language=ko`,
        );

        if (!response.ok) {
          throw new Error("역지오코딩 요청 실패");
        }

        const data = await response.json();

        if (data && data.address) {
          const addr = data.address;

          const city = addr.city || addr.province || addr.state || "";
          const borough =
            addr.borough || addr.suburb || addr.city_district || "";
          const neighbourhood =
            addr.quarter || addr.neighbourhood || addr.village || "";
          const road = addr.road || addr.pedestrian || "";
          const houseNumber = addr.house_number || "";

          const fullAddress = [city, borough, neighbourhood, road, houseNumber]
            .filter(Boolean)
            .join(" ");

          setAddress(fullAddress || data.display_name || "현재 위치 주소");
        } else {
          setAddress(`위도: ${lat.toFixed(4)}, 경도: ${lng.toFixed(4)}`);
        }
      } catch (error) {
        console.error("주소 변환 실패:", error);
        setAddress(`위도: ${lat.toFixed(4)}, 경도: ${lng.toFixed(4)}`);
      }
    },
    (error) => {
      console.error("위치 가져오기 오류:", error);
      alert("현재 위치를 가져오는데 실패했습니다.");
    },
    {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 0,
    },
  );
};
