import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ChevronLeft,
  Plus,
  MoreVertical,
  Pencil,
  Trash2,
  Loader2,
  Volume2,
  Layers,
} from "lucide-react";
import { useFlashcardSetDetail } from "@/hooks/useFlashcards";
import FlashcardFormDialog from "@/components/flashcard/FlashcardFormDialog";
import DeleteFlashcardDialog from "@/components/flashcard/DeleteFlashcardDialog";

export default function FlashcardSetDetailPage() {
  const { id } = useParams();
  const { data: set, isLoading } = useFlashcardSetDetail(id);

  const [cardFormTarget, setCardFormTarget] = useState(null);
  const [cardFormOpen, setCardFormOpen] = useState(false);
  const [cardDeleteTarget, setCardDeleteTarget] = useState(null);

  const openCreate = () => {
    setCardFormTarget(null);
    setCardFormOpen(true);
  };

  const openEdit = (card) => {
    setCardFormTarget(card);
    setCardFormOpen(true);
  };

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

  const cards = set.flashcards || [];

  return (
    <div className="space-y-6">
      {/* Header + breadcrumb */}
      <div>
        <Link
          to={`/academic/modules/${set.module?.id || set.moduleId}`}
          className="inline-flex items-center text-sm text-gray-600 hover:text-blue-600 mb-2"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          {set.module?.title || "Quay lại module"}
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">{set.title}</h1>
        {set.description && (
          <p className="text-gray-600 mt-1">{set.description}</p>
        )}
      </div>

      {/* Cards section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Layers className="h-5 w-5" />
            Flashcards ({cards.length})
          </CardTitle>
          <Button size="sm" onClick={openCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Thêm flashcard
          </Button>
        </CardHeader>
        <CardContent>
          {cards.length === 0 ? (
            <div className="text-center py-10">
              <Layers className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 mb-4">Chưa có flashcard nào</p>
              <Button onClick={openCreate}>
                <Plus className="mr-2 h-4 w-4" />
                Tạo flashcard đầu tiên
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {cards.map((card) => (
                <div
                  key={card.id}
                  className="border rounded-lg p-4 hover:shadow-sm transition-shadow"
                >
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-base mb-1 break-words">
                        {card.front}
                      </p>
                      {card.pronunciation && (
                        <p className="text-xs text-blue-600 italic">
                          {card.pronunciation}
                        </p>
                      )}
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-7 w-7">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openEdit(card)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Sửa
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600 focus:text-red-600"
                          onClick={() => setCardDeleteTarget(card)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Xóa
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="border-t pt-3 mb-2">
                    <p className="text-sm text-gray-700 break-words">
                      {card.back}
                    </p>
                  </div>

                  {card.example && (
                    <p className="text-xs text-gray-500 italic mt-2 break-words">
                      "{card.example}"
                    </p>
                  )}

                  {(card.imageUrl || card.audioUrl) && (
                    <div className="flex items-center gap-3 mt-3">
                      {card.imageUrl && (
                        <img
                          src={card.imageUrl}
                          alt={card.front}
                          className="h-12 w-12 rounded object-cover border"
                        />
                      )}
                      {card.audioUrl && (
                        <a
                          href={card.audioUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline"
                        >
                          <Volume2 className="h-4 w-4" />
                          Audio
                        </a>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <FlashcardFormDialog
        setId={id}
        card={cardFormTarget}
        open={cardFormOpen}
        onClose={() => setCardFormOpen(false)}
      />

      <DeleteFlashcardDialog
        setId={id}
        card={cardDeleteTarget}
        open={!!cardDeleteTarget}
        onClose={() => setCardDeleteTarget(null)}
      />
    </div>
  );
}
