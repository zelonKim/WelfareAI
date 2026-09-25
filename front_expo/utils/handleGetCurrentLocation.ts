import { LocationSetters } from "@/types/common/LocationSetters";
import * as Location from "expo-location";
import { Alert } from "react-native";

export const handleGetCurrentLocation = async ({
  setLatitude,
  setLongitude,
  setAddress,
}: LocationSetters) => {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== "granted") {
    Alert.alert("권한 필요", "위치 정보 접근 권한이 필요합니다.");
    return;
  }

  try {
    const location = await Location.getCurrentPositionAsync({});
    const { latitude: lat, longitude: lng } = location.coords;

    setLatitude(lat);
    setLongitude(lng);

    // 좌표를 주소로 변환 (Geocoding)
    const [reverseGeocode] = await Location.reverseGeocodeAsync({
      latitude: lat,
      longitude: lng,
    });

    if (reverseGeocode) {
      const formattedAddress = `${reverseGeocode.region || ""} ${
        reverseGeocode.city || ""
      } ${reverseGeocode.street || ""} ${
        reverseGeocode.streetNumber || ""
      }`.trim();

      setAddress(formattedAddress || "현재 위치 주소");
    }
  } catch (error) {
    Alert.alert("오류", "현재 위치를 가져오는데 실패했습니다.");
  }
};
