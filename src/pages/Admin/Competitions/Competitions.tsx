import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { FaPlus, FaEdit, FaTrash, FaSearch, FaFilter } from "react-icons/fa";
import { motion } from "framer-motion";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import Button from "../../../components/common/Button/Button";
import ConfirmationModal from "../../../components/common/ConfirmationModal/ConfirmationModal";
import { competitionService } from "../../../services";
import type {
  Competition,
  CompetitionCategory,
  CompetitionStatus,
} from "../../../types";

const PAGE_SIZE = 9;

const statusOptions: Array<{ label: string; value: CompetitionStatus | "all" }> = [
  { label: "All Status", value: "all" },
  { label: "Draft", value: "draft" },
  { label: "Upcoming", value: "upcoming" },
  { label: "Active", value: "active" },
  { label: "Drawing", value: "drawing" },
  { label: "Completed", value: "completed" },
  { label: "Ended", value: "ended" },
  { label: "Drawn", value: "drawn" },
  { label: "Cancelled", value: "cancelled" },
];

const categoryOptions: Array<{ label: string; value: CompetitionCategory | "all" }> = [
  { label: "All Categories", value: "all" },
  { label: "Luxury Cars", value: "Luxury Cars" },
  { label: "Tech & Gadgets", value: "Tech & Gadgets" },
  { label: "Holidays", value: "Holidays" },
  { label: "Cash Prizes", value: "Cash Prizes" },
  { label: "Home & Garden", value: "Home & Garden" },
  { label: "Fashion & Watches", value: "Fashion & Watches" },
  { label: "Experiences", value: "Experiences" },
  { label: "Other", value: "Other" },
];

