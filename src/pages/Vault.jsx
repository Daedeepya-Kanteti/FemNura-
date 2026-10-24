import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { FileText, Upload, Trash2, Lock, Download, Eye, Search, Filter } from "lucide-react";
import PageHeader from "../components/PageHeader.jsx";
import { Card, Button, EmptyState, Disclaimer, Badge } from "../components/UI.jsx";
import { useDemoData } from "../context/DemoDataContext.jsx";

const categories = ["Lab report", "Prescription", "Imaging", "Doctor's note", "Other"];

export default function Vault() {
  const { vaultFiles, setVaultFiles, userName } = useDemoData();
  const [category, setCategory] = useState(categories[0]);
  const [filterCategory, setFilterCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const inputRef = useRef(null);

  const handleFiles = (fileList) => {
    const fileArray = Array.from(fileList);
    fileArray.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newFile = {
          id: Date.now() + Math.random(),
          name: file.name,
          size: file.size,
          category,
          date: new Date().toISOString(),
          dataUrl: e.target?.result,
        };
        setVaultFiles((prev) => [newFile, ...prev]);
      };
      reader.readAsDataURL(file);
    });
  };

  const remove = (id) => setVaultFiles((prev) => prev.filter((f) => f.id !== id));

  const downloadFile = (file) => {
    if (file.dataUrl) {
      const a = document.createElement("a");
      a.href = file.dataUrl;
      a.download = file.name;
      a.click();
    } else {
      // Create a clean simulated record document download
      const content = `FemNura Medical Vault Document Record\nDocument: ${file.name}\nCategory: ${file.category}\nPatient: ${userName || "Patient"}\nUploaded: ${new Date(file.date).toLocaleString()}\n\nVerified Record Details: Securely stored in local medical vault.`;
      const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${file.name.replace(/\.[^/.]+$/, "")}_record.txt`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const filtered = vaultFiles.filter((f) => {
    const matchesCat = filterCategory === "All" || f.category === filterCategory;
    const matchesQuery = f.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  return (
    <div>
      <PageHeader
        eyebrow="Medical History Vault"
        title="Keep your records organised and ready"
        subtitle="Store reports, prescriptions, and notes in one private place, labelled the way that makes sense to you."
      />

      <div className="flex items-start gap-3 bg-plum-50 border border-plum-100 rounded-2xl px-5 py-4 mb-6 text-sm text-plum-600">
        <Lock size={18} className="shrink-0 mt-0.5 text-plum-500" />
        <p>
          Uploaded documents and lab report metadata are securely stored in your personal local profile vault and preserved across your sessions.
        </p>
      </div>

      <Card className="p-6 sm:p-7 mb-6">
        <h2 className="font-display text-lg font-semibold text-plum-800 mb-3">Add a Medical Document</h2>
        <p className="text-xs text-plum-500 mb-4">Select a category before uploading to keep records categorized.</p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-colors cursor-pointer ${
                category === c ? "bg-plum-700 text-white border-plum-700" : "bg-white text-plum-600 border-plum-200 hover:border-plum-400"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            if (e.dataTransfer.files?.length) handleFiles(e.dataTransfer.files);
          }}
          className="border-2 border-dashed border-plum-200 rounded-2xl py-10 flex flex-col items-center justify-center text-center cursor-pointer hover:border-plum-400 hover:bg-lavender-50/40 transition-colors"
        >
          <Upload className="text-plum-400 mb-3" size={28} />
          <p className="font-semibold text-plum-700 text-sm">Click to upload, or drag files here</p>
          <p className="text-xs text-plum-400 mt-1">PDF, images, scan reports, or lab results</p>
          <input
            ref={inputRef}
            type="file"
            multiple
            className="hidden"
            onChange={(e) => e.target.files?.length && handleFiles(e.target.files)}
          />
        </div>
      </Card>

      <Card className="p-6 sm:p-7 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
          <div className="flex items-center gap-2">
            <h2 className="font-display text-lg font-semibold text-plum-800">Your Documents</h2>
            <Badge tone="lavender">{vaultFiles.length} files</Badge>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-plum-400" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search documents..."
                className="rounded-xl border border-plum-200 pl-8 pr-3 py-1.5 text-xs text-plum-800 focus-ring bg-ivory/50"
              />
            </div>

            <div className="flex items-center gap-1 bg-ivory p-1 rounded-xl border border-plum-200/80">
              {["All", ...categories].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilterCategory(cat)}
                  className={`px-2 py-1 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer ${
                    filterCategory === cat ? "bg-plum-700 text-white" : "text-plum-600 hover:text-plum-900"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            icon={<FileText size={24} />}
            title={vaultFiles.length === 0 ? "No documents yet" : "No matching files"}
            description={
              vaultFiles.length === 0
                ? "Upload a lab report, prescription, or note to keep it organised and ready for your next appointment."
                : "No files match your search query or category filter."
            }
          />
        ) : (
          <div className="space-y-3">
            {filtered.map((f) => (
              <motion.div
                key={f.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between gap-4 p-4 rounded-2xl border border-plum-100 hover:border-plum-300 transition-colors bg-white shadow-2xs"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-lavender-50 text-plum-700 flex items-center justify-center shrink-0">
                    <FileText size={18} />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-plum-800 text-sm truncate">{f.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge tone="lavender">{f.category}</Badge>
                      <span className="text-[11px] text-plum-400">{(f.size / 1024).toFixed(1)} KB</span>
                      <span className="text-[11px] text-plum-300">•</span>
                      <span className="text-[11px] text-plum-400">{new Date(f.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => downloadFile(f)}
                    className="p-2 rounded-lg text-plum-500 hover:text-plum-900 hover:bg-lavender-50 transition-colors focus-ring cursor-pointer"
                    title="Download document"
                  >
                    <Download size={16} />
                  </button>
                  <button
                    onClick={() => remove(f.id)}
                    className="p-2 rounded-lg text-plum-300 hover:text-rose-600 hover:bg-rose-50 transition-colors focus-ring cursor-pointer"
                    title="Delete document"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </Card>

      <Disclaimer compact />
    </div>
  );
}
