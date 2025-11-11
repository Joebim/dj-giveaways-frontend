import React, { useMemo, useState } from "react";
import { FaPlus, FaEdit, FaTrash, FaSearch } from "react-icons/fa";
import { motion } from "framer-motion";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import DrawModal from "./DrawModal";
import ConfirmationModal from "../../../components/common/ConfirmationModal/ConfirmationModal";
import Button from "../../../components/common/Button/Button";
import { adminService } from "../../../services";
import type { Draw } from "../../../types";

const PAGE_SIZE = 10;

const AdminDraws: React.FC = () => {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDraw, setSelectedDraw] = useState<Draw | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [drawToDelete, setDrawToDelete] = useState<Draw | null>(null);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["admin", "draws", { page }],
    queryFn: () =>
      adminService.getDraws({
        page,
        limit: PAGE_SIZE,
      }),
    placeholderData: (previous) => previous,
    staleTime: 60_000,
  });

  if (isError) {
    const message =
      error instanceof Error ? error.message : "Failed to load draws";
    toast.error(message);
  }

  const draws = data?.draws ?? [];
  const meta = data?.meta as
    | {
        pagination?: { page: number; totalPages: number };
        page?: number;
        pages?: number;
      }
    | undefined;
  const totalPages = meta?.pagination?.totalPages ?? meta?.pages ?? 1;

  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminService.deleteDraw(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "draws"] });
      toast.success("Draw deleted successfully");
      setDrawToDelete(null);
      setIsDeleteModalOpen(false);
    },
    onError: (deleteError: unknown) => {
      const message =
        deleteError instanceof Error
          ? deleteError.message
          : "Failed to delete draw";
      toast.error(message);
    },
  });

  const filteredDraws = useMemo(() => {
    if (!searchQuery.trim()) {
      return draws;
    }
    const query = searchQuery.trim().toLowerCase();
    return draws.filter((draw) => {
      return (
        draw.winnerName?.toLowerCase().includes(query) ||
        draw.prizeName?.toLowerCase().includes(query) ||
        draw.winnerLocation?.toLowerCase().includes(query)
      );
    });
  }, [draws, searchQuery]);

  const openCreateModal = () => {
    setSelectedDraw(null);
    setIsModalOpen(true);
  };

  const openEditModal = (draw: Draw) => {
    setSelectedDraw(draw);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedDraw(null);
    setIsModalOpen(false);
  };

  const requestDelete = (draw: Draw) => {
    setDrawToDelete(draw);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!drawToDelete) {
      return;
    }
    await deleteMutation.mutateAsync(drawToDelete.id);
  };

  const resetToFirstPage = () => setPage(1);

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
        <div>
          <h1 className="text-4xl font-light text-white gold-text-glow mb-2">
            Draws Management
          </h1>
          <p className="text-white/60 text-sm uppercase tracking-wide font-light">
            Manage completed competition draws
          </p>
        </div>
        <Button
          variant="primary"
          size="md"
          withBrackets
          onClick={openCreateModal}
          leftIcon={<FaPlus className="h-4 w-4" />}
        >
          Create Draw
        </Button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 h-5 w-5" />
          <input
            type="text"
            placeholder="Search draws by winner, prize, or location"
            value={searchQuery}
            onChange={(event) => {
              setSearchQuery(event.target.value);
              resetToFirstPage();
            }}
            className="w-full pl-10 pr-4 py-2.5 bg-black border border-gold-primary/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-gold-primary/50 transition-colors"
          />
        </div>
      </div>

      {/* Draws Table */}
      <div className="bg-black border border-gold-primary/20 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-black border-b border-gold-primary/10">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-light uppercase tracking-wider text-white/70">
                  Competition
                </th>
                <th className="px-6 py-4 text-left text-xs font-light uppercase tracking-wider text-white/70">
                  Winner
                </th>
                <th className="px-6 py-4 text-left text-xs font-light uppercase tracking-wider text-white/70">
                  Location
                </th>
                <th className="px-6 py-4 text-left text-xs font-light uppercase tracking-wider text-white/70">
                  Draw Date
                </th>
                <th className="px-6 py-4 text-left text-xs font-light uppercase tracking-wider text-white/70">
                  Tickets
                </th>
                <th className="px-6 py-4 text-left text-xs font-light uppercase tracking-wider text-white/70">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-light uppercase tracking-wider text-white/70">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gold-primary/10">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8">
                    <div className="h-12 w-full animate-pulse rounded bg-gold-primary/10" />
                  </td>
                </tr>
              ) : filteredDraws.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-white/60 text-sm font-light">
                    No draws found
                  </td>
                </tr>
              ) : (
                filteredDraws.map((draw, index) => (
                  <motion.tr
                    key={draw.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="hover:bg-gold-primary/5 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-light text-white">
                        {draw.prizeName || draw.competitionTitle || "Competition"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-light text-white">{draw.winnerName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-white/60 text-sm">
                      {draw.winnerLocation}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-white/60 text-sm">
                      {draw.drawDate ? new Date(draw.drawDate).toLocaleDateString() : "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-white/60 text-sm">
                      #{draw.winningTicketNumber} / {draw.totalTickets.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-light border ${draw.isActive
                          ? "bg-green-500/20 text-green-400 border-green-500/30"
                          : "bg-red-500/20 text-red-400 border-red-500/30"}`}
                      >
                        {draw.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEditModal(draw)}
                          className="text-gold-primary hover:text-gold-light transition-colors p-1.5"
                          title="Edit"
                        >
                          <FaEdit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => requestDelete(draw)}
                          className="text-red-400 hover:text-red-300 transition-colors p-1.5"
                          title="Delete"
                        >
                          <FaTrash className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

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
              setPage((current) => (current >= totalPages ? current : current + 1))
            }
            disabled={page >= totalPages || isLoading}
            variant="outline"
            size="md"
          >
            Next
          </Button>
        </div>
      )}

      {isModalOpen && (
        <DrawModal isOpen={isModalOpen} onClose={closeModal} draw={selectedDraw} />
      )}

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDrawToDelete(null);
        }}
        onConfirm={confirmDelete}
        title="Delete Draw"
        message={
          drawToDelete
            ? `Are you sure you want to delete the draw for "${drawToDelete.prizeName ?? drawToDelete.competitionTitle}"?`
            : "Are you sure you want to delete this draw?"
        }
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
};

export default AdminDraws;

