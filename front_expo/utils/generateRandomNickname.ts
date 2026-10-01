import { NAME_ADJECTIVES } from "@/constants/NameAdjectives";
import { NAME_NOUNS } from "@/constants/NameNouns";

export const generateRandomNickname = () => {
  const randomAdj =
    NAME_ADJECTIVES[Math.floor(Math.random() * NAME_ADJECTIVES.length)];
  const randomNoun = NAME_NOUNS[Math.floor(Math.random() * NAME_NOUNS.length)];
  const randomNumber = Math.floor(1000 + Math.random() * 9000); // 3자리 숫자 추가 (중복 방지)

  return `${randomAdj}${randomNoun}${randomNumber}`;
};
