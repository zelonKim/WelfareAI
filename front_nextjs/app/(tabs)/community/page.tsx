"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Users, Plus, Loader2 } from "lucide-react";
import { getAllCommunityPosts } from "@/api/community/getAllCommunityPosts";
import { getMyCommunityPosts } from "@/api/community/getMyCommunityPosts";
import { CommunityItem } from "@/components/CommunityItem";
import CommunityModal from "@/components/CommunityModal";
import { CommunityTabs } from "@/constants/CommunityTabs";
import { useCreateCommunity } from "@/hooks/community/useCreateCommunity";
import { CommunityType } from "@/types/community/CommunityType";

export default function CommunityPage() {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [images, setImages] = useState<string[]>([]);
  const [communityType, setCommunityType] =
    useState<CommunityType>("SELF_HELP");
  const [selectedType, setSelectedType] = useState<"ALL" | "MY">("ALL");

  ////////////////////////////////////////////////////////////////////////////////////

  const {
    data: posts = [],
    isPending,
    isError,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["communityPosts", selectedType],
    queryFn: () => {
      if (selectedType === "MY") {
        return getMyCommunityPosts();
      }
      return getAllCommunityPosts();
    },
  });

  ////////////////////////////////////////////////////////////////////////////////////

  const { mutate: createCommunityMutation, isPending: createCommunityPending } =
    useCreateCommunity(() => {
      handleCloseModal();
      refetch();
    });

  const handleCreateCommunity = () => {
    if (!title.trim()) {
      alert("제목을 입력해 주세요.");
      return;
    }

    if (!content.trim()) {
      alert("상세 내용을 입력해 주세요.");
      return;
    }

    createCommunityMutation({
      title,
      content,
      images,
      type: communityType,
    });
  };

  ////////////////////////////////////////////////////////////////////////////////////

  const handleOpenModal = () => {
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setTitle("");
    setContent("");
    setImages([]);
    setCommunityType("SELF_HELP");
  };

  ////////////////////////////////////////////////////////////////////////////////////

  return (
    <div className="min-h-screen bg-[#F2F5F6] text-[#1A252C] flex flex-col">
      <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-[#1A3A3A]/10 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#FFEFEA] flex items-center justify-center shrink-0">
              <Users className="w-5 h-5 text-[#FF7F66]" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#1A252C]">
              소통 및 봉사 모임
            </h1>
          </div>

          {isRefetching && (
            <Loader2 className="w-5 h-5 text-[#FF7F66] animate-spin" />
          )}
        </div>
      </header>

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-6 pb-28">
        <div className="mb-6">
          <div className="flex bg-[#E4ECEF] p-1.5 rounded-2xl gap-1">
            {CommunityTabs.map((tab) => {
              const isActive = selectedType === tab.value;

              return (
                <button
                  key={tab.value}
                  type="button"
                  onClick={() => setSelectedType(tab.value)}
                  className={`flex-1 py-2.5 text-sm sm:text-base font-semibold rounded-xl transition-all cursor-pointer ${
                    isActive
                      ? "bg-white text-[#1A3A3A] shadow-sm font-bold"
                      : "text-[#6B7A85] hover:text-[#1A252C]"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {isPending ? (
          <div className="flex flex-col items-center justify-center py-32 text-gray-500 gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-[#FF7F66]" />
            <p className="text-base font-medium">모임 목록을 불러오는 중...</p>
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <p className="text-base sm:text-lg font-semibold text-red-500">
              목록을 불러오지 못했습니다.
            </p>
            <button
              type="button"
              onClick={() => refetch()}
              className="mt-3 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              다시 시도
            </button>
          </div>
        ) : posts.length > 0 ? (
          <div className="space-y-4">
            {posts.map((item) => (
              <CommunityItem key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <span className="text-5xl mb-3">💬</span>
            <p className="text-base sm:text-lg font-bold text-[#8E99A3]">
              등록된 모임이 없습니다.
            </p>
            <p className="text-sm sm:text-base text-gray-400 mt-1">
              새로운 모임을 만들어 사람들과 소통해 보세요!
            </p>
          </div>
        )}
      </main>

      <div className="fixed bottom-8 right-6 sm:right-10 z-30">
        <button
          type="button"
          onClick={handleOpenModal}
          className="flex items-center gap-2 px-5 py-3.5 bg-[#FF7F66] hover:bg-[#e66f57] outline-none active:scale-95 text-white rounded-full shadow-lg transition-all cursor-pointer"
        >
          <Plus className="w-5 h-5 stroke-[2.5]" />
          <span className="text-base font-bold">모임 만들기</span>
        </button>
      </div>

      <CommunityModal
        modalType="tabs"
        visible={modalVisible}
        onClose={handleCloseModal}
        title={title}
        setTitle={setTitle}
        content={content}
        setContent={setContent}
        communityType={communityType}
        setCommunityType={setCommunityType}
        createCommunityPending={createCommunityPending}
        handleCreateCommunity={handleCreateCommunity}
      />
    </div>
  );
}
