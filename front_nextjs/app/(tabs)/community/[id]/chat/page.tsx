"use client";

import React, { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Send, Siren, Loader2 } from "lucide-react";
import { io, Socket } from "socket.io-client";
import { getBlockedUsers } from "@/api/block/getBlockedUsers";
import { getChatMessages } from "@/api/community/getChatMessages";
import { getCommunityDetail } from "@/api/community/getCommunityDetail";
import { getMyInfo } from "@/api/user/getMyInfo";
import { ChatItem } from "@/components/ChatItem";
import { ReportModal } from "@/components/ReportModal";
import { SOCKET_URL } from "@/constants/SocketUrl";
import { useBlockUser } from "@/hooks/block/useBlockUser";
import { BlockedItem } from "@/types/block/BlockedItem";
import { ChatMessage } from "@/types/community/ChatMessage";
import { UserProfile } from "@/types/user/UserProfile";

export default function CommunityChatScreen() {
  const { id: postId } = useParams<{ id: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<Socket | null>(null);
  const isSendingRef = useRef(false);

  const [isReportModalVisible, setIsReportModalVisible] = useState(false);
  const [initialUserName, setInitialUserName] = useState("");
  const [inputText, setInputText] = useState("");
  const [activePopoverItemId, setActivePopoverItemId] = useState<string | null>(
    null,
  );

  //////////////////////////////////////////////////////////////////////////////

  const scrollToBottom = (behavior: ScrollBehavior = "smooth") => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior,
      });
    }
  };

  //////////////////////////////////////////////////////////////////////////////

  useEffect(() => {
    if (!postId) return;

    // 소켓 초기화 및 연결
    const socket = io(SOCKET_URL, {
      transports: ["websocket"],
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      socket.emit("joinRoom", { postId });
    });

    // 실시간 신규 메시지 수신
    socket.on("newMessage", (newMessage: ChatMessage) => {
      queryClient.setQueryData<ChatMessage[]>(
        ["chatMessages", postId],
        (old = []) => [...old, newMessage],
      );
      setTimeout(() => scrollToBottom("smooth"), 100);
    });

    // 실시간 메시지 삭제 수신
    socket.on("messageDeleted", ({ messageId }: { messageId: string }) => {
      queryClient.setQueryData<ChatMessage[]>(
        ["chatMessages", postId],
        (old = []) => old.filter((msg) => msg.id !== messageId),
      );
    });

    return () => {
      // 채팅방 퇴장 및 소켓 연결 해제
      socket.emit("leaveRoom", { postId });
      socket.disconnect();
    };
  }, [postId, queryClient]);

  //////////////////////////////////////////////////////////////////////////////

  const { data: myInfo } = useQuery<UserProfile>({
    queryKey: ["myInfo"],
    queryFn: getMyInfo,
  });

  const currentUserId = myInfo?.id;

  //////////////////////////////////////////////////////////////////////////////

  const { data: post } = useQuery({
    queryKey: ["communityDetail", postId],
    queryFn: () => getCommunityDetail(postId!),
    enabled: !!postId,
  });

  const postTitle = post?.title || "모임 대화방";

  //////////////////////////////////////////////////////////////////////////////

  const {
    data: messages = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["chatMessages", postId],
    queryFn: () => getChatMessages(postId!),
    enabled: !!postId,
  });

  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom("auto");
    }
  }, [messages.length]);

  //////////////////////////////////////////////////////////////////////////////

  const handleSend = (e?: React.SubmitEvent<HTMLFormElement>) => {
    if (e) e.preventDefault();
    if (
      !inputText.trim() ||
      !postId ||
      !socketRef.current ||
      isSendingRef.current
    )
      return;

    isSendingRef.current = true;

    socketRef.current.emit("sendMessage", {
      postId,
      userId: currentUserId,
      message: inputText.trim(),
    });

    setInputText("");

    setTimeout(() => {
      isSendingRef.current = false;
    }, 100);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.nativeEvent.isComposing) return;
    
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  //////////////////////////////////////////////////////////////////////////////

  const handleDelete = (messageId: string) => {
    if (confirm("이 메시지를 삭제하시겠습니까?")) {
      if (postId && socketRef.current) {
        socketRef.current.emit("deleteMessage", {
          postId,
          userId: currentUserId,
          messageId,
        });
      }
    }
  };

  //////////////////////////////////////////////////////////////////////////////

  const handleProfilePress = (item: ChatMessage) => {
    if (item.user.id === myInfo?.id) return;
    setActivePopoverItemId((prev) => (prev === item.id ? null : item.id));
  };

  //////////////////////////////////////////////////////////////////////////////

  const { mutate: blockUserMutation } = useBlockUser();

  const handleBlockPress = (nickname: string) => {
    if (
      confirm(
        `정말 ${nickname}님을 차단하시겠습니까?\n차단한 사용자의 메시지는 더 이상 보이지 않습니다.`,
      )
    ) {
      blockUserMutation(nickname);
    }
  };

  //////////////////////////////////////////////////////////////////////////////

  const { data: blockedList = [] } = useQuery<BlockedItem[]>({
    queryKey: ["blockedUsers"],
    queryFn: getBlockedUsers,
  });

  //////////////////////////////////////////////////////////////////////////////

  const handleReportPress = (nickname: string) => {
    setIsReportModalVisible(true);
    setInitialUserName(nickname);
  };

  //////////////////////////////////////////////////////////////////////////////

  return (
    <div className="mx-auto flex h-screen max-w-5xl flex-col bg-slate-50 text-slate-900 shadow-sm">
      <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-5 shadow-xs">
        <button
          onClick={() => router.back()}
          className="cursor-pointer rounded-full p-2 text-slate-700 transition hover:bg-slate-100"
          aria-label="뒤로가기"
        >
          <ArrowLeft className="h-6 w-6" />
        </button>
        <h1 className="max-w-[70%] truncate text-lg font-bold text-slate-800">
          {postTitle}
        </h1>
        <button
          onClick={() => {
            setIsReportModalVisible(true);
            setInitialUserName("");
          }}
          className="cursor-pointer rounded-full p-2 text-red-500 transition hover:bg-red-50"
          aria-label="신고하기"
        >
          <Siren className="h-6 w-6" />
        </button>
      </header>

      <main
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto px-5 py-4 space-y-4"
      >
        {isLoading ? (
          <div className="flex h-full w-full items-center justify-center">
            <Loader2 className="h-9 w-9 animate-spin text-[#FF6C4B]" />
          </div>
        ) : isError ? (
          <div className="flex h-full w-full items-center justify-center">
            <p className="text-base text-red-500 font-medium">
              채팅 내역을 불러오지 못했습니다.
            </p>
          </div>
        ) : (
          messages
            .filter(
              (message) =>
                !blockedList.some(
                  (b) => b.blockedUser.nickname === message.user.nickname,
                ),
            )
            .map((item) => (
              <ChatItem
                key={item.id}
                item={item}
                currentUserId={currentUserId}
                handleDelete={handleDelete}
                handleProfilePress={handleProfilePress}
                activePopoverItemId={activePopoverItemId}
                setActivePopoverItemId={setActivePopoverItemId}
                handleReportPress={handleReportPress}
                handleBlockPress={handleBlockPress}
                blockedList={blockedList}
              />
            ))
        )}
      </main>

      <footer className="sticky bottom-0 z-10 border-t border-slate-200 bg-white p-3 sm:p-4">
        <form onSubmit={handleSend} className="flex items-end gap-2.5">
          <textarea
            className="flex-1 resize-none rounded-2xl bg-slate-100 px-4 py-3 text-base text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF6C4B]"
            rows={1}
            placeholder="메시지를 입력하세요."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            maxLength={500}
            style={{ maxHeight: "120px" }}
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#FF6C4B] text-white transition hover:bg-[#e05b3d] disabled:bg-slate-300 disabled:cursor-not-allowed"
            aria-label="전송"
          >
            <Send className="h-5 w-5" />
          </button>
        </form>
      </footer>

      <ReportModal
        visible={isReportModalVisible}
        onClose={() => setIsReportModalVisible(false)}
        initialUserName={initialUserName}
      />
    </div>
  );
}
