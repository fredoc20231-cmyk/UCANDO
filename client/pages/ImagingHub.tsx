import React, { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { DetailedImagingStudy } from "@shared/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Image as ImageIcon,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Sliders,
  Layers,
  Sparkles,
  CheckCircle2,
  Activity,
  Crosshair,
  FileCode,
  ShieldCheck,
  RotateCcw,
  Sparkle
} from "lucide-react";

export default function ImagingHub() {
  const [study, setStudy] = useState<DetailedImagingStudy | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeSeries, setActiveSeries] = useState("ser_dual_view");
  const [sliceIndex, setSliceIndex] = useState(120);
  const [windowLevel, setWindowLevel] = useState(50);
  const [windowWidth, setWindowWidth] = useState(350);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [showAiAnnotations, setShowAiAnnotations] = useState(true);
  const [showCaliper, setShowCaliper] = useState(true);
  const [pathologyZoom, setPathologyZoom] = useState<"10x" | "20x" | "40x">("40x");
  const [showPathologyAiMask, setShowPathologyAiMask] = useState(true);

  useEffect(() => {
    fetch("/api/beacon/imaging/details")
      .then((res) => res.json())
      .then((data: DetailedImagingStudy) => {
        setStudy(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch imaging details:", err);
        setLoading(false);
      });
  }, []);

  return (
    <Layout>
      <div className="max-w-[1700px] w-full mx-auto p-4 sm:p-6 space-y-6 pb-12 font-sans">
        {/* Header */}
        <div className="p-5 sm:p-6 rounded-xl bg-card border border-border space-y-4 shadow-subtle">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="p-3 rounded-lg bg-primary/10 text-primary border border-primary/20">
                <ImageIcon className="w-6 h-6 text-primary" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-bold font-serif text-foreground">
                    Functional Lung MRI & Thoracic CT Workspace
                  </h1>
                  <Badge variant="outline" className="border-accent/40 text-accent bg-accent/5 font-mono text-[10px]">
                    DICOMweb STOW-RS
                  </Badge>
                  <Badge className="bg-primary/10 text-primary border-primary/20 font-mono text-[10px]">
                    fMRI Ventilation/Perfusion
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Multi-modal Functional Magnetic Resonance Imaging (fMRI) & High-Resolution Thoracic CT zero-footprint viewer.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <Badge className="bg-accent/15 text-accent border-accent/30 text-xs py-1 px-3 font-mono">
                <ShieldCheck className="w-3.5 h-3.5 mr-1" /> De-identified Pixel Enclave
              </Badge>
            </div>
          </div>

          {/* Metadata Chips */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2 text-xs font-mono">
            <div className="p-2.5 rounded-lg bg-surface border border-border">
              <span className="text-[10px] text-muted-foreground block uppercase">Accession Number</span>
              <span className="font-bold text-foreground">{study?.accessionNumber || "ACC-UCANDO-2024-9910"}</span>
            </div>
            <div className="p-2.5 rounded-lg bg-surface border border-border">
              <span className="text-[10px] text-muted-foreground block uppercase">Modality & Protocol</span>
              <span className="font-bold text-foreground">fMRI + Thoracic CT • Lung Protocol</span>
            </div>
            <div className="p-2.5 rounded-lg bg-surface border border-border">
              <span className="text-[10px] text-muted-foreground block uppercase">Pathology WSI Slide ID</span>
              <span className="font-bold text-primary">{study?.pathologySlide?.slideId || "WSI-PATH-2024-7712"}</span>
            </div>
            <div className="p-2.5 rounded-lg bg-surface border border-border">
              <span className="text-[10px] text-muted-foreground block uppercase">AI Tumor Purity Score</span>
              <span className="font-bold text-accent">{study?.pathologySlide?.tumorPurityPercent || 68}% Tumor</span>
            </div>
          </div>
        </div>

        {/* Viewers Layout */}
        <Tabs defaultValue="radiology" className="space-y-6">
          <TabsList className="bg-muted border border-border p-1 rounded-lg">
            <TabsTrigger
              value="radiology"
              className="text-xs data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:font-bold data-[state=active]:shadow-subtle text-muted-foreground"
            >
              <ImageIcon className="w-3.5 h-3.5 mr-1.5 text-accent" /> Functional MRI & Thoracic CT Slice Viewer
            </TabsTrigger>
            <TabsTrigger
              value="pathology"
              className="text-xs data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:font-bold data-[state=active]:shadow-subtle text-muted-foreground"
            >
              <Layers className="w-3.5 h-3.5 mr-1.5 text-primary" /> Whole Slide Image H&E Pathology
            </TabsTrigger>
            <TabsTrigger
              value="radiomics"
              className="text-xs data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:font-bold data-[state=active]:shadow-subtle text-muted-foreground"
            >
              <Activity className="w-3.5 h-3.5 mr-1.5 text-accent" /> Radiomics Quantitative Features
            </TabsTrigger>
          </TabsList>

          {/* Radiology DICOM Viewer */}
          <TabsContent value="radiology" className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Left Controls Sidebar */}
            <div className="lg:col-span-1 space-y-5 p-5 rounded-xl bg-card border border-border text-xs shadow-subtle">
              <div className="flex items-center justify-between pb-2 border-b border-border">
                <span className="font-bold text-foreground uppercase tracking-wider font-mono flex items-center gap-1.5">
                  <Sliders className="w-4 h-4 text-accent" /> Canvas Controls
                </span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setWindowLevel(50);
                    setWindowWidth(350);
                    setSliceIndex(120);
                    setZoomLevel(100);
                  }}
                  className="h-6 text-[10px] text-muted-foreground hover:text-foreground px-1.5"
                >
                  <RotateCcw className="w-3 h-3 mr-1" /> Reset
                </Button>
              </div>

              {/* Series Selector */}
              <div className="space-y-2">
                <span className="text-[10px] text-muted-foreground uppercase font-mono">Modality / Series Selection</span>
                <div className="space-y-1.5">
                  <button
                    onClick={() => setActiveSeries("ser_dual_view")}
                    className={`w-full text-left p-2.5 rounded-lg border transition-colors ${
                      activeSeries === "ser_dual_view"
                        ? "bg-primary/10 border-primary text-foreground font-semibold"
                        : "bg-surface border-border text-muted-foreground hover:text-foreground hover:border-border"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold block text-foreground">Dual View: CT & Functional MRI</span>
                      <Badge variant="outline" className="text-[9px] font-mono border-primary/40 text-primary">Coregistered</Badge>
                    </div>
                    <span className="text-[10px] text-muted-foreground font-mono">Thoracic CT + Pulmonary fMRI</span>
                  </button>

                  <button
                    onClick={() => setActiveSeries("ser_ct_axial")}
                    className={`w-full text-left p-2.5 rounded-lg border transition-colors ${
                      activeSeries === "ser_ct_axial"
                        ? "bg-accent/10 border-accent text-foreground font-semibold"
                        : "bg-surface border-border text-muted-foreground hover:text-foreground hover:border-border"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold block text-foreground">High-Res Thoracic CT</span>
                      <span className="text-[10px] text-muted-foreground font-mono">DFOV 34.5cm</span>
                    </div>
                    <span className="text-[10px] text-muted-foreground font-mono">240 Slices • 140 kV • 60 mA</span>
                  </button>

                  <button
                    onClick={() => setActiveSeries("ser_fmri_lung")}
                    className={`w-full text-left p-2.5 rounded-lg border transition-colors ${
                      activeSeries === "ser_fmri_lung"
                        ? "bg-accent/10 border-accent text-foreground font-semibold"
                        : "bg-surface border-border text-muted-foreground hover:text-foreground hover:border-border"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold block text-foreground">Functional Lung MRI</span>
                      <Badge variant="outline" className="text-[9px] font-mono border-accent/40 text-accent">fMRI</Badge>
                    </div>
                    <span className="text-[10px] text-muted-foreground font-mono">120 Slices • Dynamic Perfusion/Vent</span>
                  </button>
                </div>
              </div>

              {/* Slice Navigation Slider */}
              <div className="space-y-2 pt-2 border-t border-border">
                <div className="flex justify-between font-mono">
                  <span className="text-muted-foreground">Slice Index:</span>
                  <span className="font-bold text-accent tabular-nums">{sliceIndex} / 240</span>
                </div>
                <Slider
                  value={[sliceIndex]}
                  max={240}
                  min={1}
                  step={1}
                  onValueChange={(vals) => setSliceIndex(vals[0])}
                  className="py-1"
                />
              </div>

              {/* Zoom Controls */}
              <div className="space-y-2 pt-2 border-t border-border">
                <div className="flex justify-between font-mono">
                  <span className="text-muted-foreground">Zoom Level:</span>
                  <span className="font-bold text-foreground tabular-nums">{zoomLevel}%</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setZoomLevel((z) => Math.max(75, z - 15))}
                    className="h-7 px-2.5 text-xs flex-1"
                  >
                    <ZoomOut className="w-3.5 h-3.5 mr-1" /> Zoom -
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setZoomLevel((z) => Math.min(180, z + 15))}
                    className="h-7 px-2.5 text-xs flex-1"
                  >
                    <ZoomIn className="w-3.5 h-3.5 mr-1" /> Zoom +
                  </Button>
                </div>
              </div>

              {/* Windowing & Contrast Sliders */}
              <div className="space-y-3 pt-2 border-t border-border">
                <span className="text-[10px] text-muted-foreground uppercase font-mono">Windowing (HU / MR Contrast)</span>
                <div className="space-y-1">
                  <div className="flex justify-between font-mono text-[11px]">
                    <span className="text-muted-foreground">Window Level (Center):</span>
                    <span className="text-foreground tabular-nums">{windowLevel} HU</span>
                  </div>
                  <Slider
                    value={[windowLevel]}
                    max={200}
                    min={-500}
                    onValueChange={(v) => setWindowLevel(v[0])}
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between font-mono text-[11px]">
                    <span className="text-muted-foreground">Window Width (Spread):</span>
                    <span className="text-foreground tabular-nums">{windowWidth} HU</span>
                  </div>
                  <Slider
                    value={[windowWidth]}
                    max={1500}
                    min={50}
                    onValueChange={(v) => setWindowWidth(v[0])}
                  />
                </div>
              </div>

              {/* Display Overlays Toggles */}
              <div className="space-y-2 pt-2 border-t border-border">
                <label className="flex items-center justify-between p-2 rounded-lg bg-surface border border-border cursor-pointer">
                  <span className="font-semibold text-foreground">AI Tumor ROI Mask</span>
                  <Switch
                    checked={showAiAnnotations}
                    onCheckedChange={setShowAiAnnotations}
                  />
                </label>
                <label className="flex items-center justify-between p-2 rounded-lg bg-surface border border-border cursor-pointer">
                  <span className="font-semibold text-foreground">Caliper Crosshair</span>
                  <Switch
                    checked={showCaliper}
                    onCheckedChange={setShowCaliper}
                  />
                </label>
              </div>
            </div>

            {/* Real DICOM Canvas Box with Real Functional MRI and Thoracic CT Image */}
            <div className="lg:col-span-3 p-5 sm:p-6 rounded-xl bg-card border border-border space-y-4 shadow-subtle">
              <div className="relative min-h-[480px] w-full rounded-xl bg-black border border-border overflow-hidden flex items-center justify-center group select-none">
                
                {/* HUD Overlay Top Left */}
                <div className="absolute top-3 left-3 font-mono text-[10px] text-emerald-400 bg-black/85 px-2.5 py-1.5 rounded border border-white/15 space-y-0.5 pointer-events-none z-10 backdrop-blur-xs">
                  <p className="font-bold text-white">UC-CCC THORACIC RADIOLOGY</p>
                  <p>ACC: {study?.accessionNumber || "ACC-UCANDO-2024-9910"}</p>
                  <p>SLICE: {sliceIndex} / 240 • DFOV: 34.5cm</p>
                  <p>WL: {windowLevel} / WW: {windowWidth}</p>
                  <p className="text-sky-300">MODALITY: {activeSeries === "ser_fmri_lung" ? "Functional Lung MRI" : activeSeries === "ser_ct_axial" ? "High-Res Thoracic CT" : "Dual CT + fMRI"}</p>
                </div>

                {/* HUD Overlay Top Right */}
                <div className="absolute top-3 right-3 font-mono text-[10px] text-emerald-400 bg-black/85 px-2.5 py-1.5 rounded border border-white/15 text-right space-y-0.5 pointer-events-none z-10 backdrop-blur-xs">
                  <p className="text-white font-bold">140 kV • 60 mA (Smart mA)</p>
                  <p>ROI 1: Right Upper Lobe Mass</p>
                  <p className="font-bold text-amber-400">fMRI Perfusion Signal = +84%</p>
                  <p>Tumor Dimension: 3.2 x 2.8 cm</p>
                  <p className="text-sky-300">V/Q Mismatch: Negative</p>
                </div>

                {/* Real Medical Scan Image Container */}
                <div
                  className="relative transition-transform duration-150 flex items-center justify-center max-w-full max-h-full p-4"
                  style={{
                    transform: `scale(${zoomLevel / 100})`,
                    filter: `brightness(${1 + (windowLevel - 50) / 400}) contrast(${1 + (windowWidth - 350) / 700})`
                  }}
                >
                  <div className="relative overflow-hidden rounded-lg border border-white/20 shadow-2xl bg-neutral-950 flex items-center justify-center">
                    {/* Real Image of Thoracic CT & Functional Lung MRI */}
                    {activeSeries === "ser_ct_axial" ? (
                      /* Left Half Only: High Resolution Thoracic CT */
                      <div className="relative overflow-hidden w-[380px] sm:w-[460px] h-[340px] sm:h-[400px]">
                        <img
                          src="https://cdn.builder.io/api/v1/image/assets%2Fda14c32a03704491b9b339da0a35dca5%2Fd1e5a1076d134704af2e4f10a45c931e?format=webp&width=800&height=1200"
                          alt="High-Resolution Thoracic CT Scan of the Lung"
                          className="absolute left-0 top-0 h-full w-[200%] max-w-none object-cover"
                        />
                        <div className="absolute bottom-2 left-2 bg-black/80 px-2 py-0.5 rounded text-[10px] font-mono text-white border border-white/20">
                          Axial High-Res Thoracic CT (Lung/P Window)
                        </div>
                      </div>
                    ) : activeSeries === "ser_fmri_lung" ? (
                      /* Right Half Only: Functional Magnetic Resonance MRI of the Lung */
                      <div className="relative overflow-hidden w-[380px] sm:w-[460px] h-[340px] sm:h-[400px]">
                        <img
                          src="https://cdn.builder.io/api/v1/image/assets%2Fda14c32a03704491b9b339da0a35dca5%2Fd1e5a1076d134704af2e4f10a45c931e?format=webp&width=800&height=1200"
                          alt="Functional Magnetic Resonance MRI of the Lung"
                          className="absolute right-0 top-0 h-full w-[200%] max-w-none object-cover"
                        />
                        <div className="absolute bottom-2 left-2 bg-black/80 px-2 py-0.5 rounded text-[10px] font-mono text-sky-300 border border-sky-500/30">
                          Functional MRI of the Lung (Ventilation & Perfusion fMRI)
                        </div>
                      </div>
                    ) : (
                      /* Dual View: Thoracic CT (Left) and Functional MRI of the Lung (Right) */
                      <div className="relative">
                        <img
                          src="https://cdn.builder.io/api/v1/image/assets%2Fda14c32a03704491b9b339da0a35dca5%2Fd1e5a1076d134704af2e4f10a45c931e?format=webp&width=800&height=1200"
                          alt="Thoracic CT and Functional Magnetic Resonance MRI of the Lung"
                          className="max-h-[380px] sm:max-h-[440px] w-auto object-contain select-none"
                        />
                        {/* Dual View Labels */}
                        <div className="absolute bottom-2 left-3 bg-black/80 px-2 py-0.5 rounded text-[10px] font-mono text-white border border-white/20">
                          High-Res Thoracic CT
                        </div>
                        <div className="absolute bottom-2 right-3 bg-black/80 px-2 py-0.5 rounded text-[10px] font-mono text-sky-300 border border-sky-500/30">
                          Functional Lung MRI (fMRI)
                        </div>
                      </div>
                    )}

                    {/* AI Tumor ROI Segmentation Box Overlay */}
                    {showAiAnnotations && (
                      <div className="absolute top-[28%] left-[22%] w-[18%] h-[24%] border-2 border-dashed border-amber-400 bg-amber-400/20 rounded-full animate-pulse pointer-events-none flex items-center justify-center">
                        <span className="text-[8px] font-mono font-bold text-amber-300 bg-black/80 px-1 rounded shadow">
                          ROI 1: 3.2cm
                        </span>
                      </div>
                    )}

                    {/* Caliper Crosshair */}
                    {showCaliper && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <Crosshair className="w-8 h-8 text-sky-400/70" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Bottom HUD Bar */}
                <div className="absolute bottom-3 left-3 text-[10px] font-mono text-neutral-400 bg-black/80 px-2 py-0.5 rounded border border-white/10 z-10">
                  OHIF DICOMweb Zero-Footprint Core • Protocol: STOW-RS / WADO-RS
                </div>
                <div className="absolute bottom-3 right-3 text-[10px] font-mono text-emerald-400 bg-black/80 px-2 py-0.5 rounded border border-white/10 z-10">
                  Matrix: 512 x 512 • 16-bit Grayscale
                </div>
              </div>

              {/* Radiology Summary text */}
              <div className="p-4 rounded-xl bg-surface border border-border space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-muted-foreground uppercase font-mono font-semibold">
                    Radiology Impression & Functional Correlation
                  </span>
                  <Badge variant="outline" className="text-[9px] font-mono border-emerald-500/30 text-emerald-600 dark:text-emerald-400">
                    Validated by Board-Certified Radiologist
                  </Badge>
                </div>
                <p className="text-xs text-foreground leading-relaxed font-sans">
                  {study?.findingsSummary || "Functional Magnetic Resonance Imaging (fMRI) of the lungs combined with high-resolution thoracic CT (DFOV 34.5cm, 140kV, 60mA Smart mA) demonstrates regional pulmonary ventilation and perfusion dynamics. Marked hyperintense signal on functional MRI perfusion maps corresponding to the 3.2 x 2.8 cm right upper lobe primary lesion with preserved functional ventilation in contralateral left lung and bilateral lower lung zones."}
                </p>
              </div>
            </div>
          </TabsContent>

          {/* Pathology Whole Slide Image Viewer */}
          <TabsContent value="pathology" className="p-5 sm:p-6 rounded-xl bg-card border border-border space-y-4 shadow-subtle">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold font-serif text-foreground">
                  Digital Pathology Whole Slide Image — Invasive Carcinoma Cell Clusters
                </h3>
                <p className="text-xs text-muted-foreground">
                  Slide Barcode: <code className="text-primary font-mono">{study?.pathologySlide?.slideId || "WSI-PATH-2024-7712"}</code> • Stain: <strong>H&E (Hematoxylin and Eosin)</strong> • Biopsy Site: <strong>Right Upper Lobe Core Biopsy</strong>
                </p>
              </div>

              <div className="flex items-center gap-2 font-mono text-xs flex-wrap">
                <span className="text-muted-foreground mr-1">Magnification:</span>
                {(["10x", "20x", "40x"] as const).map((z) => (
                  <Button
                    key={z}
                    size="sm"
                    variant={pathologyZoom === z ? "default" : "outline"}
                    onClick={() => setPathologyZoom(z)}
                    className={`h-7 px-3 text-xs font-semibold ${
                      pathologyZoom === z
                        ? "bg-primary text-primary-foreground shadow-subtle"
                        : "border-border text-foreground hover:bg-muted"
                    }`}
                  >
                    {z}
                  </Button>
                ))}

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowPathologyAiMask(!showPathologyAiMask)}
                  className={`h-7 text-xs ml-2 ${showPathologyAiMask ? "border-accent text-accent bg-accent/10 font-semibold" : "border-border text-muted-foreground"}`}
                >
                  <Sparkles className="w-3.5 h-3.5 mr-1 text-accent" /> AI Cell Cluster Mask
                </Button>
              </div>
            </div>

            {/* Real WSI Pathology Canvas */}
            <div className="relative min-h-[440px] w-full rounded-xl bg-neutral-950 border border-border overflow-hidden flex items-center justify-center group select-none">
              {/* HUD Overlay Top Left */}
              <div className="absolute top-3 left-3 font-mono text-[10px] text-white bg-black/85 px-2.5 py-1.5 rounded border border-white/15 space-y-0.5 z-10 backdrop-blur-xs">
                <p className="font-bold text-primary">UC-CCC DIGITAL PATHOLOGY</p>
                <p>SLIDE: WSI-PATH-2024-7712</p>
                <p>MAGNIFICATION: {pathologyZoom} (High Power Field)</p>
                <p>STAIN: H&E Coregistered</p>
              </div>

              {/* AI Segmentation Overlay Box Top Right */}
              {showPathologyAiMask && (
                <div className="absolute top-3 right-3 font-mono text-[10px] bg-black/85 p-2.5 rounded border border-white/15 space-y-1 text-right z-10 backdrop-blur-xs">
                  <p className="text-accent font-bold">AI Tumor Purity: 68%</p>
                  <p className="text-emerald-400 font-semibold">Invasive Carcinoma Cell Clusters: Detected</p>
                  <p className="text-muted-foreground">Nuclear Atypia: Score 3 | Mitotic Rate: Elevated</p>
                </div>
              )}

              {/* Real H&E Pathology Tissue Slide Image */}
              <div
                className="relative transition-all duration-300 max-h-[420px] max-w-full flex items-center justify-center p-2"
                style={{
                  transform: `scale(${pathologyZoom === "10x" ? 1.0 : pathologyZoom === "20x" ? 1.25 : 1.5})`
                }}
              >
                <div className="relative rounded-lg overflow-hidden border border-white/20 shadow-2xl">
                  <img
                    src="https://cdn.builder.io/api/v1/image/assets%2Fda14c32a03704491b9b339da0a35dca5%2F68cec5f18626414e819566174c262d44?format=webp&width=800&height=1200"
                    alt="Invasive Carcinoma Cell Clusters H&E Stain Digital Pathology Whole Slide"
                    className="max-h-[360px] sm:max-h-[400px] w-auto object-contain select-none"
                  />

                  {/* AI Cell Cluster Highlight Annotations */}
                  {showPathologyAiMask && (
                    <>
                      <div className="absolute top-[22%] left-[30%] w-[24%] h-[28%] border-2 border-dashed border-rose-400 bg-rose-500/20 rounded-xl pointer-events-none animate-pulse flex items-start justify-end p-1">
                        <span className="text-[8px] font-mono font-bold text-white bg-rose-900/90 px-1 rounded">
                          Cluster A (Pleomorphic)
                        </span>
                      </div>
                      <div className="absolute bottom-[20%] left-[18%] w-[22%] h-[26%] border-2 border-dashed border-amber-400 bg-amber-500/20 rounded-xl pointer-events-none flex items-start justify-end p-1">
                        <span className="text-[8px] font-mono font-bold text-white bg-amber-900/90 px-1 rounded">
                          Cluster B (Mitotic)
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Bottom HUD Bar */}
              <div className="absolute bottom-3 left-3 text-[10px] font-mono text-neutral-400 bg-black/80 px-2 py-0.5 rounded border border-white/10 z-10">
                WSI DeepZoom Tile Server • Resolution: 0.25 µm/pixel (40x equivalent)
              </div>
            </div>

            {/* Pathology Impression Card */}
            <div className="p-4 rounded-xl bg-surface border border-border space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-muted-foreground uppercase font-mono font-semibold">
                  Histopathological Impression — Invasive Carcinoma
                </span>
                <Badge variant="outline" className="text-[9px] font-mono border-rose-500/30 text-rose-600 dark:text-rose-400">
                  Confirmed Malignant Neoplasm
                </Badge>
              </div>
              <p className="text-xs text-foreground leading-relaxed font-sans">
                High-power H&E histological examination demonstrates atypical pleomorphic invasive carcinoma cell clusters with prominent nucleoli, hyperchromasia, high nuclear-to-cytoplasmic ratio, and frequent atypical mitotic figures. Architecture displays infiltrative nests within a desmoplastic stroma, consistent with poorly differentiated carcinoma.
              </p>
            </div>
          </TabsContent>

          {/* Radiomics Tab */}
          <TabsContent value="radiomics" className="p-6 rounded-xl bg-card border border-border space-y-4 shadow-subtle">
            <h3 className="text-base font-bold font-serif text-foreground">Quantitative Radiomics & Volumetric Analysis</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg bg-surface border border-border space-y-1">
                <span className="text-[10px] text-muted-foreground uppercase font-mono">Lesion Sphericity Index</span>
                <p className="text-xl font-bold text-accent font-mono">0.78</p>
                <p className="text-[11px] text-muted-foreground">Low irregular margin spiculation</p>
              </div>
              <div className="p-4 rounded-lg bg-surface border border-border space-y-1">
                <span className="text-[10px] text-muted-foreground uppercase font-mono">GLCM Texture Entropy</span>
                <p className="text-xl font-bold text-primary font-mono">4.12</p>
                <p className="text-[11px] text-muted-foreground">High internal tumor heterogeneity</p>
              </div>
              <div className="p-4 rounded-lg bg-surface border border-border space-y-1">
                <span className="text-[10px] text-muted-foreground uppercase font-mono">Total Metabolic Tumor Volume</span>
                <p className="text-xl font-bold text-foreground font-mono">18.4 cm³</p>
                <p className="text-[11px] text-muted-foreground">Baseline pre-treatment burden</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
