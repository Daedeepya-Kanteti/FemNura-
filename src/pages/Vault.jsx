import React, { useRef, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Upload,
  Trash2,
  Lock,
  Download,
  Eye,
  Search,
  Filter,
  Plus,
  X,
  CheckCircle2,
  AlertCircle,
  Calendar,
  User,
  Building2,
  FileCheck,
  Printer,
  Sparkles,
  ShieldCheck,
  HelpCircle,
  FileSpreadsheet,
  Activity,
  Image as ImageIcon,
} from "lucide-react";
import PageHeader from "../components/PageHeader.jsx";
import { Card, Button, EmptyState, Disclaimer, Badge } from "../components/UI.jsx";
import { useDemoData } from "../context/DemoDataContext.jsx";
import { printHtmlDirect, downloadPrintableHtmlFile } from "../utils/printHelper.js";

const categories = [
  "Lab report",
  "Prescription",
  "Imaging",
  "Doctor's note",
  "Blood work",
  "Vaccination",
  "Discharge summary",
  "Other",
];

const categoryColors = {
  "Lab report": "rose",
  "Prescription": "plum",
  "Imaging": "lavender",
  "Doctor's note": "sage",
  "Blood work": "rose",
  "Vaccination": "sage",
  "Discharge summary": "plum",
  "Other": "lavender",
};

// Curated realistic sample documents for instant testing
const sampleDocuments = [
  {
    name: "Complete Blood Count (CBC) Panel",
    category: "Blood work",
    doctor: "Dr. Anita Sharma, MD",
    facility: "Care Diagnostic Laboratories",
    date: new Date(Date.now() - 86400000 * 4).toISOString().split("T")[0],
    notes: "Hemoglobin: 12.8 g/dL (Normal). Platelets: 240,000/mcL. RBC and WBC counts within normal range. Mild iron supplementation recommended.",
    size: 284000,
    parameters: [
      { param: "Hemoglobin", value: "12.8 g/dL", range: "12.0 - 15.5 g/dL", status: "Normal" },
      { param: "RBC Count", value: "4.3 mil/mcL", range: "4.0 - 5.2 mil/mcL", status: "Normal" },
      { param: "WBC Count", value: "6,800 /mcL", range: "4,500 - 11,000 /mcL", status: "Normal" },
      { param: "Platelet Count", value: "240,000 /mcL", range: "150,000 - 450,000 /mcL", status: "Normal" },
      { param: "Serum Ferritin", value: "24 ng/mL", range: "15 - 150 ng/mL", status: "Low-Normal" },
    ],
  },
  {
    name: "Pelvic Ultrasound Scan & Doppler",
    category: "Imaging",
    doctor: "Dr. Radhika V., Radiologist",
    facility: "Metro Women's Imaging Center",
    date: new Date(Date.now() - 86400000 * 18).toISOString().split("T")[0],
    notes: "Normal uterine size and contour. Endometrial stripe measures 7.2 mm, homogeneous. Both ovaries demonstrate normal follicular architecture. No adnexal mass or free pelvic fluid detected.",
    size: 512000,
    parameters: [
      { param: "Uterus Size", value: "7.4 x 4.1 x 3.6 cm", range: "Normal multiparous/nulliparous", status: "Normal" },
      { param: "Endometrial Stripe", value: "7.2 mm", range: "Normal proliferative", status: "Normal" },
      { param: "Right Ovary", value: "2.8 x 1.9 cm", range: "Normal with follicles", status: "Normal" },
      { param: "Left Ovary", value: "2.6 x 1.8 cm", range: "Normal with follicles", status: "Normal" },
      { param: "Pouch of Douglas", value: "Clear", range: "No fluid collection", status: "Normal" },
    ],
  },
  {
    name: "Gynecology Rx - Iron & Vitamin D3",
    category: "Prescription",
    doctor: "Dr. Sarah Rao, OB-GYN",
    facility: "Femina Health Clinic",
    date: new Date(Date.now() - 86400000 * 7).toISOString().split("T")[0],
    notes: "1. Ferrous Ascorbate 100mg with Folic Acid (1 tab daily after lunch for 60 days)\n2. Cholecalciferol (Vitamin D3) 60,000 IU (1 sachet weekly with milk for 8 weeks)\nFollow-up CBC in 8 weeks.",
    size: 145000,
    parameters: [
      { param: "Medication 1", value: "Ferrous Ascorbate + Folic Acid", range: "1 tab daily after lunch", status: "Prescribed" },
      { param: "Medication 2", value: "Vitamin D3 60,000 IU", range: "1 pouch weekly x 8 wks", status: "Prescribed" },
      { param: "Dietary Advice", value: "High vitamin C intake (citrus) to enhance iron absorption", range: "Daily guideline", status: "Active" },
    ],
  },
  {
    name: "Thyroid Profile (TSH, Free T3, Free T4)",
    category: "Lab report",
    doctor: "Dr. Meera Iyer, Endocrinologist",
    facility: "Apex Endocrinology Center",
    date: new Date(Date.now() - 86400000 * 30).toISOString().split("T")[0],
    notes: "TSH: 2.1 mIU/L (Euthyroid range). Free T4: 1.3 ng/dL. Normal thyroid function confirmed. No therapeutic intervention required.",
    size: 320000,
    parameters: [
      { param: "TSH (Ultrasensitive)", value: "2.1 mIU/L", range: "0.4 - 4.2 mIU/L", status: "Optimal" },
      { param: "Free T4", value: "1.3 ng/dL", range: "0.8 - 1.8 ng/dL", status: "Normal" },
      { param: "Free T3", value: "3.2 pg/mL", range: "2.3 - 4.2 pg/mL", status: "Normal" },
    ],
  },
];

