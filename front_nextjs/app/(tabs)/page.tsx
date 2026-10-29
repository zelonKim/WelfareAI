"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import ReactMarkdown from "react-markdown";
import {
  Bot,
  BotMessageSquare,
  Send,
  User,
  Loader2,
  RotateCcw,
  ArrowUp,
} from "lucide-react";
import { client } from "@/api/client";
import { getConsultings } from "@/api/consult/getConsultings";
import { useCreateConsulting } from "@/hooks/consult/useCreateConsulting";
import { useDeleteConsulting } from "@/hooks/consult/useDeleteConsulting";
import { ConsultingItem } from "@/types/consult/ConsultingItem";
import { Message } from "@/types/consult/Message";
import { useDeleteAllConsulting } from "@/hooks/consult/useDeleteAllConsulting";
import { useAIConsultLanguage } from "@/hooks/languages/useAIConsultLanguage";
import { AutoPrompts } from "@/constants/AutoPrompts";

export default function AIConsultPage() {
  const router = useRouter();
  const { t } = useAIConsultLanguage();

  const chatBottomRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const [showTopBtn, setShowTopBtn] = useState(false);
  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);

  const { data: myInfo } = useQuery({
    queryKey: ["myInfo"],
    queryFn: async () => {
      const { data } = await client.get("/user/me");
      return data;
    },
  });

  useEffect(() => {
    if (myInfo && (!myInfo.termsAgreedAt || !myInfo.privacyAgreedAt)) {
      router.replace("/login");
    }
  }, [myInfo, router]);

  const { data: consultings, isPending: isFetchingHistory } = useQuery<
    ConsultingItem[]
  >({
    queryKey: ["consultings"],
    queryFn: getConsultings,
  });

  useEffect(() => {
    const formattedMessages: Message[] = [
      {
        id: "welcome",
        sender: "ai",
        text: t.welcomeMessage,
      },
    ];

    if (consultings) {
      const historyItems = [...consultings].reverse();
      historyItems.forEach((item) => {
        formattedMessages.push({
          id: `q-${item.id}`,
          sender: "user",
          text: item.question,
        });
        formattedMessages.push({
          id: `a-${item.id}`,
          sender: "ai",
          text: item.answer,
        });
      });
    }

    setMessages(formattedMessages);
  }, [consultings, t.welcomeMessage]);

  const { mutate: consultMutation, isPending: consultPending } =
    useCreateConsulting({
      setMessages,
      setInputText,
    });

  const handleSend = (e?: React.SubmitEvent<HTMLFormElement>) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || consultPending) return;
    consultMutation(inputText.trim());
  };

  const { mutate: deleteConsulting } = useDeleteConsulting();

  const handleContextMenu = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    const rawId = id.replace(/^(a-|q-|user-|ai-)/, "");

    if (rawId === "welcome") return;

    if (confirm(t.deleteItemConfirm)) {
      // 👈 다국어 적용
      deleteConsulting(rawId);
    }
  };

  const { mutate: deleteAllMutation } = useDeleteAllConsulting();

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      if (container.scrollTop > 300) {
        setShowTopBtn(true);
      } else {
        setShowTopBtn(false);
      }
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const scrollToTop = () => {
    scrollContainerRef.current?.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="flex flex-col h-screen mx-auto bg-[#F2F6F6] border-x border-[#1A3A3A]/10">
      <div ref={scrollContainerRef} className="flex-1 overflow-y-auto">
        <header className="flex items-center justify-between px-6 py-4 bg-white/80 border-b border-[#1A3A3A]/10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#FF7F66]/15 flex items-center justify-center">
              <BotMessageSquare className="w-6 h-6 text-[#FF7F66]" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#1A3A3A]">
              {t.headerTitle}
            </h1>
          </div>
          <button
            onClick={() => {
              if (window.confirm(t.deleteAllConfirm)) {
                deleteAllMutation();
              }
            }}
            className="cursor-pointer flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-3xl transition-colors border border-transparent hover:border-red-100"
            title={t.deleteAllTooltip}
          >
            <RotateCcw className="w-4.5 h-4.5" />
          </button>
        </header>

        <div className="scrollbar-none max-w-5xl mx-auto flex-1 overflow-y-auto px-4 sm:px-6 py-6 space-y-6">
          {isFetchingHistory ? (
            <div className="flex flex-col items-center justify-center h-full gap-3 text-[#6E8B8B]">
              <Loader2 className="w-8 h-8 animate-spin text-[#FF7F66]" />
              <p className="text-base font-medium">{t.fetchingHistory}</p>
            </div>
          ) : (
            <>
              {messages.map((item) => (
                <div
                  key={item.id}
                  className={`flex items-start gap-3 ${
                    item.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {item.sender === "ai" && (
                    <div className="w-9 h-9 rounded-full bg-[#1A3A3A] flex items-center justify-center shrink-0 mt-1">
                      <Bot className="w-5 h-5 text-white" />
                    </div>
                  )}

                  <div
                    className="max-w-[85%] md:max-w-[90%]"
                    onContextMenu={(e) => handleContextMenu(e, item.id)}
                    title={t.messageTooltip}
                  >
                    <div
                      className={`p-4 rounded-2xl text-base leading-relaxed ${
                        item.sender === "user"
                          ? "bg-[#1A3A3A] text-white rounded-tr-none"
                          : "bg-white text-[#1A3A3A] border border-[#1A3A3A]/10 shadow-sm rounded-tl-none"
                      }`}
                    >
                      {item.sender === "user" ? (
                        <p className="whitespace-pre-line text-base">
                          {item.text}
                        </p>
                      ) : (
                        <div className="prose prose-slate max-w-none text-[#1A3A3A] text-base leading-relaxed font-normal">
                          <ReactMarkdown
                            components={{
                              h3: ({ ...props }) => (
                                <h3
                                  className="text-lg font-bold text-[#1A3A3A] mt-3 mb-1"
                                  {...props}
                                />
                              ),
                              p: ({ ...props }) => (
                                <p
                                  className="mb-2 last:mb-0 leading-relaxed text-base"
                                  {...props}
                                />
                              ),
                              strong: ({ ...props }) => (
                                <strong
                                  className="font-bold text-[#1A3A3A]"
                                  {...props}
                                />
                              ),
                              ul: ({ ...props }) => (
                                <ul
                                  className="list-disc pl-5 my-2 space-y-1"
                                  {...props}
                                />
                              ),
                              li: ({ ...props }) => (
                                <li className="text-base" {...props} />
                              ),
                              a: ({ children, ...props }) => (
                                <a
                                  className="font-bold text-[#FF7F66] hover:underline hover:text-[#e66f57] transition-colors break-all"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  {...props}
                                >
                                  {children}
                                </a>
                              ),
                            }}
                          >
                            {item.text}
                          </ReactMarkdown>
                        </div>
                      )}
                    </div>
                  </div>

                  {item.sender === "user" && (
                    <div className="w-9 h-9 rounded-full bg-[#E2E8F0] flex items-center justify-center shrink-0 mt-1">
                      <User className="w-5 h-5 text-[#6E8B8B]" />
                    </div>
                  )}
                </div>
              ))}

              {consultPending && (
                <div className="flex items-start gap-3 justify-start">
                  <div className="w-9 h-9 rounded-full bg-[#1A3A3A] flex items-center justify-center shrink-0 mt-1">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <div className="p-4 rounded-2xl bg-white border border-[#1A3A3A]/10 shadow-sm rounded-tl-none flex items-center gap-3">
                    <Loader2 className="w-5 h-5 animate-spin text-[#FF7F66]" />
                    <span className="text-sm sm:text-base text-[#6E8B8B] font-medium">
                      {t.aiLoading}
                    </span>
                  </div>
                </div>
              )}
              <div ref={chatBottomRef} />
            </>
          )}
        </div>
      </div>

      {showTopBtn && (
        <button
          onClick={scrollToTop}
          className="absolute right-25 lg:right-6 bottom-28 lg:bottom-24 z-20 w-14 h-14 bg-[#1A3A3A] text-white rounded-full shadow-lg flex items-center justify-center hover:bg-[#2C5252] transition-all duration-300 animate-in fade-in slide-in-from-bottom-3 cursor-pointer"
          aria-label={t.scrollToTop}
          title={t.scrollToTop}
        >
          <ArrowUp className="w-6 h-6" />
        </button>
      )}

      <div className="p-3 pt-2.5 bg-[#F2F6F6] border-t border-[#1A3A3A]/10 shrink-0">
        <div className="flex gap-2 overflow-x-auto pb-2.5 no-scrollbar">
          {AutoPrompts.map((prompt, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setInputText(prompt.replace(/^[^\s]+\s/, ""))}
              className="bg-white px-3.5 py-1.5 rounded-full border border-[#1A3A3A]/10 text-sm font-medium text-[#1A3A3A] hover:bg-[#1A3A3A]/5 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              {prompt}
            </button>
          ))}
        </div>

        <form
          onSubmit={handleSend}
          className="flex items-center bg-white rounded-2xl px-4 py-1 border border-[#1A3A3A]/15 shadow-sm focus-within:border-[#FF7F66] transition-colors"
        >
          <input
            type="text"
            placeholder={t.inputPlaceholder}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={consultPending}
            className="flex-1 h-5 bg-transparent text-base text-[#1A3A3A] placeholder-[#A3B8B8] focus:outline-none disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || consultPending}
            className={`w-8 h-8 my-1.5 rounded-xl flex items-center justify-center transition-colors shrink-0 ml-2 ${
              inputText.trim() && !consultPending
                ? "cursor-pointer bg-[#FF7F66] text-white hover:bg-[#e66f57]"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
            aria-label={t.sendButton}
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
}
