// hooks/useCreateConsulting.ts
import { createConsulting } from "@/api/consult/createConsulting";
import { ConsultingItem } from "@/types/consult/ConsultingItem";
import { Message } from "@/types/consult/Message";
import { UseCreateConsultingOptions } from "@/types/consult/UseCreateConsultingOptions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Alert } from "react-native";

export const useCreateConsulting = ({
  setMessages,
  setInputText,
}: UseCreateConsultingOptions) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userQuestion: string) =>
      createConsulting({ question: userQuestion }),

    onMutate: async (userQuestion) => {
      const tempUserId = Date.now().toString();
      const userMsg: Message = {
        id: `temp-${tempUserId}`,
        sender: "user",
        text: userQuestion,
      };
      setMessages((prev) => [...prev, userMsg]);
      setInputText("");
    },

    onSuccess: (data: ConsultingItem) => {
      const aiMsg: Message = {
        id: data.id || Date.now().toString(),
        sender: "ai",
        text: data.answer,
      };
      setMessages((prev) => [...prev, aiMsg]);
      queryClient.invalidateQueries({ queryKey: ["consultings"] });
    },

    onError: (error) => {
      console.log("Create Consulting Error:", error);
      Alert.alert(
        "오류",
        "AI 상담 중 문제가 발생했습니다. 다시 시도해 주세요.",
      );
    },
  });
};
