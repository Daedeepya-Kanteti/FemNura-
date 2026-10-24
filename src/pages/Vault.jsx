import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { FileText, Upload, Trash2, Lock, AlertTriangle } from "lucide-react";
import PageHeader from "../components/PageHeader.jsx";
import { Card, Button, EmptyState, Disclaimer, Badge } from "../components/UI.jsx";
import { useDemoData } from "../context/DemoDataContext.jsx";

const categories = ["Lab report", "Prescription", "Imaging", "Doctor's note", "Other"];

export default function Vault() {
  const { vaultFiles, setVaultFiles } = useDemoData();
  const [category, setCategory] = useState(categories[0]);
  const inputRef = useRef(null);

  const handleFiles = (fileList) => {
    const files = Array.from(fileList).map((f) => ({
      id: Date.now() + Math.random(),
      name: f.name,
      size: f.size,
      category,
      date: new Date().toISOString(),
    }));
    setVaultFiles((prev) => [...files, ...prev]);
  };

  const remove = (id) => setVaultFiles((prev) => prev.filter((f) => f.id !== id));

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
          Uploaded documents and lab report metadata are securely stored in your local profile vault and preserved across your sessions.
        </p>
      </div>

      <Card className="p-6 sm:p-7 mb-6">
        <h2 className="font-display text-lg font-semibold text-plum-800 mb-4">Add a document</h2>
        <div className="flex flex-wrap gap-2 mb-4">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`px-4 py-2 rounded-full text-sm font-semibold border transition-colors ${
                category === c ? "bg-plum-700 text-white border-plum-700" : "bg-white text-plum-600 border-plum-200"
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
          <p className="font-semibold text-plum-700 text-sm">Click to upload, or drag a file here</p>
          <p className="text-xs text-plum-400 mt-1">PDF, image, or document files</p>
          <input ref={inputRef} type="file" multiple className="hidden" onChange={(e) => e.target.files?.length && handleFiles(e.target.files)} />
        </div>
      </Card>

      <Card className="p-6 sm:p-7 mb-6">
        <h2 className="font-display text-lg font-semibold text-plum-800 mb-5">Your documents</h2>
        {vaultFiles.length === 0 ? (
          <EmptyState
            icon={<FileText size={24} />}
            title="No documents yet"
            description="Upload a lab report, prescription, or note to keep it organised and ready for your next appointment."
          />
        ) : (
          <div className="space-y-3">
            {vaultFiles.map((f) => (
              <motion.div
                key={f.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between gap-4 p-4 rounded-2xl border border-plum-100"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-lavender-50 text-plum-600 flex items-center justify-center shrink-0">
                    <FileText size={18} />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-plum-800 truncate">{f.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge tone="lavender">{f.category}</Badge>
                      <span className="text-xs text-plum-400">{(f.size / 1024).toFixed(1)} KB</span>
                    </div>
                  </div>
                </div>
                <button onClick={() => remove(f.id)} className="p-2 rounded-lg text-plum-400 hover:text-rose-600 hover:bg-rose-50 transition-colors focus-ring shrink-0">
                  <Trash2 size={17} />
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </Card>

      <Disclaimer compact />
    </div>
  );
}
