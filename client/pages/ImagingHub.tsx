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
  const [activeSeries, setActiveSeries] = useState("ser_ct_axial");
  const [sliceIndex, setSliceIndex] = useState(120);
  const [windowLevel, setWindowLevel] = useState(50);
  const [windowWidth, setWindowWidth] = useState(350);
  const [showAiAnnotations, setShowAiAnnotations] = useState(true);
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
      <div className="space-y-6 pb-12">
        {/* Header */}
        <div className="p-6 rounded-xl bg-card border border-border space-y-4 shadow-subtle">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-primary/10 text-primary border border-primary/20">
                <ImageIcon className="w-6 h-6 text-primary" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold font-serif text-foreground">Imaging & Digital Pathology Workspace</h1>
                  <Badge variant="outline" className="border-accent/40 text-accent bg-accent/5 font-mono text-[10px]">
                    DICOMweb STOW-RS
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Multi-modal PET/CT radiology & Whole Slide Image (WSI) H&E digital pathology zero-footprint viewer.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Badge className="bg-accent/15 text-accent border-accent/30 text-xs py-1 px-3 font-mono">
                <ShieldCheck className="w-3.5 h-3.5 mr-1" /> De-identified Pixel Enclave
              </Badge>
            </div>
          </div>

          {/* Metadata Chips */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2 text-xs font-mono">
            <div className="p-2.5 rounded-lg bg-surface border border-border">
              <span className="text-[10px] text-muted-foreground block uppercase">Accession Number</span>
              <span className="font-bold text-foreground">{study?.accessionNumber || "ACC-UCH-2024-9910"}</span>
            </div>
            <div className="p-2.5 rounded-lg bg-surface border border-border">
              <span className="text-[10px] text-muted-foreground block uppercase">Modality & Body Part</span>
              <span className="font-bold text-foreground">{study?.modality} • {study?.bodyPart}</span>
            </div>
            <div className="p-2.5 rounded-lg bg-surface border border-border">
              <span className="text-[10px] text-muted-foreground block uppercase">Pathology WSI Slide ID</span>
              <span className="font-bold text-primary">{study?.pathologySlide?.slideId}</span>
            </div>
            <div className="p-2.5 rounded-lg bg-surface border border-border">
              <span className="text-[10px] text-muted-foreground block uppercase">AI Tumor Purity Score</span>
              <span className="font-bold text-accent">{study?.pathologySlide?.tumorPurityPercent}% Tumor</span>
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
              <ImageIcon className="w-3.5 h-3.5 mr-1.5 text-accent" /> PET/CT DICOM Slice Viewer
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
                  }}
                  className="h-6 text-[10px] text-muted-foreground hover:text-foreground px-1.5"
                >
                  <RotateCcw className="w-3 h-3 mr-1" /> Reset
                </Button>
              </div>

              {/* Series Selector */}
              <div className="space-y-2">
                <span className="text-[10px] text-muted-foreground uppercase font-mono">Series Selection</span>
                <div className="space-y-1.5">
                  {study?.seriesList.map((ser) => (
                    <button
                      key={ser.seriesId}
                      onClick={() => setActiveSeries(ser.seriesId)}
                      className={`w-full text-left p-2.5 rounded-lg border transition-colors ${
                        activeSeries === ser.seriesId
                          ? "bg-accent/10 border-accent text-foreground font-semibold"
                          : "bg-surface border-border text-muted-foreground hover:text-foreground hover:border-border"
                      }`}
                    >
                      <span className="font-bold block text-foreground">{ser.description}</span>
                      <span className="text-[10px] text-muted-foreground font-mono">{ser.numSlices} Slices • 1.25mm</span>
                    </button>
                  ))}
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

              {/* Windowing & Contrast Sliders */}
              <div className="space-y-3 pt-2 border-t border-border">
                <span className="text-[10px] text-muted-foreground uppercase font-mono">Windowing (HU / SUV)</span>
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
                    <span className="text-muted-foreground">Window Width:</span>
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

              {/* AI Detection Overlay Toggle */}
              <div className="pt-2 border-t border-border">
                <label className="flex items-center justify-between p-2.5 rounded-lg bg-surface border border-border cursor-pointer">
                  <span className="font-semibold text-foreground">AI Tumor ROI Mask</span>
                  <Switch
                    checked={showAiAnnotations}
                    onCheckedChange={setShowAiAnnotations}
                  />
                </label>
              </div>
            </div>

            {/* Simulated DICOM Canvas Box */}
            <div className="lg:col-span-3 p-6 rounded-xl bg-card border border-border space-y-4 shadow-subtle">
              <div className="relative h-96 w-full rounded-xl bg-black border border-border overflow-hidden flex items-center justify-center">
                {/* HUD Overlay Info */}
                <div className="absolute top-3 left-3 font-mono text-[10px] text-accent bg-black/80 px-2.5 py-1 rounded border border-white/10 space-y-0.5 pointer-events-none">
                  <p>UC-CCC MEDICAL RADIOLOGY</p>
                  <p>ACC: {study?.accessionNumber}</p>
                  <p>SLICE: {sliceIndex} / 240</p>
                  <p>WL: {windowLevel} / WW: {windowWidth}</p>
                </div>

                <div className="absolute top-3 right-3 font-mono text-[10px] text-accent bg-black/80 px-2.5 py-1 rounded border border-white/10 text-right pointer-events-none">
                  <p>ROI 1: Right Upper Lobe Mass</p>
                  <p className="font-bold text-amber-400">SUVmax = 11.4 g/mL</p>
                  <p>Size: 3.2 x 2.8 cm</p>
                </div>

                {/* DICOM Slice Image Simulation Graphic */}
                <div className="relative w-64 h-64 rounded-full border-2 border-white/20 bg-gradient-to-tr from-neutral-900 via-neutral-950 to-neutral-900 flex items-center justify-center">
                  <div className="w-48 h-48 rounded-full border border-white/10 flex items-center justify-center">
                    {/* Simulated Lung Fields */}
                    <div className="w-20 h-32 rounded-full border border-white/20 bg-neutral-900/80 mr-2 flex items-center justify-center">
                      {/* AI Tumoral ROI Overlay */}
                      {showAiAnnotations && (
                        <div className="w-8 h-8 rounded-full bg-primary/40 border-2 border-primary animate-pulse flex items-center justify-center text-[9px] font-mono text-primary-foreground font-bold">
                          SUV 11.4
                        </div>
                      )}
                    </div>
                    <div className="w-20 h-32 rounded-full border border-white/20 bg-neutral-900/80" />
                  </div>

                  {/* Caliper Crosshair */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <Crosshair className="w-6 h-6 text-accent/60" />
                  </div>
                </div>

                <div className="absolute bottom-3 left-3 text-[10px] font-mono text-neutral-400">
                  OHIF DICOMweb Zero-Footprint Rendering Engine
                </div>
              </div>

              {/* Radiology Summary text */}
              <div className="p-4 rounded-xl bg-surface border border-border space-y-1">
                <span className="text-[10px] text-muted-foreground uppercase font-mono font-semibold">Radiology Impression</span>
                <p className="text-xs text-foreground leading-relaxed font-sans">
                  {study?.findingsSummary}
                </p>
              </div>
            </div>
          </TabsContent>

          {/* Pathology Whole Slide Image Viewer */}
          <TabsContent value="pathology" className="p-6 rounded-xl bg-card border border-border space-y-4 shadow-subtle">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold font-serif text-foreground">Digital Pathology Whole Slide Image (H&E Stain)</h3>
                <p className="text-xs text-muted-foreground">
                  Slide Barcode: <code className="text-primary font-mono">{study?.pathologySlide?.slideId}</code> • H&E Stain
                </p>
              </div>

              <div className="flex items-center gap-2 font-mono text-xs">
                <span className="text-muted-foreground mr-1">Magnification:</span>
                {(["10x", "20x", "40x"] as const).map((z) => (
                  <Button
                    key={z}
                    size="sm"
                    variant={pathologyZoom === z ? "default" : "outline"}
                    onClick={() => setPathologyZoom(z)}
                    className={`h-7 text-xs font-semibold ${
                      pathologyZoom === z
                        ? "bg-primary text-primary-foreground shadow-subtle"
                        : "border-border text-foreground hover:bg-muted"
                    }`}
                  >
                    {z}
                  </Button>
                ))}
              </div>
            </div>

            {/* Simulated WSI pathology canvas */}
            <div className="relative h-80 w-full rounded-xl bg-surface border border-border overflow-hidden flex items-center justify-center">
              <div className="absolute top-3 left-3 font-mono text-[10px] text-foreground bg-card/90 px-2.5 py-1 rounded border border-border">
                WSI MAGNIFICATION: {pathologyZoom} • STAIN: H&E
              </div>

              {/* AI Segmentation Overlay Box */}
              {showPathologyAiMask && (
                <div className="absolute top-3 right-3 font-mono text-[10px] bg-card/90 p-2.5 rounded border border-border space-y-1 text-right">
                  <p className="text-accent font-bold">AI Tumor Purity: 68%</p>
                  <p className="text-muted-foreground">Stroma: 24% | Necrosis: 8%</p>
                </div>
              )}

              {/* Cellular H&E Pattern Simulation */}
              <div className="w-full h-full bg-gradient-to-r from-rose-950/20 via-pink-950/20 to-primary/10 flex items-center justify-center p-8">
                <div className="p-8 rounded-xl bg-card/80 border border-border backdrop-blur text-center space-y-2 max-w-md shadow-subtle">
                  <div className="p-3 rounded-full bg-primary/10 text-primary w-12 h-12 mx-auto flex items-center justify-center">
                    <Layers className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-foreground text-sm font-serif">Invasive Carcinoma Cell Clusters</h4>
                  <p className="text-xs text-muted-foreground">
                    Deep learning nuclear segmentation detected atypical pleomorphic epithelial nuclei with high mitotic rate (Score 3).
                  </p>
                </div>
              </div>
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