const AdminCompetitions: React.FC = () => {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<CompetitionStatus | "all">("all");
  const [categoryFilter, setCategoryFilter] = useState<CompetitionCategory | "all">("all");
  const [page, setPage] = useState(1);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [competitionToDelete, setCompetitionToDelete] = useState<Competition | null>(null);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: [
      "admin",
      "competitions",
      {
        page,
        searchQuery,
        statusFilter,
        categoryFilter,
      },
    ],
    queryFn: () =>
      competitionService.getAdminCompetitions({
        page,
        limit: PAGE_SIZE,
        search: searchQuery.trim() || undefined,
        status: statusFilter === "all" ? undefined : statusFilter,
        category: categoryFilter === "all" ? undefined : categoryFilter,
        sort: "createdAt:desc",
      }),
    placeholderData: (previous) => previous,
    staleTime: 60_000,
  });

  if (isError) {
    const message =
      error instanceof Error ? error.message : "Failed to load competitions";
    toast.error(message);
  }

  const competitions = data?.competitions ?? [];
  const meta = data?.meta as
    | {
      pagination?: { page: number; totalPages: number };
      page?: number;
      pages?: number;
    }
    | undefined;
  const totalPages = meta?.pagination?.totalPages ?? meta?.pages ?? 1;

  const deleteMutation = useMutation({
    mutationFn: (id: string) => competitionService.deleteCompetition(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "competitions"] });
      toast.success("Competition deleted successfully");
      setCompetitionToDelete(null);
      setIsDeleteModalOpen(false);
    },
    onError: (deleteError: unknown) => {
      const message =
        deleteError instanceof Error
          ? deleteError.message
          : "Failed to delete competition";
      toast.error(message);
    },
  });

  const handleDeleteRequest = (competition: Competition) => {
    setCompetitionToDelete(competition);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!competitionToDelete) {
      return;
    }
    await deleteMutation.mutateAsync(competitionToDelete.id);
  };

  const resetToFirstPage = () => {
    setPage(1);
  };

  const paginatedCompetitions = useMemo(() => {
    return competitions;
  }, [competitions]);

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
        <div>
          <h1 className="text-4xl font-light text-white gold-text-glow mb-2">
            Competitions
          </h1>
          <p className="text-white/60 text-sm uppercase tracking-wide font-light">
            Manage all competitions in the platform
          </p>
        </div>
        <Link to="/admin/competitions/add">
          <Button leftIcon={<FaPlus className="mr-2 h-4 w-4" />} variant="primary" size="md" withBrackets className="flex items-center justify-center gap-2">
            Create Competition
          </Button>
        </Link>
      </div>

      <div className="bg-black border border-gold-primary/20 rounded-lg p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 h-5 w-5" />
            <input
              type="text"
              placeholder="Search competitions..."
              value={searchQuery}
              onChange={(event) => {
                setSearchQuery(event.target.value);
                resetToFirstPage();
              }}
              className="w-full pl-10 pr-4 py-2.5 bg-black border border-gold-primary/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-gold-primary/50 transition-colors"
            />
          </div>

          <div className="relative">
            <FaFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 h-5 w-5" />
            <select
              value={statusFilter}
              onChange={(event) => {
                setStatusFilter(event.target.value as CompetitionStatus | "all");
                resetToFirstPage();
              }}
              className="w-full pl-10 pr-4 py-2.5 bg-black border border-gold-primary/20 rounded-lg text-white focus:outline-none focus:border-gold-primary/50 transition-colors appearance-none"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="relative">
            <FaFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 h-5 w-5" />
            <select
              value={categoryFilter}
              onChange={(event) => {
                setCategoryFilter(
                  event.target.value as CompetitionCategory | "all",
                );
                resetToFirstPage();
              }}
              className="w-full pl-10 pr-4 py-2.5 bg-black border border-gold-primary/20 rounded-lg text-white focus:outline-none focus:border-gold-primary/50 transition-colors appearance-none"
            >
              {categoryOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: PAGE_SIZE }).map((_, index) => (
            <div
              key={index}
              className="h-[360px] rounded-lg border border-gold-primary/10 bg-black-soft animate-pulse"
            />
          ))}
        </div>
      ) : paginatedCompetitions.length === 0 ? (
        <div className="bg-black border border-gold-primary/20 rounded-lg p-12 text-center">
          <p className="text-white/60 text-sm font-light">
            No competitions found{searchQuery ? " matching your filters." : "."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedCompetitions.map((competition, index) => (
            <motion.div
              key={competition.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.05 }}
              className="bg-black border border-gold-primary/20 rounded-lg overflow-hidden hover:border-gold-primary/40 transition-all duration-300"
            >
              <div className="relative h-48 bg-black/50 overflow-hidden">
                {competition.images?.[0]?.url ? (
                  <img
                    src={competition.images[0].url}
                    alt={competition.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gold-primary/10 text-white/40 text-sm">
                    No image
                  </div>
                )}
                <div className="absolute top-3 right-3">
                  <span className="px-3 py-1 rounded-full text-xs font-light border border-gold-primary/40 bg-black/70 text-white/80">
                    {competition.status.toUpperCase()}
                  </span>
                </div>
                {competition.featured && (
                  <div className="absolute top-3 left-3">
                    <span className="px-3 py-1 rounded-full text-xs font-light bg-gold-primary/20 text-gold-primary border border-gold-primary/40">
                      FEATURED
                    </span>
                  </div>
                )}
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <h3 className="text-xl font-light text-white mb-1 line-clamp-1">
                    {competition.title}
                  </h3>
                  <p className="text-white/60 text-sm line-clamp-2 font-light">
                    {competition.shortDescription || competition.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm text-white/70">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-white/40 mb-1">
                      Ticket Price
                    </p>
                    <p className="text-gold-primary font-semibold">
                      £{competition.ticketPrice.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-white/40 mb-1">
                      Tickets Sold
                    </p>
                    <p className="text-gold-primary font-semibold">
                      {competition.soldTickets.toLocaleString()} / {" "}
                      {competition.maxTickets.toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-4 border-t border-gold-primary/10">
                  <Link
                    to={`/competitions/${competition.id}`}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-gold-primary/30 rounded-lg text-gold-primary hover:bg-gold-primary/10 transition-colors text-sm font-light"
                  >
                    View
                  </Link>
                  <Link
                    to={`/admin/competitions/edit/${competition.id}`}
                    className="flex items-center justify-center gap-2 px-4 py-2 border border-gold-primary/30 rounded-lg text-gold-primary hover:bg-gold-primary/10 transition-colors text-sm font-light"
                    title="Edit"
                  >
                    <FaEdit className="h-3.5 w-3.5" />
                  </Link>
                  <button
                    onClick={() => handleDeleteRequest(competition)}
                    className="flex items-center justify-center gap-2 px-4 py-2 border border-red-500/30 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors text-sm font-light"
                    title="Delete"
                  >
                    <FaTrash className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-12">
          <Button
            onClick={() => setPage((current) => Math.max(1, current - 1))}
            disabled={page === 1 || isLoading}
            variant="outline"
            size="md"
          >
            Previous
          </Button>
          <p className="text-white/60 font-light">
            Page <span className="text-gold-primary">{page}</span> of{" "}
            <span className="text-gold-primary">{totalPages}</span>
          </p>
          <Button
            onClick={() =>
              setPage((current) =>
                current >= totalPages ? current : current + 1,
              )
            }
            disabled={page >= totalPages || isLoading}
            variant="outline"
            size="md"
          >
            Next
          </Button>
        </div>
      )}

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setCompetitionToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Delete Competition"
        message={
          competitionToDelete
            ? `Are you sure you want to delete "${competitionToDelete.title}"? This action cannot be undone.`
            : "Are you sure you want to delete this competition?"
        }
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
};

export default AdminCompetitions;
