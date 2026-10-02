import { Message } from "./Message";

export interface UseCreateConsultingOptions {
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  setInputText: (text: string) => void;
}
