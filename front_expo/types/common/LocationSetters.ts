import { Dispatch, SetStateAction } from "react";

export interface LocationSetters {
  setLatitude: Dispatch<SetStateAction<number | undefined>>;
  setLongitude: Dispatch<SetStateAction<number | undefined>>;
  setAddress: Dispatch<SetStateAction<string>>;
}
