import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ChevronLeft,
  ChevronRight,
  ChevronLeft as ChevronLeftIcon,
  Shuffle,
  Volume2,
  RotateCw,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { useFlashcardSetDetail } from "@/hooks/useFlashcards";

export default function StudentFlashcardStudyPage() {
  const { id } = useParams();
  const { data: set, isLoading } = useFlashcardSetDetail(id);

  const originalCards = useMemo(() => set?.flashcards || [], [set]);
  const [order, setOrder] = useState([]); // mảng index cho phép shuffle
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [completed, setCompleted] = useState(false);
  const audioRef = useRef(null);

  // Reset order khi cards thay đổi
  useEffect(() => {
    if (originalCards.length > 0) {
      setOrder(originalCards.map((_, i) => i));
      setCurrentIdx(0);
      setIsFlipped(false);
      setCompleted(false);
    }
  }, [originalCards]);

  const card = originalCards[order[currentIdx]];

  const goNext = useCallback(() => {
    if (currentIdx >= order.length - 1) {
      setCompleted(true);
      return;
    }
    setCurrentIdx((i) => i + 1);
    setIsFlipped(false);
  }, [currentIdx, order.length]);

  const goPrev = useCallback(() => {
    if (currentIdx <= 0) return;
    setCurrentIdx((i) => i - 1);
    setIsFlipped(false);
  }, [currentIdx]);

  const handleShuffle = useCallback(() => {
    const shuffled = [...order];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    setOrder(shuffled);
    setCurrentIdx(0);
    setIsFlipped(false);
    setCompleted(false);
  }, [order]);

  const handleRestart = useCallback(() => {
    setOrder(originalCards.map((_, i) => i));
    setCurrentIdx(0);
    setIsFlipped(false);
    setCompleted(false);
  }, [originalCards]);

  const handleFlip = useCallback(() => {
    if (!completed) setIsFlipped((f) => !f);
  }, [completed]);

  const handlePlayAudio = (e) => {
    e.stopPropagation();
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
    }
  };

  // Keyboard shortcuts: Space = flip, Arrows = navigate
  useEffect(() => {
    const onKey = (e) => {
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA")
        return;
      if (e.code === "Space") {
        e.preventDefault();
        handleFlip();
      } else if (e.code === "ArrowRight") {
        goNext();
      } else if (e.code === "ArrowLeft") {
        goPrev();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handleFlip, goNext, goPrev]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!set) {
    return <div>Không tìm thấy bộ flashcard</div>;
  }

  if (originalCards.length === 0) {
    return (
      <div className="space-y-6">
        <Link
          to={`/student/modules/${set.module?.id || set.moduleId}`}
          className="inline-flex items-center text-sm text-gray-600 hover:text-blue-600"
        >
          <ChevronLeftIcon className="h-4 w-4 mr-1" />
          Quay lại module
        </Link>
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-gray-500">Bộ flashcard này chưa có thẻ nào</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Header */}
      <div>
        <Link
          to={`/student/modules/${set.module?.id || set.moduleId}`}
          className="inline-flex items-center text-sm text-gray-600 hover:text-blue-600 mb-2"
        >
          <ChevronLeftIcon className="h-4 w-4 mr-1" />
          {set.module?.title || "Quay lại module"}
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">{set.title}</h1>
        {set.description && (
          <p className="text-gray-600 mt-1">{set.description}</p>
        )}
      </div>

      {completed ? (
        <Card>
          <CardContent className="text-center py-16">
            <CheckCircle2 className="h-16 w-16 text-emerald-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              🎉 Hoàn thành!
            </h2>
            <p className="text-gray-600 mb-6">
              Bạn đã xem hết {originalCards.length} thẻ trong bộ này
            </p>
            <div className="flex justify-center gap-3">
              <Button variant="outline" onClick={handleRestart}>
                <RotateCw className="mr-2 h-4 w-4" />
                Học lại từ đầu
              </Button>
              <Button onClick={handleShuffle}>
                <Shuffle className="mr-2 h-4 w-4" />
                Học lại (xáo bài)
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Progress + controls */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <span className="text-sm font-medium text-gray-600 whitespace-nowrap">
                {currentIdx + 1} / {originalCards.length}
              </span>
              <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 transition-all"
                  style={{
                    width: `${((currentIdx + 1) / originalCards.length) * 100}%`,
                  }}
                />
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleShuffle}
              title="Xáo bài"
            >
              <Shuffle className="h-4 w-4" />
            </Button>
          </div>

          {/* Card with flip animation */}
          <div
            className="relative cursor-pointer select-none"
            style={{ perspective: "1000px", minHeight: "320px" }}
            onClick={handleFlip}
          >
            <div
              className="relative w-full transition-transform duration-500"
              style={{
                transformStyle: "preserve-3d",
                transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
                minHeight: "320px",
              }}
            >
              {/* Front */}
              <Card
                className="absolute inset-0"
                style={{
                  backfaceVisibility: "hidden",
                  WebkitBackfaceVisibility: "hidden",
                }}
              >
                <CardContent className="flex flex-col items-center justify-center text-center p-8 min-h-[320px]">
                  {card.imageUrl && (
                    <img
                      src={card.imageUrl}
                      alt={card.front}
                      className="h-32 w-32 object-contain rounded-lg mb-4"
                    />
                  )}
                  <p className="text-4xl font-bold text-gray-900 mb-3 break-words">
                    {card.front}
                  </p>
                  {card.pronunciation && (
                    <p className="text-base text-blue-600 italic mb-3">
                      {card.pronunciation}
                    </p>
                  )}
                  {card.audioUrl && (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handlePlayAudio}
                      >
                        <Volume2 className="mr-2 h-4 w-4" />
                        Nghe phát âm
                      </Button>
                      <audio
                        ref={audioRef}
                        src={card.audioUrl}
                        preload="none"
                      />
                    </>
                  )}
                  <p className="text-xs text-gray-400 mt-6">
                    Click hoặc bấm Space để lật
                  </p>
                </CardContent>
              </Card>

              {/* Back */}
              <Card
                className="absolute inset-0 bg-blue-50"
                style={{
                  backfaceVisibility: "hidden",
                  WebkitBackfaceVisibility: "hidden",
                  transform: "rotateY(180deg)",
                }}
              >
                <CardContent className="flex flex-col items-center justify-center text-center p-8 min-h-[320px]">
                  <p className="text-3xl font-bold text-gray-900 mb-4 break-words">
                    {card.back}
                  </p>
                  {card.example && (
                    <div className="mt-4 px-6 py-3 bg-white rounded-lg border max-w-md">
                      <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                        Ví dụ
                      </p>
                      <p className="text-sm text-gray-700 italic">
                        "{card.example}"
                      </p>
                    </div>
                  )}
                  <p className="text-xs text-gray-400 mt-6">
                    Click để xem mặt trước
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between gap-3">
            <Button
              variant="outline"
              onClick={goPrev}
              disabled={currentIdx === 0}
              className="flex-1 max-w-[150px]"
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Trước
            </Button>
            <span className="text-xs text-gray-500 hidden md:inline">
              ← Space để lật · → tiếp theo
            </span>
            <Button onClick={goNext} className="flex-1 max-w-[150px]">
              {currentIdx === originalCards.length - 1 ? "Hoàn thành" : "Tiếp"}
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
