import { createConsulting } from "@/api/consult/createConsulting";
import { ApiErrorRes } from "@/types/common/ApiErrorRes";
import { ConsultingItem } from "@/types/consult/ConsultingItem";
import { Message } from "@/types/consult/Message";
import { UseCreateConsultingOptions } from "@/types/consult/UseCreateConsultingOptions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

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

    onError: (error: AxiosError<ApiErrorRes>) => {
      console.log("Create Consulting Error:", error);
      const message =
        error.response?.data?.message || "AI 상담 중 문제가 발생했습니다. 다시 시도해 주세요.";
      alert(message);
    },
  });
};
