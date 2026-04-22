"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Layers, Plus, Trash2, Loader2, CheckCircle2, X } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { categoryService } from "@/services/category.service";
import { useState } from "react";
import { toast } from "sonner";
import { confirmAction } from "@/utils/confirmModal";

export default function AdminCategoriesPage() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  // 1. Fetch Categories
  const { data: categoriesResponse, isLoading } = useQuery({
    queryKey: ["admin", "categories"],
    queryFn: categoryService.getAllCategories
  });

  const categories = categoriesResponse?.data || [];

  // 2. Create Mutation
  const createMutation = useMutation({
    mutationFn: (name: string) => categoryService.createCategory(name),
    onSuccess: () => {
      toast.success("Category surgicaly added to discovery nodes");
      queryClient.invalidateQueries({ queryKey: ["admin", "categories"] });
      setIsModalOpen(false);
      setNewCategoryName("");
    },
    onError: () => {
      toast.error("Failed to propagate new category");
    }
  });

  // 3. Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => categoryService.deleteCategory(id),
    onSuccess: () => {
      toast.success("Category surgicaly removed from platform");
      queryClient.invalidateQueries({ queryKey: ["admin", "categories"] });
    },
    onError: () => {
      toast.error("Failed to moderate category");
    }
  });

  const handleDelete = async (id: string, name: string) => {
    const confirmed = await confirmAction(
      "Confirm Deletion",
      `Are you sure you want to surgicaly moderate "${name}"? This cannot be undone.`
    );
    if (confirmed) {
      deleteMutation.mutate(id);
    }
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    createMutation.mutate(newCategoryName);
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <p className="text-muted-foreground animate-pulse font-medium italic">Synchronizing Discovery Domains...</p>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-12 pb-20"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black tracking-tight flex items-center gap-3 italic uppercase text-primary">
            <Layers className="w-10 h-10" />
            Discovery Hub
          </h2>
          <p className="text-muted-foreground mt-1 font-medium">
            Manage global categories to surgicaly organize platform events.
          </p>
        </div>

        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-3xl font-black shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
        >
          <Plus className="w-5 h-5" />
          Add Category
        </button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence mode="popLayout">
          {categories.map((category, i) => (
            <motion.div 
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: i * 0.05 }}
              key={category.id} 
              className="p-8 rounded-[3rem] bg-card border border-border/50 hover:border-primary/40 shadow-xl shadow-primary/5 transition-all flex items-center justify-between group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Layers className="w-12 h-12 text-primary" />
              </div>
              
              <div className="relative z-10">
                <h3 className="text-2xl font-black italic uppercase tracking-tight">{category.name}</h3>
                <p className="text-xs font-bold text-muted-foreground mt-1 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-primary" />
                  Live Discovery Node
                </p>
              </div>

              <div className="flex gap-2 relative z-10">
                <button 
                  onClick={() => handleDelete(category.id, category.name)}
                  disabled={deleteMutation.isPending}
                  className="p-4 rounded-2xl bg-rose-500/10 text-rose-500 opacity-0 group-hover:opacity-100 transition-all hover:bg-rose-500 hover:text-white"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Creation Modal Overlay */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-card border border-border rounded-[3rem] p-10 shadow-2xl"
            >
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-6 right-6 p-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="text-center space-y-2 mb-8">
                <h3 className="text-3xl font-black italic uppercase tracking-tighter text-primary">New Category</h3>
                <p className="text-sm text-muted-foreground font-medium">Inject a new node into the platform discovery feed.</p>
              </div>

              <form onSubmit={handleCreate} className="space-y-6">
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">Domain Name</label>
                    <input 
                      autoFocus
                      placeholder="e.g. Technology, Music, Sports"
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      className="w-full bg-secondary/50 border border-border rounded-2xl py-4 px-6 outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-bold text-lg transition-all"
                    />
                </div>

                <button 
                  type="submit"
                  disabled={createMutation.isPending || !newCategoryName.trim()}
                  className="w-full bg-primary text-primary-foreground py-5 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
                >
                  {createMutation.isPending ? <Loader2 className="w-6 h-6 animate-spin mx-auto" /> : "Deploy Category"}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {categories.length === 0 && !isLoading && (
          <div className="p-20 text-center space-y-6 bg-secondary/20 rounded-[4rem] border-2 border-dashed border-border/50">
              <div className="w-24 h-24 rounded-[2.5rem] bg-secondary flex items-center justify-center text-muted-foreground mx-auto">
                  <Layers className="w-12 h-12" />
              </div>
              <div className="space-y-2">
                  <p className="text-xl font-black italic uppercase">No Discovery Nodes Found</p>
                  <p className="text-muted-foreground font-medium italic">Start organizing your platform by creating the first category.</p>
              </div>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="px-8 py-4 bg-primary text-primary-foreground rounded-2xl font-black uppercase tracking-widest hover:scale-105 transition-all"
              >
                Create Category
              </button>
          </div>
      )}
    </motion.div>
  );
}
