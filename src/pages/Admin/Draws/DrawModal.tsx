import React, { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { adminService } from "../../../services";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes } from "react-icons/fa";
import Button from "../../../components/common/Button/Button";
import type { Draw, CreateDrawRequest, UpdateDrawRequest } from "../../../types";

interface DrawModalProps {
  isOpen: boolean;
  onClose: () => void;
  draw: Draw | null;
}

interface DrawFormState {
  competitionId: string;
  winnerId: string;
  winnerName: string;
  winnerLocation: string;
  totalTickets: number;
  winningTicketNumber: number;
  drawDate: string;
  imageUrl: string;
}

const defaultFormState = (): DrawFormState => ({
  competitionId: "",
  winnerId: "",
  winnerName: "",
  winnerLocation: "",
  totalTickets: 0,
  winningTicketNumber: 0,
  drawDate: new Date().toISOString().split("T")[0],
  imageUrl: "",
});

const DrawModal: React.FC<DrawModalProps> = ({ isOpen, onClose, draw }) => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<DrawFormState>(defaultFormState());

  useEffect(() => {
    if (!isOpen) {
      setFormData(defaultFormState());
      return;
    }

    if (draw) {
      setFormData({
        competitionId: draw.competitionId ?? "",
        winnerId: draw.winnerId ?? "",
        winnerName: draw.winnerName ?? "",
        winnerLocation: draw.winnerLocation ?? "",
        totalTickets: draw.totalTickets ?? 0,
        winningTicketNumber: draw.winningTicketNumber ?? 0,
        drawDate: draw.drawDate
          ? draw.drawDate.toString().substring(0, 10)
          : new Date().toISOString().split("T")[0],
        imageUrl: draw.imageUrl ?? "",
      });
    } else {
      setFormData(defaultFormState());
    }
  }, [draw, isOpen]);

  const resetAndClose = () => {
    setFormData(defaultFormState());
    onClose();
  };

  const createMutation = useMutation({
    mutationFn: (payload: CreateDrawRequest) => adminService.createDraw(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-draws"] });
      toast.success("Draw created successfully");
      resetAndClose();
    },
    onError: (error: unknown) => {
      const message =
        error instanceof Error ? error.message : "Failed to create draw";
      toast.error(message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateDrawRequest;
    }) => adminService.updateDraw(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-draws"] });
      toast.success("Draw updated successfully");
      resetAndClose();
    },
    onError: (error: unknown) => {
      const message =
        error instanceof Error ? error.message : "Failed to update draw";
      toast.error(message);
    },
  });

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (draw) {
      await updateMutation.mutateAsync({
        id: draw.id,
        payload: {
          winnerName: formData.winnerName,
          winnerLocation: formData.winnerLocation,
          drawDate: formData.drawDate,
          totalTickets: formData.totalTickets,
          winningTicketNumber: formData.winningTicketNumber,
          imageUrl: formData.imageUrl || undefined,
        },
      });
      return;
    }

    if (!formData.competitionId || !formData.winnerId) {
      toast.error("Competition ID and Winner ID are required");
      return;
    }

    const payload: CreateDrawRequest = {
      competitionId: formData.competitionId,
      winnerId: formData.winnerId,
      winnerName: formData.winnerName,
      winnerLocation: formData.winnerLocation,
      totalTickets: formData.totalTickets,
      winningTicketNumber: formData.winningTicketNumber,
      drawDate: formData.drawDate,
      imageUrl: formData.imageUrl || undefined,
    };

    await createMutation.mutateAsync(payload);
  };

  const handleNumberChange = (
    key: keyof Pick<DrawFormState, "totalTickets" | "winningTicketNumber">,
    value: string,
  ) => {
    const parsed = Number(value);
    setFormData((prev) => ({
      ...prev,
      [key]: Number.isNaN(parsed) ? 0 : parsed,
    }));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center"
          >
            <div
              className="fixed inset-0 bg-black/80 backdrop-blur-sm"
              onClick={resetAndClose}
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="relative bg-black border border-gold-primary/30 rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4"
            >
              {/* Header */}
              <div className="sticky top-0 bg-black border-b border-gold-primary/20 px-6 py-4 rounded-t-lg z-10 backdrop-blur-md">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-light text-white  gold-text-glow">
                    {draw ? 'Edit Draw' : 'Create New Draw'}
                  </h2>
                  <button
                    onClick={onClose}
                    className="text-white/70 hover:text-gold-primary transition-colors p-2 hover:bg-gold-primary/10 rounded-full"
                  >
                    <FaTimes className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {!draw && (
                  <>
                    <div>
                      <label className="block text-sm font-light text-white/90 mb-2 ">
                        Competition ID <span className="text-gold-primary">*</span>
                      </label>
                      <input
                    type="text"
                    value={formData.competitionId}
                    onChange={(e) =>
                      setFormData({ ...formData, competitionId: e.target.value })
                    }
                        className="w-full px-4 py-3 bg-black border border-gold-primary/20 rounded-lg text-white placeholder-white/40 focus:ring-2 focus:ring-gold-primary focus:border-gold-primary transition-all outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-light text-white/90 mb-2 ">
                        Winner ID <span className="text-gold-primary">*</span>
                      </label>
                      <input
                    type="text"
                    value={formData.winnerId}
                    onChange={(e) =>
                      setFormData({ ...formData, winnerId: e.target.value })
                    }
                        className="w-full px-4 py-3 bg-black border border-gold-primary/20 rounded-lg text-white placeholder-white/40 focus:ring-2 focus:ring-gold-primary focus:border-gold-primary transition-all outline-none"
                        required
                      />
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-sm font-light text-white/90 mb-2 ">
                    Winner Name <span className="text-gold-primary">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.winnerName}
                    onChange={(e) =>
                      setFormData({ ...formData, winnerName: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-black border border-gold-primary/20 rounded-lg text-white placeholder-white/40 focus:ring-2 focus:ring-gold-primary focus:border-gold-primary transition-all outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-light text-white/90 mb-2 ">
                    Winner Location <span className="text-gold-primary">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.winnerLocation}
                    onChange={(e) =>
                      setFormData({ ...formData, winnerLocation: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-black border border-gold-primary/20 rounded-lg text-white placeholder-white/40 focus:ring-2 focus:ring-gold-primary focus:border-gold-primary transition-all outline-none"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-light text-white/90 mb-2 ">
                      Total Tickets <span className="text-gold-primary">*</span>
                    </label>
                    <input
                    type="number"
                    value={formData.totalTickets}
                    onChange={(e) => handleNumberChange("totalTickets", e.target.value)}
                      className="w-full px-4 py-3 bg-black border border-gold-primary/20 rounded-lg text-white placeholder-white/40 focus:ring-2 focus:ring-gold-primary focus:border-gold-primary transition-all outline-none"
                      required
                      min="1"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-light text-white/90 mb-2 ">
                      Winning Ticket <span className="text-gold-primary">*</span>
                    </label>
                    <input
                    type="number"
                    value={formData.winningTicketNumber}
                    onChange={(e) =>
                      handleNumberChange("winningTicketNumber", e.target.value)
                    }
                      className="w-full px-4 py-3 bg-black border border-gold-primary/20 rounded-lg text-white placeholder-white/40 focus:ring-2 focus:ring-gold-primary focus:border-gold-primary transition-all outline-none"
                      required
                      min="1"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-light text-white/90 mb-2 ">
                    Draw Date <span className="text-gold-primary">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.drawDate}
                    onChange={(e) =>
                      setFormData({ ...formData, drawDate: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-black border border-gold-primary/20 rounded-lg text-white placeholder-white/40 focus:ring-2 focus:ring-gold-primary focus:border-gold-primary transition-all outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-light text-white/90 mb-2 ">
                    Image URL (Optional)
                  </label>
                  <input
                    type="url"
                    value={formData.imageUrl}
                    onChange={(e) =>
                      setFormData({ ...formData, imageUrl: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-black border border-gold-primary/20 rounded-lg text-white placeholder-white/40 focus:ring-2 focus:ring-gold-primary focus:border-gold-primary transition-all outline-none"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3 pt-4 border-t border-gold-primary/10">
                  <Button
                    type="button"
                    onClick={resetAndClose}
                    variant="outline"
                    size="md"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    withBrackets
                    disabled={createMutation.isPending || updateMutation.isPending}
                    loading={createMutation.isPending || updateMutation.isPending}
                  >
                    {draw ? "Update Draw" : "Create Draw"}
                  </Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default DrawModal;