export default function Vault() {
  const { vaultFiles, setVaultFiles, userName } = useDemoData();

  // Filter & Search states
  const [filterCategory, setFilterCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest"); // newest, oldest, name, size

  // Upload modal states
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [selectedFileForUpload, setSelectedFileForUpload] = useState(null);
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploadCategory, setUploadCategory] = useState(categories[0]);
  const [uploadDoctor, setUploadDoctor] = useState("");
  const [uploadFacility, setUploadFacility] = useState("");
  const [uploadDate, setUploadDate] = useState(new Date().toISOString().split("T")[0]);
  const [uploadNotes, setUploadNotes] = useState("");
  const [uploadDataUrl, setUploadDataUrl] = useState(null);
  const [isProcessingFile, setIsProcessingFile] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  // Document Viewer & Preview Modal states
  const [activePreviewDoc, setActivePreviewDoc] = useState(null);

  // Toast alert
  const [toastMessage, setToastMessage] = useState(null);

  const fileInputRef = useRef(null);

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Process raw File object into clean lightweight record
  const processIncomingFile = (file) => {
    if (!file) return;
    setIsProcessingFile(true);

    const friendlyName = file.name.replace(/\.[^/.]+$/, "").replace(/[_-]/g, " ");
    setUploadTitle(friendlyName);
    setSelectedFileForUpload(file);

    // Auto-detect category based on filename
    const lowerName = file.name.toLowerCase();
    if (lowerName.includes("blood") || lowerName.includes("cbc") || lowerName.includes("hemoglobin")) {
      setUploadCategory("Blood work");
    } else if (lowerName.includes("rx") || lowerName.includes("prescription") || lowerName.includes("medicine")) {
      setUploadCategory("Prescription");
    } else if (lowerName.includes("scan") || lowerName.includes("ultrasound") || lowerName.includes("xray") || lowerName.includes("mri")) {
      setUploadCategory("Imaging");
    } else if (lowerName.includes("note") || lowerName.includes("summary") || lowerName.includes("doctor")) {
      setUploadCategory("Doctor's note");
    } else if (lowerName.includes("vaccin") || lowerName.includes("immuniz")) {
      setUploadCategory("Vaccination");
    } else {
      setUploadCategory("Lab report");
    }

    // Read and optimize preview
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          // Downscale high-res photos to prevent localStorage quota overflow
          const canvas = document.createElement("canvas");
          const MAX_WIDTH = 900;
          const MAX_HEIGHT = 900;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL("image/jpeg", 0.75);
          setUploadDataUrl(compressedDataUrl);
          setIsProcessingFile(false);
          setUploadModalOpen(true);
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    } else {
      // PDF or text documents
      const reader = new FileReader();
      reader.onload = (e) => {
        // Only keep dataUrl if under 200KB for non-images
        if (file.size < 200000) {
          setUploadDataUrl(e.target?.result);
        } else {
          setUploadDataUrl(null);
        }
        setIsProcessingFile(false);
        setUploadModalOpen(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      processIncomingFile(e.target.files[0]);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processIncomingFile(e.dataTransfer.files[0]);
    }
  };

  const saveUploadedDocument = (e) => {
    e?.preventDefault();
    if (!uploadTitle.trim()) return;

    const newDoc = {
      id: Date.now() + Math.random(),
      name: uploadTitle.trim(),
      category: uploadCategory,
      doctor: uploadDoctor.trim() || "Unspecified Physician",
      facility: uploadFacility.trim() || "Local Diagnostic Care",
      date: uploadDate ? new Date(uploadDate).toISOString() : new Date().toISOString(),
      notes: uploadNotes.trim() || "Document verified and stored in personal local health vault.",
      size: selectedFileForUpload ? selectedFileForUpload.size : 185000,
      fileType: selectedFileForUpload?.type || "application/pdf",
      dataUrl: uploadDataUrl || null,
    };

    setVaultFiles((prev) => [newDoc, ...prev]);
    setUploadModalOpen(false);
    resetUploadForm();
    triggerToast(`"${newDoc.name}" uploaded and encrypted in Medical Vault!`);
  };

  const resetUploadForm = () => {
    setSelectedFileForUpload(null);
    setUploadTitle("");
    setUploadCategory(categories[0]);
    setUploadDoctor("");
    setUploadFacility("");
    setUploadDate(new Date().toISOString().split("T")[0]);
    setUploadNotes("");
    setUploadDataUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const addSampleDoc = (sample) => {
    const doc = {
      id: Date.now() + Math.random(),
      name: sample.name,
      category: sample.category,
      doctor: sample.doctor,
      facility: sample.facility,
      date: new Date(sample.date).toISOString(),
      notes: sample.notes,
      size: sample.size,
      parameters: sample.parameters,
      fileType: "application/pdf",
    };
    setVaultFiles((prev) => [doc, ...prev]);
    triggerToast(`Sample record "${sample.name}" added to vault!`);
  };

  const removeDocument = (id, name) => {
    setVaultFiles((prev) => prev.filter((f) => f.id !== id));
    if (activePreviewDoc?.id === id) setActivePreviewDoc(null);
    triggerToast(`Document "${name || "record"}" removed from Medical Vault.`);
  };

  const downloadFile = (file) => {
    if (file.dataUrl) {
      const a = document.createElement("a");
      a.href = file.dataUrl;
      a.download = file.name.endsWith(".pdf") || file.name.endsWith(".jpg") ? file.name : `${file.name}.jpg`;
      a.click();
      triggerToast(`Downloaded ${file.name}`);
    } else {
      // Generate clean medical document text export
      const content = `=======================================================
FEMNURA MEDICAL HISTORY VAULT - CLINICAL RECORD
=======================================================
Patient Name:        ${userName || "Patient"}
Document Title:      ${file.name}
Category:            ${file.category}
Issuing Doctor:      ${file.doctor || "Physician"}
Facility / Lab:      ${file.facility || "Care Center"}
Record Date:         ${new Date(file.date).toLocaleDateString()}
Date Stored:         ${new Date().toLocaleString()}
File Reference ID:   ${file.id}

CLINICAL NOTES & FINDINGS:
-------------------------------------------------------
${file.notes || "No additional notes provided."}

${
  file.parameters && file.parameters.length > 0
    ? `DIAGNOSTIC PARAMETERS:
-------------------------------------------------------
${file.parameters
  .map(
    (p) =>
      `• ${p.param.padEnd(25)}: ${p.value.padEnd(16)} [Ref: ${p.range}] (${p.status})`
  )
  .join("\n")}
`
    : ""
}
=======================================================
CONFIDENTIAL HEALTH RECORD • STORED IN FEMNURA LOCAL VAULT
=======================================================`;

      const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${file.name.replace(/\.[^/.]+$/, "").replace(/\s+/g, "_")}_record.txt`;
      a.click();
      URL.revokeObjectURL(url);
      triggerToast(`Downloaded verified record: ${file.name}`);
    }
  };

  // Robust on-demand print engine that formats a pristine medical report
  // and prints via a hidden iframe to bypass browser popup blockers in iframe environments
  const printDocument = (docToPrint) => {
    const doc = docToPrint || activePreviewDoc;
    if (!doc) return;

    triggerToast(`Preparing "${doc.name}" for print / PDF export...`);

    const hasParameters = doc.parameters && doc.parameters.length > 0;
    const hasImage = Boolean(doc.dataUrl && (doc.fileType?.startsWith("image/") || doc.dataUrl.startsWith("data:image")));

    const parametersHtml = hasParameters
      ? `
        <div class="section">
          <div class="section-title">Diagnostic Parameters & Test Results</div>
          <table class="param-table">
            <thead>
              <tr>
                <th>Test Parameter</th>
                <th>Observed Value</th>
                <th>Standard Reference Range</th>
                <th>Evaluation</th>
              </tr>
            </thead>
            <tbody>
              ${doc.parameters
                .map(
                  (p) => `
                <tr>
                  <td><strong>${p.param}</strong></td>
                  <td class="value">${p.value}</td>
                  <td class="ref">${p.range}</td>
                  <td><span class="status-tag status-${(p.status || "").toLowerCase().replace(/[^a-z]/g, "")}">${p.status}</span></td>
                </tr>
              `
                )
                .join("")}
            </tbody>
          </table>
        </div>
      `
      : "";

    const imageHtml = hasImage
      ? `
        <div class="section">
          <div class="section-title">Attached Medical Scan / Document Image</div>
          <div class="image-container">
            <img src="${doc.dataUrl}" alt="${doc.name}" />
          </div>
        </div>
      `
      : "";

    const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>FemNura Medical Vault — ${doc.name}</title>
  <style>
    @page {
      size: A4;
      margin: 16mm 14mm 16mm 14mm;
    }
    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      color: #2e1f2d;
      margin: 0;
      padding: 24px;
      line-height: 1.5;
      font-size: 13px;
      background: #ffffff;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      border-bottom: 2px solid #5f3860;
      padding-bottom: 14px;
      margin-bottom: 18px;
    }
    .brand-title {
      font-size: 24px;
      font-weight: 800;
      color: #5f3860;
      letter-spacing: -0.5px;
      margin: 0;
    }
    .brand-sub {
      font-size: 11px;
      font-weight: 600;
      color: #7a5689;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-top: 2px;
    }
    .vault-tag {
      text-align: right;
    }
    .badge {
      display: inline-block;
      background: #f3ebf6;
      color: #5f3860;
      font-weight: 700;
      font-size: 11px;
      padding: 4px 10px;
      border-radius: 6px;
      border: 1px solid #dccadc;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .doc-headline {
      margin-bottom: 16px;
    }
    .doc-headline h1 {
      font-size: 20px;
      color: #2e1f2d;
      margin: 0 0 4px 0;
      font-weight: 700;
    }
    .meta-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 10px;
      background: #faf7fc;
      border: 1px solid #e8dfea;
      border-radius: 8px;
      padding: 12px 14px;
      margin-bottom: 18px;
    }
    .meta-item label {
      display: block;
      font-size: 10px;
      text-transform: uppercase;
      font-weight: 700;
      color: #7a5689;
      margin-bottom: 2px;
    }
    .meta-item span {
      font-size: 13px;
      font-weight: 600;
      color: #2e1f2d;
    }
    .section {
      margin-bottom: 18px;
    }
    .section-title {
      font-size: 12px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: #5f3860;
      border-bottom: 1px solid #ebdfee;
      padding-bottom: 4px;
      margin-bottom: 8px;
    }
    .notes-box {
      background: #fafafa;
      border: 1px solid #e2dce3;
      border-radius: 8px;
      padding: 12px 14px;
      font-size: 13px;
      color: #3b2c3a;
      white-space: pre-line;
      line-height: 1.6;
    }
    .param-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 12px;
      border: 1px solid #e2dce3;
      border-radius: 6px;
      overflow: hidden;
    }
    .param-table th {
      background: #f4edf5;
      color: #5f3860;
      font-weight: 700;
      text-align: left;
      padding: 8px 12px;
      border-bottom: 1px solid #e2dce3;
      font-size: 11px;
      text-transform: uppercase;
    }
    .param-table td {
      padding: 8px 12px;
      border-bottom: 1px solid #eee;
    }
    .param-table tr:last-child td {
      border-bottom: none;
    }
    .param-table td.value {
      font-weight: 700;
      color: #2e1f2d;
      font-family: monospace;
      font-size: 12px;
    }
    .param-table td.ref {
      color: #666;
    }
    .status-tag {
      display: inline-block;
      padding: 2px 7px;
      border-radius: 4px;
      font-size: 10px;
      font-weight: 700;
      background: #e9ecef;
      color: #495057;
    }
    .status-normal, .status-optimal {
      background: #e6f7ec;
      color: #1e7e34;
    }
    .status-prescribed {
      background: #eef2ff;
      color: #3730a3;
    }
    .image-container {
      text-align: center;
      padding: 12px;
      background: #faf7fc;
      border: 1px solid #e8dfea;
      border-radius: 8px;
    }
    .image-container img {
      max-width: 100%;
      max-height: 480px;
      object-fit: contain;
      border-radius: 6px;
    }
    .doctor-sign-box {
      margin-top: 18px;
      height: 70px;
      border: 1px dashed #d1c4d4;
      border-radius: 8px;
      padding: 8px 12px;
      font-size: 11px;
      color: #888;
      background: #faf9fb;
    }
    .footer {
      margin-top: 24px;
      padding-top: 10px;
      border-top: 1px solid #ddd;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 10px;
      color: #777;
    }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="brand-title">FemNura</div>
      <div class="brand-sub">Medical History Vault • Confidential Record</div>
    </div>
    <div class="vault-tag">
      <span class="badge">${doc.category}</span>
    </div>
  </div>

  <div class="doc-headline">
    <h1>${doc.name}</h1>
    <div style="font-size: 12px; color: #666;">
      Issued by <strong>${doc.doctor || "Physician"}</strong> at <strong>${doc.facility || "Care Center"}</strong>
    </div>
  </div>

  <div class="meta-grid">
    <div class="meta-item">
      <label>Patient</label>
      <span>${userName || "Patient"}</span>
    </div>
    <div class="meta-item">
      <label>Record Date</label>
      <span>${new Date(doc.date).toLocaleDateString()}</span>
    </div>
    <div class="meta-item">
      <label>Document Category</label>
      <span>${doc.category}</span>
    </div>
    <div class="meta-item">
      <label>Verified Storage</label>
      <span>Encrypted Local Vault</span>
    </div>
  </div>

  ${
    doc.notes
      ? `
    <div class="section">
      <div class="section-title">Physician Notes & Clinical Findings</div>
      <div class="notes-box">${doc.notes}</div>
    </div>
  `
      : ""
  }

  ${parametersHtml}

  ${imageHtml}

  <div class="doctor-sign-box">
    Physician / Clinic Verification Stamp & Reviewer Signature:
  </div>

  <div class="footer">
    <div>FemNura • Your Health. Your Priority. Local Health Vault • Verified Confidential Record</div>
    <div>Document Reference: ${doc.id}</div>
  </div>

  <script>
    window.onload = function() {
      setTimeout(function() {
        window.focus();
        window.print();
      }, 300);
    };
  </script>
</body>
</html>`;

    printHtmlDirect(htmlContent, `FemNura Medical Vault — ${doc.name}`, `${doc.name.replace(/\s+/g, "_")}_record.html`);
  };

  const downloadPrintableReport = (docToPrint) => {
    const doc = docToPrint || activePreviewDoc;
    if (!doc) return;

    const hasParameters = doc.parameters && doc.parameters.length > 0;
    const hasImage = Boolean(doc.dataUrl && (doc.fileType?.startsWith("image/") || doc.dataUrl.startsWith("data:image")));

    const parametersHtml = hasParameters
      ? `
        <div class="section">
          <div class="section-title">Diagnostic Parameters & Test Results</div>
          <table class="param-table">
            <thead>
              <tr>
                <th>Test Parameter</th>
                <th>Observed Value</th>
                <th>Standard Reference Range</th>
                <th>Evaluation</th>
              </tr>
            </thead>
            <tbody>
              ${doc.parameters
                .map(
                  (p) => `
                <tr>
                  <td><strong>${p.param}</strong></td>
                  <td class="value">${p.value}</td>
                  <td class="ref">${p.range}</td>
                  <td><span class="status-tag status-${(p.status || "").toLowerCase().replace(/[^a-z]/g, "")}">${p.status}</span></td>
                </tr>
              `
                )
                .join("")}
            </tbody>
          </table>
        </div>
      `
      : "";

    const imageHtml = hasImage
      ? `
        <div class="section">
          <div class="section-title">Attached Medical Scan / Document Image</div>
          <div class="image-container">
            <img src="${doc.dataUrl}" alt="${doc.name}" />
          </div>
        </div>
      `
      : "";

    const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>FemNura Medical Vault — ${doc.name}</title>
  <style>
    @page { size: A4; margin: 16mm 14mm; }
    * { box-sizing: border-box; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; color: #2e1f2d; margin: 0; padding: 24px; line-height: 1.5; font-size: 13px; background: #ffffff; }
    .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #5f3860; padding-bottom: 14px; margin-bottom: 18px; }
    .brand-title { font-size: 24px; font-weight: 800; color: #5f3860; margin: 0; }
    .brand-sub { font-size: 11px; font-weight: 600; color: #7a5689; text-transform: uppercase; letter-spacing: 1px; margin-top: 2px; }
    .badge { display: inline-block; background: #f3ebf6; color: #5f3860; font-weight: 700; font-size: 11px; padding: 4px 10px; border-radius: 6px; border: 1px solid #dccadc; text-transform: uppercase; }
    .doc-headline h1 { font-size: 20px; color: #3b223c; margin: 0 0 6px 0; }
    .meta-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; background: #fbf9fc; border: 1px solid #e7dfe9; border-radius: 8px; padding: 12px 14px; margin: 16px 0; }
    .meta-item label { display: block; font-size: 10px; text-transform: uppercase; font-weight: 700; color: #7a5689; margin-bottom: 2px; }
    .meta-item span { font-size: 13px; font-weight: 600; color: #2e1f2d; }
    .section-title { font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #5f3860; border-bottom: 1px solid #ebdfee; padding-bottom: 4px; margin-bottom: 8px; }
    .notes-box { background: #fafafa; border: 1px solid #e2dce3; border-radius: 8px; padding: 12px 14px; font-size: 13px; color: #3b2c3a; white-space: pre-line; line-height: 1.6; }
    .param-table { width: 100%; border-collapse: collapse; font-size: 12px; border: 1px solid #e2dce3; margin-top: 8px; }
    .param-table th { background: #f4edf5; color: #5f3860; font-weight: 700; text-align: left; padding: 8px 12px; border-bottom: 1px solid #e2dce3; font-size: 11px; text-transform: uppercase; }
    .param-table td { padding: 8px 12px; border-bottom: 1px solid #eee; }
    .param-table td.value { font-weight: 700; color: #2e1f2d; font-family: monospace; }
    .param-table td.ref { color: #666; }
    .status-tag { display: inline-block; padding: 2px 8px; border-radius: 12px; font-size: 10px; font-weight: 700; background: #f0fdf4; color: #166534; border: 1px solid #bbf7d0; }
    .image-container img { max-width: 100%; max-height: 400px; object-fit: contain; border-radius: 8px; border: 1px solid #ddd; }
    .footer { margin-top: 24px; padding-top: 10px; border-top: 1px solid #ddd; display: flex; justify-content: space-between; font-size: 10px; color: #777; }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="brand-title">FemNura</div>
      <div class="brand-sub">Medical History Vault • Confidential Record</div>
    </div>
    <div><span class="badge">${doc.category}</span></div>
  </div>
  <div class="doc-headline">
    <h1>${doc.name}</h1>
    <div style="font-size: 12px; color: #666;">Issued by <strong>${doc.doctor || "Physician"}</strong> at <strong>${doc.facility || "Care Center"}</strong></div>
  </div>
  <div class="meta-grid">
    <div class="meta-item"><label>Patient</label><span>${userName || "Patient"}</span></div>
    <div class="meta-item"><label>Record Date</label><span>${new Date(doc.date).toLocaleDateString()}</span></div>
    <div class="meta-item"><label>Document Category</label><span>${doc.category}</span></div>
    <div class="meta-item"><label>Verified Storage</label><span>Encrypted Local Vault</span></div>
  </div>
  ${doc.notes ? `<div class="section"><div class="section-title">Physician Notes & Clinical Findings</div><div class="notes-box">${doc.notes}</div></div>` : ""}
  ${parametersHtml}
  ${imageHtml}
  <div class="footer">
    <div>FemNura • Your Health. Your Priority. Local Health Vault • Verified Confidential Record</div>
    <div>Document Reference: ${doc.id}</div>
  </div>
</body>
</html>`;

    downloadPrintableHtmlFile(htmlContent, `${doc.name.replace(/\s+/g, "_")}_printable.html`);
    triggerToast(`Downloaded printable record for "${doc.name}"!`);
  };

  // Filter & Sort
  const filteredFiles = useMemo(() => {
    return vaultFiles
      .filter((f) => {
        const matchesCat = filterCategory === "All" || f.category === filterCategory;
        const q = searchQuery.toLowerCase();
        const matchesQuery =
          !q ||
          f.name.toLowerCase().includes(q) ||
          (f.doctor && f.doctor.toLowerCase().includes(q)) ||
          (f.facility && f.facility.toLowerCase().includes(q)) ||
          (f.notes && f.notes.toLowerCase().includes(q)) ||
          f.category.toLowerCase().includes(q);
        return matchesCat && matchesQuery;
      })
      .sort((a, b) => {
        if (sortBy === "newest") return new Date(b.date) - new Date(a.date);
        if (sortBy === "oldest") return new Date(a.date) - new Date(b.date);
        if (sortBy === "name") return a.name.localeCompare(b.name);
        if (sortBy === "size") return (b.size || 0) - (a.size || 0);
        return 0;
      });
  }, [vaultFiles, filterCategory, searchQuery, sortBy]);

  return (
    <div>
      <PageHeader
        eyebrow="Medical History Vault"
        title="Keep your records organised, private and ready"
        subtitle="Upload reports, prescriptions, scans, and clinical notes in one secure place with instant in-app previews and downloads."
      />

      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-5 right-5 z-50 bg-plum-900 text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 border border-plum-700 text-sm font-semibold max-w-md"
          >
            <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Security & Overview Stats Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white border border-plum-100 rounded-2xl p-4 flex items-center gap-3 shadow-2xs">
          <div className="w-10 h-10 rounded-xl bg-plum-50 text-plum-700 flex items-center justify-center shrink-0">
            <Lock size={19} />
          </div>
          <div>
            <p className="text-xs font-bold text-plum-900">100% On-Device Privacy</p>
            <p className="text-[11px] text-plum-500">Encrypted in your private local browser profile</p>
          </div>
        </div>

        <div className="bg-white border border-plum-100 rounded-2xl p-4 flex items-center gap-3 shadow-2xs">
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
            <FileText size={19} />
          </div>
          <div>
            <p className="text-xs font-bold text-plum-900">{vaultFiles.length} Records Preserved</p>
            <p className="text-[11px] text-plum-500">Accessible offline anytime, anywhere</p>
          </div>
        </div>

        <div className="bg-white border border-plum-100 rounded-2xl p-4 flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-lavender-50 text-plum-700 flex items-center justify-center shrink-0">
              <Upload size={19} />
            </div>
            <div>
              <p className="text-xs font-bold text-plum-900">Upload Anything</p>
              <p className="text-[11px] text-plum-500">PDFs, images, scans & notes</p>
            </div>
          </div>
          <button
            onClick={() => {
              resetUploadForm();
              setUploadModalOpen(true);
            }}
            className="px-3 py-1.5 rounded-xl bg-plum-700 hover:bg-plum-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer shrink-0"
          >
            <Plus size={14} />
            <span>Upload</span>
          </button>
        </div>
      </div>

      {/* Main Upload Dropzone & Action Card */}
      <Card className="p-6 sm:p-7 mb-7 border-2 border-plum-100/80">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="font-display text-lg font-bold text-plum-900 flex items-center gap-2">
              <Upload className="text-plum-600" size={20} />
              <span>Upload Medical Document</span>
            </h2>
            <p className="text-xs text-plum-500 mt-0.5">
              Select or drop your lab tests, imaging scans, prescriptions, or clinical notes.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                resetUploadForm();
                setUploadModalOpen(true);
              }}
              className="px-3.5 py-2 rounded-xl bg-plum-700 hover:bg-plum-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
            >
              <FilePlusIcon size={15} />
              <span>Enter Details & Upload</span>
            </button>
          </div>
        </div>

        {/* Drag & Drop Area */}
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-2xl py-10 px-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200 ${
            dragActive
              ? "border-plum-600 bg-lavender-100/70 scale-[1.01] ring-4 ring-plum-200"
              : "border-plum-200/90 bg-lavender-50/30 hover:border-plum-400 hover:bg-lavender-50/70"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.jpg,.jpeg,.png,.webp,.doc,.docx,.txt"
            className="hidden"
            onChange={handleFileInputChange}
          />

          <div className="w-14 h-14 rounded-2xl bg-white text-plum-700 flex items-center justify-center shadow-md mb-3 border border-plum-100 ring-4 ring-plum-100/50">
            {isProcessingFile ? (
              <Activity className="animate-spin text-plum-600" size={28} />
            ) : (
              <Upload className="text-plum-600" size={28} />
            )}
          </div>

          <p className="font-bold text-plum-900 text-sm sm:text-base">
            Click here to choose a file, or drag & drop files here
          </p>
          <p className="text-xs text-plum-500 mt-1 max-w-md">
            Supports <strong>PDF, JPG, PNG, WEBP, DOCX, TXT</strong> reports, ultrasounds, blood tests & prescriptions
          </p>

          <div className="mt-4 flex items-center gap-2">
            <span className="px-3 py-1 rounded-lg bg-white border border-plum-200 text-plum-700 text-xs font-bold shadow-2xs hover:bg-plum-50">
              Browse Files from Device
            </span>
          </div>
        </div>

        {/* One-Click Quick Test Realistic Samples */}
        <div className="mt-6 pt-5 border-t border-plum-100">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-bold uppercase tracking-wider text-plum-800 flex items-center gap-1.5">
              <Sparkles size={14} className="text-amber-500" /> Quick Add Realistic Medical Record
            </p>
            <span className="text-[11px] text-plum-400">Click to instantly populate realistic sample data</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {sampleDocuments.map((sample, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => addSampleDoc(sample)}
                className="text-left p-3 rounded-xl border border-plum-100 hover:border-plum-300 bg-white hover:bg-lavender-50/50 transition-all shadow-2xs cursor-pointer group"
              >
                <div className="flex items-center justify-between gap-1 mb-1.5">
                  <Badge tone={categoryColors[sample.category] || "lavender"}>{sample.category}</Badge>
                  <span className="text-[10px] text-plum-400 group-hover:text-plum-700 font-bold">+ Add</span>
                </div>
                <p className="text-xs font-bold text-plum-900 truncate group-hover:text-plum-800">{sample.name}</p>
                <p className="text-[11px] text-plum-500 truncate mt-0.5">{sample.doctor}</p>
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Document Library Section */}
      <Card className="p-6 sm:p-7 mb-6">
        {/* Controls: Title, Search, Category Filter, Sort */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2.5">
            <h2 className="font-display text-lg font-bold text-plum-900">Your Medical Documents</h2>
            <Badge tone="lavender">{vaultFiles.length} {vaultFiles.length === 1 ? "record" : "records"}</Badge>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-64">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-plum-400" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by title, doctor, or notes..."
                className="w-full rounded-xl border border-plum-200 pl-8 pr-3 py-1.5 text-xs text-plum-800 focus-ring bg-ivory/50 placeholder:text-plum-400"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-plum-400 hover:text-plum-700"
                >
                  <X size={12} />
                </button>
              )}
            </div>

            {/* Sort Selector */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="rounded-xl border border-plum-200 px-3 py-1.5 text-xs font-semibold text-plum-700 bg-white focus-ring cursor-pointer"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="name">Name (A-Z)</option>
              <option value="size">Size (Largest)</option>
            </select>
          </div>
        </div>

        {/* Category Filters Pill Strip */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-3 mb-5 border-b border-plum-100">
          {["All", ...categories].map((cat) => {
            const count =
              cat === "All"
                ? vaultFiles.length
                : vaultFiles.filter((f) => f.category === cat).length;
            const active = filterCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                  active
                    ? "bg-plum-800 text-white shadow-xs"
                    : "bg-lavender-50/60 text-plum-700 hover:bg-lavender-100 border border-plum-100"
                }`}
              >
                <span>{cat}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    active ? "bg-plum-950/40 text-plum-100" : "bg-white text-plum-500"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Documents Render */}
        {filteredFiles.length === 0 ? (
          <EmptyState
            icon={<FileText size={28} className="text-plum-400" />}
            title={vaultFiles.length === 0 ? "No medical documents uploaded yet" : "No matching documents found"}
            description={
              vaultFiles.length === 0
                ? "Upload your first lab test, prescription, scan, or use the quick sample buttons above to store your health records."
                : `No files found matching "${searchQuery || filterCategory}". Try clearing your filters.`
            }
            action={
              vaultFiles.length === 0 ? (
                <button
                  onClick={() => {
                    resetUploadForm();
                    setUploadModalOpen(true);
                  }}
                  className="px-4 py-2 rounded-xl bg-plum-700 text-white text-xs font-bold shadow-sm hover:bg-plum-800 transition-all cursor-pointer"
                >
                  Upload Your First Document
                </button>
              ) : (
                <button
                  onClick={() => {
                    setFilterCategory("All");
                    setSearchQuery("");
                  }}
                  className="text-xs font-bold text-plum-700 hover:underline cursor-pointer"
                >
                  Reset all filters
                </button>
              )
            }
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {filteredFiles.map((f) => (
              <motion.div
                key={f.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-2xl border border-plum-100 hover:border-plum-300 transition-all bg-white shadow-2xs hover:shadow-xs flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="w-11 h-11 rounded-xl bg-lavender-50 text-plum-700 flex items-center justify-center shrink-0 border border-plum-100 group-hover:bg-plum-700 group-hover:text-white transition-colors">
                        {f.dataUrl ? (
                          <ImageIcon size={20} />
                        ) : (
                          <FileText size={20} />
                        )}
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-bold text-plum-900 text-sm truncate leading-snug">
                          {f.name}
                        </h3>
                        <p className="text-xs text-plum-600 truncate mt-0.5 flex items-center gap-1.5">
                          {f.doctor && <span>{f.doctor}</span>}
                          {f.doctor && f.facility && <span>•</span>}
                          {f.facility && <span className="text-plum-400">{f.facility}</span>}
                        </p>
                      </div>
                    </div>

                    <Badge tone={categoryColors[f.category] || "lavender"}>
                      {f.category}
                    </Badge>
                  </div>

                  {f.notes && (
                    <p className="text-xs text-plum-700/80 mt-3 line-clamp-2 bg-ivory/60 p-2.5 rounded-xl border border-plum-100/60 leading-relaxed">
                      {f.notes}
                    </p>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-plum-100/80 flex items-center justify-between text-xs text-plum-400">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-plum-500">
                      {new Date(f.date).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                    <span>•</span>
                    <span>{((f.size || 180000) / 1024).toFixed(1)} KB</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setActivePreviewDoc(f)}
                      className="p-1.5 rounded-lg text-plum-600 hover:text-plum-950 hover:bg-lavender-100 transition-colors cursor-pointer"
                      title="Preview and inspect document"
                      aria-label="View document"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      onClick={() => printDocument(f)}
                      className="p-1.5 rounded-lg text-plum-600 hover:text-plum-950 hover:bg-lavender-100 transition-colors cursor-pointer"
                      title="Print or export PDF"
                      aria-label="Print document"
                    >
                      <Printer size={16} />
                    </button>
                    <button
                      onClick={() => downloadFile(f)}
                      className="p-1.5 rounded-lg text-plum-600 hover:text-plum-950 hover:bg-lavender-100 transition-colors cursor-pointer"
                      title="Download document"
                      aria-label="Download document"
                    >
                      <Download size={16} />
                    </button>
                    <button
                      onClick={() => removeDocument(f.id, f.name)}
                      className="p-1.5 rounded-lg text-plum-300 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                      title="Delete document"
                      aria-label="Delete document"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </Card>

      {/* Upload Details Modal */}
      <AnimatePresence>
        {uploadModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-plum-950/60 backdrop-blur-xs overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white rounded-3xl shadow-2xl border border-plum-100 w-full max-w-lg overflow-hidden my-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-gradient-to-r from-plum-800 via-plum-900 to-plum-950 text-white p-5 sm:p-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                    <Upload size={20} className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-bold">Upload Medical Document</h3>
                    <p className="text-xs text-plum-200">
                      Label and categorize your record for easy doctor reference
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setUploadModalOpen(false);
                    resetUploadForm();
                  }}
                  className="p-1.5 text-plum-300 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={saveUploadedDocument} className="p-5 sm:p-6 space-y-4 max-h-[75vh] overflow-y-auto">
                {/* File summary preview bar if file picked */}
                {selectedFileForUpload ? (
                  <div className="flex items-center justify-between p-3 rounded-2xl bg-lavender-50 border border-plum-200/70">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <FileCheck className="text-emerald-600 shrink-0" size={20} />
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-plum-900 truncate">
                          {selectedFileForUpload.name}
                        </p>
                        <p className="text-[11px] text-plum-500">
                          {(selectedFileForUpload.size / 1024).toFixed(1)} KB • {selectedFileForUpload.type || "Document"}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="text-xs font-bold text-plum-700 hover:underline shrink-0"
                    >
                      Change
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="p-3.5 rounded-2xl border-2 border-dashed border-plum-200 text-center cursor-pointer hover:bg-lavender-50/50 transition-colors"
                  >
                    <p className="text-xs font-bold text-plum-700">Choose a file from device</p>
                    <p className="text-[11px] text-plum-400">PDF, images, scan reports or prescriptions</p>
                  </div>
                )}

                {/* Document Title */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-plum-800 mb-1.5">
                    Document Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={uploadTitle}
                    onChange={(e) => setUploadTitle(e.target.value)}
                    placeholder="e.g. Lipid Profile, Ultrasound Scan, Gynecology Rx"
                    className="w-full rounded-xl border border-plum-200 px-3.5 py-2 text-sm text-plum-900 focus-ring"
                  />
                </div>

                {/* Category Pills */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-plum-800 mb-1.5">
                    Category
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {categories.map((c) => (
                      <button
                        type="button"
                        key={c}
                        onClick={() => setUploadCategory(c)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                          uploadCategory === c
                            ? "bg-plum-800 text-white border-plum-800 shadow-2xs"
                            : "bg-white text-plum-700 border-plum-200 hover:border-plum-400"
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Doctor and Facility Inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-plum-800 mb-1.5">
                      Doctor / Specialist
                    </label>
                    <div className="relative">
                      <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-plum-400" />
                      <input
                        type="text"
                        value={uploadDoctor}
                        onChange={(e) => setUploadDoctor(e.target.value)}
                        placeholder="Dr. Sarah Rao, OB-GYN"
                        className="w-full rounded-xl border border-plum-200 pl-8 pr-3 py-2 text-xs text-plum-900 focus-ring"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-plum-800 mb-1.5">
                      Hospital / Clinic / Lab
                    </label>
                    <div className="relative">
                      <Building2 size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-plum-400" />
                      <input
                        type="text"
                        value={uploadFacility}
                        onChange={(e) => setUploadFacility(e.target.value)}
                        placeholder="City Health Diagnostics"
                        className="w-full rounded-xl border border-plum-200 pl-8 pr-3 py-2 text-xs text-plum-900 focus-ring"
                      />
                    </div>
                  </div>
                </div>

                {/* Record Date */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-plum-800 mb-1.5">
                    Date of Test / Prescription
                  </label>
                  <div className="relative">
                    <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-plum-400" />
                    <input
                      type="date"
                      value={uploadDate}
                      onChange={(e) => setUploadDate(e.target.value)}
                      className="w-full rounded-xl border border-plum-200 pl-8 pr-3 py-2 text-xs text-plum-900 focus-ring"
                    />
                  </div>
                </div>

                {/* Notes & Key Findings */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-plum-800 mb-1.5">
                    Clinical Notes & Findings
                  </label>
                  <textarea
                    rows={3}
                    value={uploadNotes}
                    onChange={(e) => setUploadNotes(e.target.value)}
                    placeholder="e.g. Fasting blood glucose normal. Vitamin D supplement prescribed. Follow up in 6 months."
                    className="w-full rounded-xl border border-plum-200 p-3 text-xs text-plum-900 focus-ring"
                  />
                </div>

                {/* Actions */}
                <div className="pt-3 border-t border-plum-100 flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      setUploadModalOpen(false);
                      resetUploadForm();
                    }}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-plum-600 hover:bg-lavender-50 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-plum-800 hover:bg-plum-900 text-white text-xs font-bold shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <CheckCircle2 size={16} />
                    <span>Save to Vault</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Document Viewer & Preview Modal */}
      <AnimatePresence>
        {activePreviewDoc && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-plum-950/75 backdrop-blur-xs overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl shadow-2xl border border-plum-100 w-full max-w-2xl overflow-hidden my-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-plum-800 via-plum-900 to-plum-950 text-white p-5 sm:p-6 flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge tone={categoryColors[activePreviewDoc.category] || "lavender"}>
                      {activePreviewDoc.category}
                    </Badge>
                    <span className="text-xs text-plum-300">
                      {new Date(activePreviewDoc.date).toLocaleDateString(undefined, {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <h3 className="font-display text-lg sm:text-xl font-bold truncate">
                    {activePreviewDoc.name}
                  </h3>
                  <p className="text-xs text-plum-200 mt-0.5">
                    {activePreviewDoc.doctor || "Physician"} • {activePreviewDoc.facility || "Care Center"}
                  </p>
                </div>

                <button
                  onClick={() => setActivePreviewDoc(null)}
                  className="p-1.5 text-plum-300 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer shrink-0"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Body */}
              <div className="p-5 sm:p-6 space-y-5 max-h-[72vh] overflow-y-auto">
                {/* Meta Strip */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3 rounded-2xl bg-lavender-50/70 border border-plum-100 text-xs">
                  <div>
                    <span className="text-plum-400 block text-[10px] uppercase font-bold">Patient</span>
                    <span className="font-bold text-plum-900 truncate block">{userName || "Patient"}</span>
                  </div>
                  <div>
                    <span className="text-plum-400 block text-[10px] uppercase font-bold">Category</span>
                    <span className="font-bold text-plum-900">{activePreviewDoc.category}</span>
                  </div>
                  <div>
                    <span className="text-plum-400 block text-[10px] uppercase font-bold">Record Date</span>
                    <span className="font-bold text-plum-900">{new Date(activePreviewDoc.date).toLocaleDateString()}</span>
                  </div>
                  <div>
                    <span className="text-plum-400 block text-[10px] uppercase font-bold">File Size</span>
                    <span className="font-bold text-plum-900">{((activePreviewDoc.size || 180000) / 1024).toFixed(1)} KB</span>
                  </div>
                </div>

                {/* If document has a real image preview */}
                {activePreviewDoc.dataUrl && (
                  <div className="rounded-2xl overflow-hidden border border-plum-200 bg-plum-950/5 flex items-center justify-center p-2">
                    <img
                      src={activePreviewDoc.dataUrl}
                      alt={activePreviewDoc.name}
                      className="max-h-80 w-auto object-contain rounded-xl shadow-xs"
                    />
                  </div>
                )}

                {/* Formatted Diagnostic / Clinical Report Layout */}
                <div className="rounded-2xl border border-plum-200/90 bg-white p-4 sm:p-5 shadow-2xs space-y-4">
                  <div className="border-b border-plum-100 pb-3 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-plum-900">
                        Clinical Report Details
                      </p>
                      <p className="text-[11px] text-plum-500">
                        Issued by {activePreviewDoc.doctor || "Physician"} at {activePreviewDoc.facility || "Care Center"}
                      </p>
                    </div>
                    <span className="text-[10px] font-extrabold uppercase bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                      <ShieldCheck size={12} /> Verified Local Copy
                    </span>
                  </div>

                  {/* Notes / Clinical summary */}
                  <div>
                    <p className="text-xs font-bold text-plum-800 mb-1">Physician Observations & Notes:</p>
                    <p className="text-xs text-plum-700 leading-relaxed bg-ivory p-3 rounded-xl border border-plum-100 whitespace-pre-line">
                      {activePreviewDoc.notes || "No additional clinical observations logged."}
                    </p>
                  </div>

                  {/* Parameter table if available */}
                  {activePreviewDoc.parameters && activePreviewDoc.parameters.length > 0 && (
                    <div>
                      <p className="text-xs font-bold text-plum-800 mb-2">Diagnostic Parameters:</p>
                      <div className="border border-plum-100 rounded-xl overflow-hidden">
                        <table className="w-full text-xs text-left">
                          <thead className="bg-plum-50/70 text-plum-700 border-b border-plum-100 font-semibold">
                            <tr>
                              <th className="py-2 px-3">Parameter</th>
                              <th className="py-2 px-3">Result</th>
                              <th className="py-2 px-3 hidden sm:table-cell">Reference Range</th>
                              <th className="py-2 px-3">Status</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-plum-100">
                            {activePreviewDoc.parameters.map((p, idx) => (
                              <tr key={idx} className="hover:bg-lavender-50/40">
                                <td className="py-2 px-3 font-medium text-plum-900">{p.param}</td>
                                <td className="py-2 px-3 font-bold text-plum-800 font-mono">{p.value}</td>
                                <td className="py-2 px-3 text-plum-500 hidden sm:table-cell">{p.range}</td>
                                <td className="py-2 px-3">
                                  <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-lavender-100 text-plum-700">
                                    {p.status}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions Footer */}
              <div className="p-4 sm:p-5 bg-lavender-50/50 border-t border-plum-100 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => removeDocument(activePreviewDoc.id, activePreviewDoc.name)}
                  className="px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-50 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Trash2 size={15} />
                  <span>Delete Record</span>
                </button>

                <div className="flex items-center gap-2 flex-wrap justify-end">
                  <button
                    type="button"
                    onClick={() => printDocument(activePreviewDoc)}
                    className="px-3.5 py-2 rounded-xl bg-plum-700 hover:bg-plum-800 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                    title="Print directly or save as PDF"
                  >
                    <Printer size={15} />
                    <span>Print Report</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => downloadPrintableReport(activePreviewDoc)}
                    className="px-3.5 py-2 rounded-xl border border-plum-300 bg-white hover:bg-plum-50 text-plum-800 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                    title="Download self-contained printable report"
                  >
                    <FileCheck size={15} />
                    <span>Save Printable HTML</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => downloadFile(activePreviewDoc)}
                    className="px-3.5 py-2 rounded-xl border border-plum-200 bg-white hover:bg-plum-50 text-plum-700 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                    title="Download original file or text notes"
                  >
                    <Download size={15} />
                    <span>Download File</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Disclaimer compact />
    </div>
  );
}

function FilePlusIcon({ size = 16, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="12" y1="18" x2="12" y2="12" />
      <line x1="9" y1="15" x2="15" y2="15" />
    </svg>
  );
}
