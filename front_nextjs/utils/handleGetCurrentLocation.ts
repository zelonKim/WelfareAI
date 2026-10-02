import { LocationSetters } from "@/types/common/LocationSetters";

export const handleGetCurrentLocation = async ({
  setLatitude,
  setLongitude,
  setAddress,
}: LocationSetters) => {
  // 1. 브라우저의 Geolocation 지원 여부 확인
  if (!navigator.geolocation) {
    alert("이 브라우저에서는 위치 서비스를 지원하지 않습니다.");
    return;
  }

  // 2. 브라우저 위치 정보 요청
  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;

      setLatitude(lat);
      setLongitude(lng);

      try {
        // 3. 좌표 -> 주소 변환 (OpenStreetMap Nominatim 무료 API 활용 예시)
        // 필요에 따라 카카오, 네이버, Google Maps API 호출로 교체 가능합니다.
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=ko`,
        );

        if (!response.ok) {
          throw new Error("역지오코딩 요청 실패");
        }

        const data = await response.json();

        if (data && data.display_name) {
          // OpenStreetMap API 결과 주소 정제 예시
          const formattedAddress =
            data.address.road ||
            data.address.suburb ||
            data.address.city ||
            data.display_name;

          setAddress(formattedAddress || "현재 위치 주소");
        } else {
          setAddress(`위도: ${lat.toFixed(4)}, 경도: ${lng.toFixed(4)}`);
        }
      } catch (error) {
        console.error("주소 변환 실패:", error);
        // 지오코딩 실패 시 좌표값 기본 표시
        setAddress(`위도: ${lat.toFixed(4)}, 경도: ${lng.toFixed(4)}`);
      }
    },
    (error) => {
      console.error("위치 가져오기 오류:", error);
      switch (error.code) {
        case error.PERMISSION_DENIED:
          alert(
            "위치 권한 요청이 거부되었습니다. 브라우저 설정에서 위치 권한을 허용해 주세요.",
          );
          break;
        case error.POSITION_UNAVAILABLE:
          alert("위치 정보를 사용할 수 없습니다.");
          break;
        case error.TIMEOUT:
          alert("위치 정보를 가져오는 시간이 초과되었습니다.");
          break;
        default:
          alert("현재 위치를 가져오는데 실패했습니다.");
          break;
      }
    },
    {
      enableHighAccuracy: true, // 높은 정확도 사용
      timeout: 10000, // 10초 타임아웃
      maximumAge: 0, // 캐시된 위치 정보 사용 금지
    },
  );
};
