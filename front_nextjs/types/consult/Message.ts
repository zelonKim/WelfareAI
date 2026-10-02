export interface Message {
  id: string;
  sender: "ai" | "user";
  text: string;
}
