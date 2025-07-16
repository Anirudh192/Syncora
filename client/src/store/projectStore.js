import { create } from 'zustand';

const useProjectStore = create((set) => ({
  projects: [],
  setProjects: (projects) => set({ projects }),
  removeProject: (projectId) => set((state) => ({
    projects: state.projects.filter((p) => p.id !== projectId),
  })),
}));

export default useProjectStore;