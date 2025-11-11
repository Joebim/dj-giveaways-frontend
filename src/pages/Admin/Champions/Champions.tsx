import React, { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FaEdit, FaPlus, FaSearch, FaTrash } from "react-icons/fa";
import toast from "react-hot-toast";
import Button from "../../../components/common/Button/Button";
import ChampionModal from "./ChampionModal";
import { adminService } from "../../../services";
import type { Champion } from "../../../types";

const Champions: React.FC = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedChampion, setSelectedChampion] = useState<Champion | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["admin-champions", searchQuery],
    queryFn: () =>
      adminService.getChampions({
        search: searchQuery.trim() || undefined,
        limit: 50,
      }),
    staleTime: 60_000,
    placeholderData: (previousData) => previousData,
  });

  if (isError) {
    const message = error instanceof Error ? error.message : "Failed to load champions";
    toast.error(message);
  }

  const champions = data?.champions ?? [];

  const deleteChampionMutation = useMutation({
    mutationFn: (id: string) => adminService.deleteChampion(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-champions"] });
      toast.success("Champion deleted successfully");
    },
    onError: (mutationError: unknown) => {
      const message =
        mutationError instanceof Error
          ? mutationError.message
          : "Failed to delete champion";
      toast.error(message);
    },
  });

  const filteredChampions = useMemo(() => {
    if (!searchQuery.trim()) {
      return champions;
    }

    const lowerSearch = searchQuery.toLowerCase();
    return champions.filter((champion) => {
      return (
        champion.winnerName?.toLowerCase().includes(lowerSearch) ||
        champion.testimonial?.toLowerCase().includes(lowerSearch) ||
        champion.prizeName?.toLowerCase().includes(lowerSearch)
      );
    });
  }, [champions, searchQuery]);

  const openCreateModal = () => {
    setSelectedChampion(null);
    setIsModalOpen(true);
  };

  const openEditModal = (champion: Champion) => {
    setSelectedChampion(champion);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedChampion(null);
    setIsModalOpen(false);
  };

  const handleDelete = async (champion: Champion) => {
    const confirmed = window.confirm(
      `Are you sure you want to remove ${champion.winnerName} from champions?`
    );

    if (!confirmed) {
      return;
    }

    await deleteChampionMutation.mutateAsync(champion.id);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-light text-white gold-text-glow">Champions</h1>
          <p className="text-white/60 text-sm uppercase tracking-wide font-light">
            Manage recent winners showcased on the site
          </p>
        </div>
        <Button
          variant="primary"
          size="md"
          withBrackets
          onClick={openCreateModal}
          leftIcon={<FaPlus className="h-4 w-4" />}
        >
          Add Champion
        </Button>
      </div>

      <div className="bg-black border border-gold-primary/20 rounded-lg p-6">
        <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 h-5 w-5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search champions by name, testimonial, or prize"
            className="w-full pl-10 pr-4 py-2.5 bg-black border border-gold-primary/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-gold-primary/50 transition-colors"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="h-[360px] rounded-lg border border-gold-primary/10 bg-black-soft animate-pulse"
            />
          ))}
        </div>
      ) : filteredChampions.length === 0 ? (
        <div className="bg-black border border-gold-primary/20 rounded-lg p-12 text-center">
          <p className="text-white/60 text-sm font-light">
            {searchQuery
              ? "No champions match your search."
              : "No champions found. Add a new winner to get started."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredChampions.map((champion) => (
            <div
              key={champion.id}
              className="bg-black border border-gold-primary/20 rounded-lg overflow-hidden hover:border-gold-primary/40 transition-colors"
            >
              <div className="relative h-52 bg-black/40">
                {champion.image?.url ? (
                  <img
                    src={champion.image.url}
                    alt={champion.winnerName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white/40 text-sm">
                    No image
                  </div>
                )}
                {champion.featured && (
                  <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-gold-primary/90 text-black text-xs font-semibold">
                    FEATURED
                  </span>
                )}
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <h3 className="text-xl font-light text-white mb-1">
                    {champion.winnerName}
                  </h3>
                  <p className="text-sm text-white/60">{champion.winnerLocation}</p>
                </div>

                <div className="bg-black-soft border border-gold-primary/10 rounded-lg p-4 text-sm text-white/70">
                  <p className="font-semibold text-gold-primary tracking-wide uppercase text-xs mb-2">
                    Testimonial
                  </p>
                  <p className="line-clamp-4 font-light">{champion.testimonial}</p>
                </div>

                <div className="flex items-center justify-between text-sm text-white/70">
                  <span>Prize:</span>
                  <span className="text-gold-primary font-semibold">
                    {champion.prizeValue || "—"}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-3 pt-4 border-t border-gold-primary/10">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEditModal(champion)}
                    leftIcon={<FaEdit className="h-3.5 w-3.5" />}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(champion)}
                    disabled={deleteChampionMutation.isPending}
                    leftIcon={<FaTrash className="h-3.5 w-3.5" />}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <ChampionModal
        isOpen={isModalOpen}
        onClose={closeModal}
        champion={selectedChampion}
      />
    </div>
  );
};

export default Champions;

