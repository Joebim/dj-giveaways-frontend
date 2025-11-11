import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft, FaPlus, FaTrash } from "react-icons/fa";
import toast from "react-hot-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Button from "../../../components/common/Button/Button";
import { competitionService } from "../../../services";
import type {
  CompetitionCategory,
  CompetitionSpec,
  CompetitionStatus,
} from "../../../types";

type FormState = {
  title: string;
  description: string;
  shortDescription: string;
  prize: string;
  prizeValue: string;
  cashAlternative: string;
  originalPrice: string;
  cashAlternativeDetails: string;
  ticketPrice: string;
  maxTickets: string;
  soldTickets: string;
  drawDate: string;
  endDate: string;
  startDate: string;
  status: CompetitionStatus;
  category: CompetitionCategory;
  featured: boolean;
  isGuaranteedDraw: boolean;
  isActive: boolean;
  question: string;
  correctAnswer: string;
  answerOptions: string[];
  questionExplanation: string;
  tags: string[];
  features: string[];
  included: string[];
  specifications: CompetitionSpec[];
  termsAndConditions: string;
};

const defaultFormState: FormState = {
  title: "",
  description: "",
  shortDescription: "",
  prize: "",
  prizeValue: "",
  cashAlternative: "",
  originalPrice: "",
  cashAlternativeDetails: "",
  ticketPrice: "",
  maxTickets: "",
  soldTickets: "",
  drawDate: "",
  endDate: "",
  startDate: "",
  status: "draft" as CompetitionStatus,
  category: "Other" as CompetitionCategory,
  featured: false,
  isGuaranteedDraw: false,
  isActive: false,
  question: "",
  correctAnswer: "",
  answerOptions: [],
  questionExplanation: "",
  tags: [],
  features: [],
  included: [],
  specifications: [],
  termsAndConditions: "",
};

const statusOptions: CompetitionStatus[] = [
  "upcoming",
  "active",
  "ended",
  "drawn",
  "cancelled",
];

const categoryOptions: CompetitionCategory[] = [
  "Luxury Cars",
  "Tech & Gadgets",
  "Holidays",
  "Cash Prizes",
  "Home & Garden",
  "Fashion & Watches",
  "Experiences",
  "Other",
];

const CompetitionForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const isEdit = Boolean(id);
  const queryClient = useQueryClient();

  const [formState, setFormState] = useState<FormState>(defaultFormState);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [newImageUrl, setNewImageUrl] = useState("");
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [newAnswerOption, setNewAnswerOption] = useState("");
  const [newFeature, setNewFeature] = useState("");
  const [newIncluded, setNewIncluded] = useState("");
  const [newTag, setNewTag] = useState("");
  const [newSpec, setNewSpec] = useState<CompetitionSpec>({ label: "", value: "" });

  const {
    data: competition,
    isLoading: isLoadingCompetition,
    isFetching: isFetchingCompetition,
    isError: isCompetitionError,
  } = useQuery({
    queryKey: ["admin", "competition", id],
    queryFn: async () => {
      if (!id) {
        return null;
      }
      const result = await competitionService.getCompetitionById(id, {
        admin: true,
      });
      return result;
    },
    enabled: isEdit && Boolean(id),
    staleTime: 60_000,
  });

  useEffect(() => {
    if (!isEdit) {
      setFormState(defaultFormState);
      setExistingImages([]);
      setUploadedImages([]);
      return;
    }

    if (competition) {
      setFormState({
        title: competition.title ?? "",
        description: competition.description ?? "",
        shortDescription: competition.shortDescription ?? "",
        prize: competition.prize ?? "",
        prizeValue:
          competition.prizeValue !== undefined
            ? String(competition.prizeValue)
            : "",
        cashAlternative:
          competition.cashAlternative !== undefined
            ? String(competition.cashAlternative)
            : "",
        originalPrice:
          competition.originalPrice !== undefined
            ? String(competition.originalPrice)
            : "",
        cashAlternativeDetails: competition.cashAlternativeDetails ?? "",
        ticketPrice:
          competition.ticketPrice !== undefined
            ? String(competition.ticketPrice)
            : "",
        maxTickets:
          competition.maxTickets !== undefined
            ? String(competition.maxTickets)
            : "",
        soldTickets:
          competition.soldTickets !== undefined
            ? String(competition.soldTickets)
            : "",
        drawDate: competition.drawDate
          ? competition.drawDate.substring(0, 10)
          : "",
        endDate: competition.endDate
          ? competition.endDate.substring(0, 10)
          : "",
        startDate: competition.startDate
          ? competition.startDate.substring(0, 10)
          : "",
        status: competition.status ?? "draft",
        category: competition.category ?? "Other",
        featured: Boolean(competition.featured),
        isGuaranteedDraw: Boolean(competition.isGuaranteedDraw),
        isActive: competition.isActive ?? false,
        question: competition.question?.question ?? "",
        correctAnswer: competition.question?.correctAnswer ?? "",
        answerOptions: competition.question?.options ?? [],
        questionExplanation: competition.question?.explanation ?? "",
        tags: competition.tags ?? [],
        features: competition.features ?? [],
        included: competition.included ?? [],
        specifications: competition.specifications ?? [],
        termsAndConditions: competition.termsAndConditions ?? "",
      });
      setExistingImages(
        (competition.images ?? [])
          .map((image) => image.url)
          .filter((url): url is string => Boolean(url)),
      );
      setUploadedImages([]);
    }

    if (isCompetitionError && isEdit) {
      toast.error("Unable to load competition");
      navigate("/admin/competitions");
    }
  }, [competition, isEdit, isCompetitionError, navigate]);

  const createMutation = useMutation({
    mutationFn: (payload: FormData) => competitionService.createCompetition(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "competitions"] });
      toast.success("Competition created successfully");
      navigate("/admin/competitions");
    },
    onError: (error: unknown) => {
      const message =
        error instanceof Error ? error.message : "Failed to create competition";
      toast.error(message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ competitionId, payload }: { competitionId: string; payload: FormData }) =>
      competitionService.updateCompetition(competitionId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "competitions"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "competition", id] });
      toast.success("Competition updated successfully");
      navigate("/admin/competitions");
    },
    onError: (error: unknown) => {
      const message =
        error instanceof Error ? error.message : "Failed to update competition";
      toast.error(message);
    },
  });

  const isSaving = createMutation.isPending || updateMutation.isPending;

  const handleFieldChange = (
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
      | React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const { name, value, type } = event.target;
    if (type === "checkbox") {
      setFormState((prev) => ({
        ...prev,
        [name]: (event.target as HTMLInputElement).checked,
      }));
      return;
    }
    setFormState((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const addToList = (
    key: keyof Pick<FormState, "answerOptions" | "features" | "included" | "tags">,
    value: string,
  ) => {
    const trimmed = value.trim();
    if (!trimmed) {
      return;
    }
    setFormState((prev) => {
      if (prev[key].includes(trimmed)) {
        return prev;
      }
      const nextState: FormState = {
        ...prev,
        [key]: [...prev[key], trimmed],
      };
      if (key === "answerOptions" && !nextState.correctAnswer) {
        nextState.correctAnswer = trimmed;
      }
      return nextState;
    });
  };

  const removeFromList = (
    key: keyof Pick<FormState, "answerOptions" | "features" | "included" | "tags">,
    index: number,
  ) => {
    setFormState((prev) => {
      const updatedList = prev[key].filter((_, idx) => idx !== index);
      const nextState: FormState = {
        ...prev,
        [key]: updatedList,
      };
      if (key === "answerOptions" && !updatedList.includes(prev.correctAnswer)) {
        nextState.correctAnswer = updatedList[0] ?? "";
      }
      return nextState;
    });
  };

  const handleImageUrlAdd = () => {
    if (!newImageUrl.trim()) {
      return;
    }
    setExistingImages((prev) => [...prev, newImageUrl.trim()]);
    setNewImageUrl("");
  };

  const handleExistingImageRemove = (index: number) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files?.length) {
      return;
    }
    setUploadedImages((prev) => [...prev, ...Array.from(files)]);
  };

  const removeUploadedImage = (index: number) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const buildFormData = (): FormData => {
    const payload = new FormData();

    payload.append("title", formState.title);
    payload.append("description", formState.description);
    payload.append("shortDescription", formState.shortDescription);
    payload.append("prize", formState.prize);
    if (formState.prizeValue) {
      payload.append("prizeValue", formState.prizeValue);
    }
    if (formState.cashAlternative) {
      payload.append("cashAlternative", formState.cashAlternative);
    }
    if (formState.originalPrice) {
      payload.append("originalPrice", formState.originalPrice);
    }
    if (formState.cashAlternativeDetails) {
      payload.append("cashAlternativeDetails", formState.cashAlternativeDetails);
    }
    payload.append("ticketPrice", formState.ticketPrice);
    payload.append("maxTickets", formState.maxTickets);
    if (formState.soldTickets) {
      payload.append("soldTickets", formState.soldTickets);
    }
    payload.append("drawDate", formState.drawDate);
    if (formState.endDate) {
      payload.append("endDate", formState.endDate);
    }
    if (formState.startDate) {
      payload.append("startDate", formState.startDate);
    }
    payload.append("status", formState.status);
    payload.append("category", formState.category);
    payload.append("featured", String(formState.featured));
    payload.append("isGuaranteedDraw", String(formState.isGuaranteedDraw));
    payload.append("isActive", String(formState.isActive));
    if (formState.termsAndConditions) {
      payload.append("termsAndConditions", formState.termsAndConditions);
    }

    payload.append("question[question]", formState.question);
    formState.answerOptions.forEach((option) =>
      payload.append("question[options][]", option),
    );
    if (formState.correctAnswer) {
      payload.append("question[correctAnswer]", formState.correctAnswer);
    }
    if (formState.questionExplanation) {
      payload.append("question[explanation]", formState.questionExplanation);
    }
    formState.features.forEach((feature) => payload.append("features[]", feature));
    formState.included.forEach((item) => payload.append("included[]", item));
    formState.tags.forEach((tag) => payload.append("tags[]", tag));
    formState.specifications.forEach((spec) => {
      payload.append("specifications[][label]", spec.label);
      payload.append("specifications[][value]", spec.value);
    });

    existingImages.forEach((image) => payload.append("existingImages[]", image));
    uploadedImages.forEach((file) => payload.append("images", file));

    return payload;
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!formState.title.trim()) {
      toast.error("Title is required");
      return;
    }
    if (!formState.prize.trim()) {
      toast.error("Prize name is required");
      return;
    }
    if (!formState.ticketPrice) {
      toast.error("Ticket price is required");
      return;
    }
    if (!formState.drawDate) {
      toast.error("Draw date is required");
      return;
    }
    if (!formState.question.trim()) {
      toast.error("Question prompt is required");
      return;
    }
    if (!formState.answerOptions.length) {
      toast.error("At least one answer option is required");
      return;
    }
    if (!formState.correctAnswer.trim()) {
      toast.error("Correct answer is required");
      return;
    }
    if (!formState.answerOptions.includes(formState.correctAnswer.trim())) {
      toast.error("Correct answer must match one of the answer options");
      return;
    }

    const payload = buildFormData();

    if (isEdit && id) {
      updateMutation.mutate({ competitionId: id, payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const answerPlaceholder = useMemo(() => {
    switch (formState.answerOptions.length) {
      case 0:
        return "e.g. Option A";
      case 1:
        return "e.g. Option B";
      case 2:
        return "e.g. Option C";
      default:
        return "Add another option";
    }
  }, [formState.answerOptions.length]);

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => navigate("/admin/competitions")}
          className="p-2 text-white/70 hover:text-gold-primary transition-colors"
        >
          <FaArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-4xl font-light text-white gold-text-glow mb-2">
            {isEdit ? "Edit Competition" : "Create Competition"}
          </h1>
          <p className="text-white/60 text-sm uppercase tracking-wide font-light">
            {isEdit
              ? "Update an existing competition"
              : "Add a new competition"}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <section className="bg-black border border-gold-primary/20 rounded-lg p-6 space-y-6">
          <header>
            <h2 className="text-xl font-light text-white mb-4">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-white/70 text-sm font-light mb-2 uppercase tracking-wider">
                  Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formState.title}
                  onChange={handleFieldChange}
                  required
                  className="w-full px-4 py-2.5 bg-black border border-gold-primary/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-gold-primary/50 transition-colors"
                />
              </div>
              <div>
                <label className="block text-white/70 text-sm font-light mb-2 uppercase tracking-wider">
                  Category *
                </label>
                <select
                  name="category"
                  value={formState.category}
                  onChange={handleFieldChange}
                  required
                  className="w-full px-4 py-2.5 bg-black border border-gold-primary/20 rounded-lg text-white focus:outline-none focus:border-gold-primary/50 transition-colors"
                >
                  {categoryOptions.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-white/70 text-sm font-light mb-2 uppercase tracking-wider">
                  Short Description *
                </label>
                <input
                  type="text"
                  name="shortDescription"
                  value={formState.shortDescription}
                  onChange={handleFieldChange}
                  required
                  className="w-full px-4 py-2.5 bg-black border border-gold-primary/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-gold-primary/50 transition-colors"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-white/70 text-sm font-light mb-2 uppercase tracking-wider">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formState.description}
                  onChange={handleFieldChange}
                  rows={4}
                  required
                  className="w-full px-4 py-2.5 bg-black border border-gold-primary/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-gold-primary/50 transition-colors resize-none"
                />
              </div>
            </div>
          </header>

          <div className="border-t border-gold-primary/10 pt-6">
            <h3 className="text-xl font-light text-white mb-4">Prize Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <label className="block text-white/70 text-sm font-light mb-2 uppercase tracking-wider">
                  Prize Name *
                </label>
                <input
                  type="text"
                  name="prize"
                  value={formState.prize}
                  onChange={handleFieldChange}
                  required
                  className="w-full px-4 py-2.5 bg-black border border-gold-primary/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-gold-primary/50 transition-colors"
                />
              </div>
              <div>
                <label className="block text-white/70 text-sm font-light mb-2 uppercase tracking-wider">
                  Prize Value (£)
                </label>
                <input
                  type="number"
                  name="prizeValue"
                  value={formState.prizeValue}
                  onChange={handleFieldChange}
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-2.5 bg-black border border-gold-primary/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-gold-primary/50 transition-colors"
                />
              </div>
              <div>
                <label className="block text-white/70 text-sm font-light mb-2 uppercase tracking-wider">
                  Cash Alternative (£)
                </label>
                <input
                  type="number"
                  name="cashAlternative"
                  value={formState.cashAlternative}
                  onChange={handleFieldChange}
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-2.5 bg-black border border-gold-primary/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-gold-primary/50 transition-colors"
                />
              </div>
              <div>
                <label className="block text-white/70 text-sm font-light mb-2 uppercase tracking-wider">
                  Original Price (£)
                </label>
                <input
                  type="number"
                  name="originalPrice"
                  value={formState.originalPrice}
                  onChange={handleFieldChange}
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-2.5 bg-black border border-gold-primary/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-gold-primary/50 transition-colors"
                />
              </div>
            </div>
            <div className="mt-6">
              <label className="block text-white/70 text-sm font-light mb-2 uppercase tracking-wider">
                Explanation (optional)
              </label>
              <textarea
                name="questionExplanation"
                value={formState.questionExplanation}
                onChange={handleFieldChange}
                rows={3}
                placeholder="Provide additional context to explain the correct answer."
                className="w-full px-4 py-2.5 bg-black border border-gold-primary/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-gold-primary/50 transition-colors resize-none"
              />
            </div>
            <div className="mt-6">
              <label className="block text-white/70 text-sm font-light mb-2 uppercase tracking-wider">
                Cash Alternative Details
              </label>
              <textarea
                name="cashAlternativeDetails"
                value={formState.cashAlternativeDetails}
                onChange={handleFieldChange}
                rows={3}
                className="w-full px-4 py-2.5 bg-black border border-gold-primary/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-gold-primary/50 transition-colors resize-none"
              />
            </div>
          </div>

          <div className="border-t border-gold-primary/10 pt-6">
            <h3 className="text-xl font-light text-white mb-4">Ticketing & Schedule</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <label className="block text-white/70 text-sm font-light mb-2 uppercase tracking-wider">
                  Ticket Price (£) *
                </label>
                <input
                  type="number"
                  name="ticketPrice"
                  value={formState.ticketPrice}
                  onChange={handleFieldChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-2.5 bg-black border border-gold-primary/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-gold-primary/50 transition-colors"
                />
              </div>
              <div>
                <label className="block text-white/70 text-sm font-light mb-2 uppercase tracking-wider">
                  Max Tickets *
                </label>
                <input
                  type="number"
                  name="maxTickets"
                  value={formState.maxTickets}
                  onChange={handleFieldChange}
                  required
                  min="1"
                  className="w-full px-4 py-2.5 bg-black border border-gold-primary/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-gold-primary/50 transition-colors"
                />
              </div>
              <div>
                <label className="block text-white/70 text-sm font-light mb-2 uppercase tracking-wider">
                  Sold Tickets
                </label>
                <input
                  type="number"
                  name="soldTickets"
                  value={formState.soldTickets}
                  onChange={handleFieldChange}
                  min="0"
                  className="w-full px-4 py-2.5 bg-black border border-gold-primary/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-gold-primary/50 transition-colors"
                />
              </div>
              <div>
                <label className="block text-white/70 text-sm font-light mb-2 uppercase tracking-wider">
                  Status *
                </label>
                <select
                  name="status"
                  value={formState.status}
                  onChange={handleFieldChange}
                  required
                  className="w-full px-4 py-2.5 bg-black border border-gold-primary/20 rounded-lg text-white focus:outline-none focus:border-gold-primary/50 transition-colors"
                >
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              <div>
                <label className="block text-white/70 text-sm font-light mb-2 uppercase tracking-wider">
                  Start Date
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={formState.startDate}
                  onChange={handleFieldChange}
                  className="w-full px-4 py-2.5 bg-black border border-gold-primary/20 rounded-lg text-white focus:outline-none focus:border-gold-primary/50 transition-colors"
                />
              </div>
              <div>
                <label className="block text-white/70 text-sm font-light mb-2 uppercase tracking-wider">
                  End Date
                </label>
                <input
                  type="date"
                  name="endDate"
                  value={formState.endDate}
                  onChange={handleFieldChange}
                  className="w-full px-4 py-2.5 bg-black border border-gold-primary/20 rounded-lg text-white focus:outline-none focus:border-gold-primary/50 transition-colors"
                />
              </div>
              <div>
                <label className="block text-white/70 text-sm font-light mb-2 uppercase tracking-wider">
                  Draw Date *
                </label>
                <input
                  type="date"
                  name="drawDate"
                  value={formState.drawDate}
                  onChange={handleFieldChange}
                  required
                  className="w-full px-4 py-2.5 bg-black border border-gold-primary/20 rounded-lg text-white focus:outline-none focus:border-gold-primary/50 transition-colors"
                />
              </div>
            </div>
            <div className="flex items-center gap-6 mt-6">
              <label className="flex items-center gap-2 text-white/70 text-sm font-light">
                <input
                  type="checkbox"
                  name="featured"
                  checked={formState.featured}
                  onChange={handleFieldChange}
                  className="h-4 w-4 rounded border-gold-primary/30 bg-black text-gold-primary focus:ring-gold-primary/50"
                />
                <span>Featured competition</span>
              </label>
              <label className="flex items-center gap-2 text-white/70 text-sm font-light">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formState.isActive}
                  onChange={handleFieldChange}
                  className="h-4 w-4 rounded border-gold-primary/30 bg-black text-gold-primary focus:ring-gold-primary/50"
                />
                <span>Active</span>
              </label>
              <label className="flex items-center gap-2 text-white/70 text-sm font-light">
                <input
                  type="checkbox"
                  name="isGuaranteedDraw"
                  checked={formState.isGuaranteedDraw}
                  onChange={handleFieldChange}
                  className="h-4 w-4 rounded border-gold-primary/30 bg-black text-gold-primary focus:ring-gold-primary/50"
                />
                <span>Guaranteed draw</span>
              </label>
            </div>
          </div>

          <div className="border-t border-gold-primary/10 pt-6">
            <h3 className="text-xl font-light text-white mb-4">Question & Answer</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-white/70 text-sm font-light mb-2 uppercase tracking-wider">
                  Question *
                </label>
                <input
                  type="text"
                  name="question"
                  value={formState.question}
                  onChange={handleFieldChange}
                  required
                  className="w-full px-4 py-2.5 bg-black border border-gold-primary/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-gold-primary/50 transition-colors"
                />
              </div>
              <div>
                <label className="block text-white/70 text-sm font-light mb-2 uppercase tracking-wider">
                  Correct Answer *
                </label>
                <input
                  type="text"
                  name="correctAnswer"
                  value={formState.correctAnswer}
                  onChange={handleFieldChange}
                  required
                  className="w-full px-4 py-2.5 bg-black border border-gold-primary/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-gold-primary/50 transition-colors"
                />
              </div>
            </div>
            <div className="mt-6">
              <label className="block text-white/70 text-sm font-light mb-2 uppercase tracking-wider">
                Answer Options
              </label>
              <div className="flex flex-col gap-3">
                <div className="flex flex-wrap items-center gap-3">
                  <input
                    type="text"
                    value={newAnswerOption}
                    onChange={(event) => setNewAnswerOption(event.target.value)}
                    placeholder={answerPlaceholder}
                    className="flex-1 min-w-[220px] px-4 py-2.5 bg-black border border-gold-primary/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-gold-primary/50 transition-colors"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      addToList("answerOptions", newAnswerOption);
                      setNewAnswerOption("");
                    }}
                  >
                    <FaPlus className="mr-2 h-3 w-3" /> Add Option
                  </Button>
                </div>
                {formState.answerOptions.length > 0 && (
                  <ul className="flex flex-wrap gap-2">
                    {formState.answerOptions.map((option, index) => (
                      <li
                        key={`${option}-${index}`}
                        className="flex items-center gap-2 rounded-full border border-gold-primary/20 px-3 py-1 text-sm text-white/80"
                      >
                        {option}
                        <button
                          type="button"
                          onClick={() => removeFromList("answerOptions", index)}
                          className="text-red-400 hover:text-red-200"
                          aria-label="Remove option"
                        >
                          <FaTrash className="h-3 w-3" />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>

          <div className="border-t border-gold-primary/10 pt-6">
            <h3 className="text-xl font-light text-white mb-4">Highlights</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <label className="block text-white/70 text-sm font-light mb-2 uppercase tracking-wider">
                  Features
                </label>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <input
                      type="text"
                      value={newFeature}
                      onChange={(event) => setNewFeature(event.target.value)}
                      placeholder="Add feature"
                      className="flex-1 px-4 py-2.5 bg-black border border-gold-primary/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-gold-primary/50 transition-colors"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        addToList("features", newFeature);
                        setNewFeature("");
                      }}
                    >
                      <FaPlus className="mr-2 h-3 w-3" />
                    </Button>
                  </div>
                  {formState.features.length > 0 && (
                    <ul className="space-y-2 text-sm text-white/70">
                      {formState.features.map((feature, index) => (
                        <li key={`${feature}-${index}`} className="flex items-center justify-between gap-2">
                          <span>{feature}</span>
                          <button
                            type="button"
                            onClick={() => removeFromList("features", index)}
                            className="text-red-400 hover:text-red-200"
                            aria-label="Remove feature"
                          >
                            <FaTrash className="h-3 w-3" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-white/70 text-sm font-light mb-2 uppercase tracking-wider">
                  Included Items
                </label>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <input
                      type="text"
                      value={newIncluded}
                      onChange={(event) => setNewIncluded(event.target.value)}
                      placeholder="Add included item"
                      className="flex-1 px-4 py-2.5 bg-black border border-gold-primary/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-gold-primary/50 transition-colors"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        addToList("included", newIncluded);
                        setNewIncluded("");
                      }}
                    >
                      <FaPlus className="mr-2 h-3 w-3" />
                    </Button>
                  </div>
                  {formState.included.length > 0 && (
                    <ul className="space-y-2 text-sm text-white/70">
                      {formState.included.map((item, index) => (
                        <li key={`${item}-${index}`} className="flex items-center justifyetween gap-2">
                          <span>{item}</span>
                          <button
                            type="button"
                            onClick={() => removeFromList("included", index)}
                            className="text-red-400 hover:text-red-200"
                            aria-label="Remove item"
                          >
                            <FaTrash className="h-3 w-3" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-white/70 text-sm font-light mb-2 uppercase tracking-wider">
                  Tags
                </label>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <input
                      type="text"
                      value={newTag}
                      onChange={(event) => setNewTag(event.target.value)}
                      placeholder="Add tag"
                      className="flex-1 px-4 py-2.5 bg-black border border-gold-primary/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-gold-primary/50 transition-colors"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        addToList("tags", newTag);
                        setNewTag("");
                      }}
                    >
                      <FaPlus className="mr-2 h-3 w-3" />
                    </Button>
                  </div>
                  {formState.tags.length > 0 && (
                    <ul className="space-y-2 text-sm text-white/70">
                      {formState.tags.map((tag, index) => (
                        <li key={`${tag}-${index}`} className="flex items-center justify-between gap-2">
                          <span>{tag}</span>
                          <button
                            type="button"
                            onClick={() => removeFromList("tags", index)}
                            className="text-red-400 hover:text-red-200"
                            aria-label="Remove tag"
                          >
                            <FaTrash className="h-3 w-3" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <div>
                  <label className="block text-white/70 text-sm font-light mb-2 uppercase tracking-wider">
                    Specifications
                  </label>
                  <div className="space-y-3">
                    <div className="flex flex-col md:flex-row gap-3">
                      <input
                        type="text"
                        value={newSpec.label}
                        onChange={(event) =>
                          setNewSpec((prev) => ({ ...prev, label: event.target.value }))
                        }
                        placeholder="Label (e.g. Engine)"
                        className="flex-1 px-4 py-2.5 bg-black border border-gold-primary/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-gold-primary/50 transition-colors"
                      />
                      <input
                        type="text"
                        value={newSpec.value}
                        onChange={(event) =>
                          setNewSpec((prev) => ({ ...prev, value: event.target.value }))
                        }
                        placeholder="Value (e.g. 4.0L Twin-Turbo V8)"
                        className="flex-1 px-4 py-2.5 bg-black border border-gold-primary/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-gold-primary/50 transition-colors"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          if (!newSpec.label.trim() || !newSpec.value.trim()) {
                            return;
                          }
                          setFormState((prev) => ({
                            ...prev,
                            specifications: [
                              ...prev.specifications,
                              {
                                label: newSpec.label.trim(),
                                value: newSpec.value.trim(),
                              },
                            ],
                          }));
                          setNewSpec({ label: "", value: "" });
                        }}
                        leftIcon={<FaPlus className="h-3 w-3" />}
                      >
                        Add
                      </Button>
                    </div>
                    {formState.specifications.length > 0 && (
                      <ul className="space-y-2 text-sm text-white/70">
                        {formState.specifications.map((spec, index) => (
                          <li
                            key={`${spec.label}-${spec.value}-${index}`}
                            className="flex items-center justify-between gap-2"
                          >
                            <span>
                              <span className="font-semibold">{spec.label}:</span> {spec.value}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                setFormState((prev) => ({
                                  ...prev,
                                  specifications: prev.specifications.filter((_, idx) => idx !== index),
                                }))
                              }
                              className="text-red-400 hover:text-red-200"
                              aria-label="Remove specification"
                            >
                              <FaTrash className="h-3 w-3" />
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gold-primary/10 pt-6">
            <h3 className="text-xl font-light text-white mb-4">Terms & Conditions</h3>
            <textarea
              name="termsAndConditions"
              value={formState.termsAndConditions}
              onChange={handleFieldChange}
              rows={6}
              className="w-full px-4 py-2.5 bg-black border border-gold-primary/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-gold-primary/50 transition-colors"
            />
          </div>

          <div className="border-t border-gold-primary/10 pt-6">
            <h3 className="text-xl font-light text-white mb-4">Images</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <p className="text-white/60 text-sm font-light">
                  Existing Images
                </p>
                {existingImages.length === 0 ? (
                  <p className="text-white/40 text-sm">No images on record</p>
                ) : (
                  <ul className="grid grid-cols-2 gap-4">
                    {existingImages.map((url, index) => (
                      <li key={`${url}-${index}`} className="relative">
                        <img
                          src={url}
                          alt={`Competition image ${index + 1}`}
                          className="h-32 w-full rounded-lg object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => handleExistingImageRemove(index)}
                          className="absolute top-2 right-2 rounded-full bg-black/70 p-2 text-white/80 hover:bg-black/90"
                          aria-label="Remove image"
                        >
                          <FaTrash className="h-3 w-3" />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
                <div className="flex items-center gap-3">
                  <input
                    type="url"
                    value={newImageUrl}
                    onChange={(event) => setNewImageUrl(event.target.value)}
                    placeholder="Paste image URL"
                    className="flex-1 px-4 py-2.5 bg-black border border-gold-primary/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-gold-primary/50 transition-colors"
                  />
                  <Button type="button" variant="outline" size="sm" onClick={handleImageUrlAdd}>
                    Add
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-white/60 text-sm font-light">Upload New Images</p>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileChange}
                  className="w-full text-white/70"
                />
                {uploadedImages.length > 0 && (
                  <ul className="space-y-2 text-sm text-white/70">
                    {uploadedImages.map((file, index) => (
                      <li key={`${file.name}-${index}`} className="flex items-center justify-between gap-2">
                        <span>{file.name}</span>
                        <button
                          type="button"
                          onClick={() => removeUploadedImage(index)}
                          className="text-red-400 hover:text-red-200"
                          aria-label="Remove upload"
                        >
                          <FaTrash className="h-3 w-3" />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </section>

        <div className="flex items-center justify-end gap-3">
          <Button
            type="button"
            variant="ghost"
            onClick={() => navigate("/admin/competitions")}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            withBrackets
            disabled={isSaving || isFetchingCompetition || isLoadingCompetition}
            loading={isSaving}
          >
            {isEdit ? "Update Competition" : "Create Competition"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CompetitionForm;

