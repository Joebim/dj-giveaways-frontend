import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FaTimes, FaTrash, FaUpload } from "react-icons/fa";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Button from "../../../components/common/Button/Button";
import { adminService } from "../../../services";
import type {
  Champion,
  CreateChampionRequest,
  UpdateChampionRequest,
} from "../../../types";

interface ChampionModalProps {
  isOpen: boolean;
  onClose: () => void;
  champion: Champion | null;
}

interface ChampionFormState {
  drawId: string;
  testimonial: string;
  prizeValue: string;
  featured: boolean;
}

const defaultFormState: ChampionFormState = {
  drawId: "",
  testimonial: "",
  prizeValue: "",
  featured: false,
};

const ChampionModal: React.FC<ChampionModalProps> = ({
  isOpen,
  onClose,
  champion,
}) => {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formState, setFormState] = useState<ChampionFormState>(defaultFormState);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  useEffect(() => {
    if (!champion) {
      setFormState(defaultFormState);
      setSelectedImage(null);
      setImagePreview("");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }

    setFormState({
      drawId: champion.drawId ?? "",
      testimonial: champion.testimonial ?? "",
      prizeValue: champion.prizeValue ?? "",
      featured: Boolean(champion.featured),
    });
    setImagePreview(champion.image?.url ?? "");
    setSelectedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [champion]);

  const resetState = () => {
    setFormState(defaultFormState);
    setSelectedImage(null);
    setImagePreview("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const createChampionMutation = useMutation({
    mutationFn: (payload: CreateChampionRequest) =>
      adminService.createChampion(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-champions"] });
      toast.success("Champion created successfully");
      resetState();
      onClose();
    },
    onError: (error: unknown) => {
      const message =
        error instanceof Error ? error.message : "Failed to create champion";
      toast.error(message);
    },
  });

  const updateChampionMutation = useMutation({
    mutationFn: (params: { id: string; payload: UpdateChampionRequest }) =>
      adminService.updateChampion(params.id, params.payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-champions"] });
      toast.success("Champion updated successfully");
      resetState();
      onClose();
    },
    onError: (error: unknown) => {
      const message =
        error instanceof Error ? error.message : "Failed to update champion";
      toast.error(message);
    },
  });

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setSelectedImage(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const closeModal = () => {
    resetState();
    onClose();
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!champion && !formState.drawId.trim()) {
      toast.error("Draw ID is required");
      return;
    }

    if (!formState.testimonial.trim()) {
      toast.error("Testimonial is required");
      return;
    }

    if (!champion && !selectedImage) {
      toast.error("Winner image is required");
      return;
    }

    if (champion) {
      const payload: UpdateChampionRequest = {
        testimonial: formState.testimonial,
        prizeValue: formState.prizeValue || undefined,
        featured: formState.featured,
        image: selectedImage ?? undefined,
      };

      await updateChampionMutation.mutateAsync({
        id: champion.id,
        payload,
      });
      return;
    }

    const payload: CreateChampionRequest = {
      drawId: formState.drawId,
      testimonial: formState.testimonial,
      prizeValue: formState.prizeValue || undefined,
      featured: formState.featured,
      image: selectedImage ?? undefined,
    };

    await createChampionMutation.mutateAsync(payload);
  };

  const isSubmitting =
    createChampionMutation.isPending || updateChampionMutation.isPending;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center"
        >
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={closeModal}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="relative bg-black border border-gold-primary/30 rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4"
          >
            <div className="sticky top-0 bg-black border-b border-gold-primary/20 px-6 py-4 rounded-t-lg z-10 backdrop-blur-md">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-light text-white gold-text-glow">
                  {champion ? "Edit Champion" : "Create New Champion"}
                </h2>
                <button
                  onClick={closeModal}
                  className="text-white/70 hover:text-gold-primary transition-colors p-2 hover:bg-gold-primary/10 rounded-full"
                >
                  <FaTimes className="w-5 h-5" />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {!champion && (
                <div>
                  <label className="block text-sm font-light text-white/90 mb-2">
                    Draw ID <span className="text-gold-primary">*</span>
                  </label>
                  <input
                    type="text"
                    value={formState.drawId}
                    onChange={(event) =>
                      setFormState((prev) => ({
                        ...prev,
                        drawId: event.target.value,
                      }))
                    }
                    className="w-full px-4 py-3 bg-black border border-gold-primary/20 rounded-lg text-white placeholder-white/40 focus:ring-2 focus:ring-gold-primary focus:border-gold-primary transition-all outline-none"
                    placeholder="Enter the draw ID"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-light text-white/90 mb-2">
                  Testimonial <span className="text-gold-primary">*</span>
                </label>
                <textarea
                  value={formState.testimonial}
                  onChange={(event) =>
                    setFormState((prev) => ({
                      ...prev,
                      testimonial: event.target.value,
                    }))
                  }
                  rows={4}
                  className="w-full px-4 py-3 bg-black border border-gold-primary/20 rounded-lg text-white placeholder-white/40 focus:ring-2 focus:ring-gold-primary focus:border-gold-primary transition-all outline-none resize-none"
                  placeholder="Enter the winner's testimonial..."
                  required
                  maxLength={1000}
                />
                <p className="text-xs text-white/50 mt-1">
                  {formState.testimonial.length}/1000 characters
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-light text-white/90 mb-2">
                    Prize Value
                  </label>
                  <input
                    type="text"
                    value={formState.prizeValue}
                    onChange={(event) =>
                      setFormState((prev) => ({
                        ...prev,
                        prizeValue: event.target.value,
                      }))
                    }
                    className="w-full px-4 py-3 bg-black border border-gold-primary/20 rounded-lg text-white placeholder-white/40 focus:ring-2 focus:ring-gold-primary focus:border-gold-primary transition-all outline-none"
                    placeholder="e.g. £10,000"
                  />
                </div>

                <label className="flex items-center space-x-3 text-sm font-light text-white/90 mt-6 md:mt-0">
                  <input
                    type="checkbox"
                    checked={formState.featured}
                    onChange={(event) =>
                      setFormState((prev) => ({
                        ...prev,
                        featured: event.target.checked,
                      }))
                    }
                    className="w-5 h-5 text-gold-primary bg-black border-gold-primary/30 rounded focus:ring-gold-primary"
                  />
                  <span>Feature on home page</span>
                </label>
              </div>

              <div>
                <label className="block text-sm font-light text-white/90 mb-2">
                  Winner Image {champion ? "" : <span className="text-gold-primary">*</span>}
                </label>
                <div className="border border-dashed border-gold-primary/40 rounded-lg p-6 bg-black/40">
                  <div className="flex flex-col md:flex-row items-center gap-4">
                    {imagePreview ? (
                      <div className="relative w-32 h-32 rounded-lg overflow-hidden border border-gold-primary/30">
                        <img
                          src={imagePreview}
                          alt="Winner"
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedImage(null);
                            setImagePreview("");
                            if (fileInputRef.current) {
                              fileInputRef.current.value = "";
                            }
                          }}
                          className="absolute top-2 right-2 bg-black/70 text-white/80 p-1 rounded-full hover:bg-black/90 transition-colors"
                          aria-label="Remove image"
                        >
                          <FaTrash className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <div className="w-32 h-32 rounded-lg border border-gold-primary/20 border-dashed flex items-center justify-center text-white/40 text-sm">
                        No image selected
                      </div>
                    )}

                    <div className="flex-1 text-center md:text-left">
                      <p className="text-sm text-white/70 mb-3">
                        Upload a square winner photo (JPG or PNG, max 2MB).
                        Featured champions need high quality images.
                      </p>
                      <div className="flex flex-wrap items-center gap-3">
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleImageChange}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <FaUpload className="w-4 h-4 mr-2" />
                          Upload Image
                        </Button>
                        {selectedImage && (
                          <span className="text-xs text-white/50">
                            {selectedImage.name}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gold-primary/10">
                <Button type="button" variant="ghost" onClick={closeModal}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  withBrackets
                  loading={isSubmitting}
                  disabled={isSubmitting}
                >
                  {champion ? "Update Champion" : "Create Champion"}
                </Button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ChampionModal;

