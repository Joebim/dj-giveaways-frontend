import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Competition, CompetitionFilters } from "../types";

interface CompetitionState {
  competitions: Competition[];
  featuredCompetitions: Competition[];
  currentCompetition: Competition | null;
  filters: CompetitionFilters;
  searchQuery: string;
  isLoading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  totalCount: number;
}

interface CompetitionActions {
  setCompetitions: (competitions: Competition[]) => void;
  setFeaturedCompetitions: (competitions: Competition[]) => void;
  setCurrentCompetition: (competition: Competition | null) => void;
  addCompetition: (competition: Competition) => void;
  updateCompetition: (id: string, updates: Partial<Competition>) => void;
  removeCompetition: (id: string) => void;
  setFilters: (filters: Partial<CompetitionFilters>) => void;
  clearFilters: () => void;
  setSearchQuery: (query: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setPagination: (page: number, totalPages: number, totalCount: number) => void;
  resetCompetitions: () => void;
}

type CompetitionStore = CompetitionState & CompetitionActions;

const initialFilters: CompetitionFilters = {
  category: undefined,
  status: undefined,
  priceRange: undefined,
  prizeRange: undefined,
  featured: undefined,
  search: undefined,
};

export const useCompetitionStore = create<CompetitionStore>()(
  persist(
    (set) => ({
      // State
      competitions: [],
      featuredCompetitions: [],
      currentCompetition: null,
      filters: initialFilters,
      searchQuery: "",
      isLoading: false,
      error: null,
      currentPage: 1,
      totalPages: 0,
      totalCount: 0,

      // Actions
      setCompetitions: (competitions) => {
        set({ competitions });
      },

      setFeaturedCompetitions: (competitions) => {
        set({ featuredCompetitions: competitions });
      },

      setCurrentCompetition: (competition) => {
        set({ currentCompetition: competition });
      },

      addCompetition: (competition) => {
        set((state) => ({
          competitions: [competition, ...state.competitions],
        }));
      },

      updateCompetition: (id, updates) => {
        set((state) => ({
          competitions: state.competitions.map((comp) =>
            comp.id === id ? { ...comp, ...updates } : comp
          ),
          featuredCompetitions: state.featuredCompetitions.map((comp) =>
            comp.id === id ? { ...comp, ...updates } : comp
          ),
          currentCompetition:
            state.currentCompetition?.id === id
              ? { ...state.currentCompetition, ...updates }
              : state.currentCompetition,
        }));
      },

      removeCompetition: (id) => {
        set((state) => ({
          competitions: state.competitions.filter((comp) => comp.id !== id),
          featuredCompetitions: state.featuredCompetitions.filter(
            (comp) => comp.id !== id
          ),
          currentCompetition:
            state.currentCompetition?.id === id
              ? null
              : state.currentCompetition,
        }));
      },

      setFilters: (filters) => {
        set((state) => ({
          filters: { ...state.filters, ...filters },
          currentPage: 1, // Reset to first page when filters change
        }));
      },

      clearFilters: () => {
        set({ filters: initialFilters, currentPage: 1 });
      },

      setSearchQuery: (query) => {
        set({ searchQuery: query, currentPage: 1 });
      },

      setLoading: (loading) => {
        set({ isLoading: loading });
      },

      setError: (error) => {
        set({ error });
      },

      setPagination: (page, totalPages, totalCount) => {
        set({ currentPage: page, totalPages, totalCount });
      },

      resetCompetitions: () => {
        set({
          competitions: [],
          featuredCompetitions: [],
          currentCompetition: null,
          filters: initialFilters,
          searchQuery: "",
          isLoading: false,
          error: null,
          currentPage: 1,
          totalPages: 0,
          totalCount: 0,
        });
      },
    }),
    {
      name: "competition-storage",
      partialize: (state) => ({
        filters: state.filters,
        searchQuery: state.searchQuery,
        currentPage: state.currentPage,
      }),
    }
  )
);
