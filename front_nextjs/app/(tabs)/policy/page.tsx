"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { FileText, Search, Loader2, ArrowUp } from "lucide-react";
import { getPolicies } from "@/api/policy/getPolicies";
import { PolicyListItem } from "@/components/PolicyListItem";
import { CATEGORIES, Category } from "@/constants/Category";

export default function PolicyPage() {
  const [keyword, setKeyword] = useState<string>("");
  const [debouncedKeyword, setDebouncedKeyword] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<Category>("전체");
  const [showScrollTop, setShowScrollTop] = useState<boolean>(false);
  const observerTargetRef = useRef<HTMLDivElement>(null);

  ////////////////////////////////////////////////////////////////////////////////////

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isFetching } =
    useInfiniteQuery({
      queryKey: [
        "policies",
        { keyword: debouncedKeyword, category: selectedCategory },
      ],
      queryFn: ({ pageParam = 1 }) =>
        getPolicies({
          pageNo: pageParam,
          numOfRows: 10,
          category: selectedCategory,
          keyword: debouncedKeyword,
        }),
      getNextPageParam: (lastPage, allPages) => {
        const maxPages = Math.ceil(lastPage.totalCount / 10);
        const nextPage = allPages.length + 1;
        return nextPage <= maxPages ? nextPage : undefined;
      },
      initialPageParam: 1,
      staleTime: 1000 * 60 * 60 * 24,
    });

  const totalCount = data?.pages[0]?.totalCount;
  const policiesList = data?.pages.flatMap((page) => page.items) || [];

  ////////////////////////////////////////////////////////////////////////////////////

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [target] = entries;
      if (target.isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage],
  );

  ////////////////////////////////////////////////////////////////////////////////////

  useEffect(() => {
    const element = observerTargetRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(handleObserver, {
      threshold: 0.5,
    });

    observer.observe(element);
    return () => observer.unobserve(element);
  }, [handleObserver]);

  ////////////////////////////////////////////////////////////////////////////////////

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedKeyword(keyword);
    }, 300);
    return () => clearTimeout(timer);
  }, [keyword]);

  ////////////////////////////////////////////////////////////////////////////////////

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  ////////////////////////////////////////////////////////////////////////////////////

  const handleSelectCategory = (name: Category) => {
    setSelectedCategory(name);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  ////////////////////////////////////////////////////////////////////////////////////

  return (
    <div className="relative min-h-screen bg-[#F2F6F6] text-[#1A3A3A]">
      <header className="flex items-center justify-between px-6 py-4  bg-white/80 border-b border-[#1A3A3A]/10 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#FF7F66]/15 flex items-center justify-center">
            <FileText className="w-5 h-5 text-[#FF7F66]" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#1A3A3A]">
            복지 지원 정책
          </h1>
        </div>
      </header>

      <div className="lg:mx-24 xl:mx-48 px-4 sm:px-6 pb-20">
        <section className="mt-4 mb-3">
          <div className="relative flex items-center bg-white rounded-xl  border-gray-100 shadow-xs focus-within:border-[#FF7F66]  border-2 transition-colors">
            <Search className="absolute left-4 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="검색어를 입력해 보세요."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="w-full h-12 pl-12 pr-4 bg-transparent text-base text-gray-800 placeholder-gray-400 focus:outline-none"
            />
          </div>
        </section>

        <section className="mb-6 mx-auto overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-2 py-1 w-max">
            {CATEGORIES.map((cate) => {
              const isSelected = selectedCategory === cate;
              return (
                <button
                  key={cate || "all"}
                  type="button"
                  onClick={() => handleSelectCategory(cate)}
                  className={`px-4 py-2 rounded-full text-sm sm:text-base font-semibold transition-all shrink-0 cursor-pointer ${
                    isSelected
                      ? "bg-[#1A3A3A] text-white shadow-md"
                      : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  <span>{cate}</span>
                  {isSelected && (
                    <span className="ml-1 text-xs sm:text-sm font-normal">
                      {isFetching && !data ? (
                        <Loader2 className="inline w-3.5 h-3.5 animate-spin ml-1" />
                      ) : totalCount !== undefined ? (
                        ` (${totalCount})`
                      ) : (
                        ""
                      )}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </section>

        <main className="space-y-4">
          {policiesList.length > 0 ? (
            policiesList.map((item) => (
              <PolicyListItem key={item.id} item={item} />
            ))
          ) : !isFetching ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <span className="text-5xl mb-3">🔍</span>
              <h3 className="text-lg font-bold text-gray-800">
                검색 결과가 없습니다
              </h3>
              <p className="text-sm sm:text-base text-gray-500 mt-1">
                다른 검색어나 다른 카테고리를 선택해 보세요.
              </p>
            </div>
          ) : null}

          <div
            ref={observerTargetRef}
            className="flex items-center justify-center py-12 h-24"
          >
            {isFetchingNextPage || (isFetching && !data) ? (
              <div className="flex items-center gap-2 text-gray-500 font-medium text-sm sm:text-base">
                <Loader2 className="w-8 h-8 animate-spin text-[#1A3A3]" />
              </div>
            ) : null}
          </div>
        </main>
      </div>

      {showScrollTop && (
        <button
          type="button"
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-50 p-3.5 bg-[#1A3A3A] hover:bg-[#255252] text-white rounded-full shadow-lg transition-all duration-300 active:scale-95 cursor-pointer flex items-center justify-center"
          aria-label="맨 위로 이동"
        >
          <ArrowUp className="w-6 h-6" />
        </button>
      )}
    </div>
  );
}
