import { useState, useEffect } from "react";
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
  RotateCcw
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
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-xl">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-950 text-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-800 shadow-md">
                <ImageIcon className="w-6 h-6 text-brand-maroon" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold text-slate-900 dark:text-white">Imaging & Digital Pathology Workspace</h1>
                  <Badge variant="outline" className="border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-950 text-[10px]">
                    DICOMweb STOW-RS
                  </Badge>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Multi-modal PET/CT radiology & Whole Slide Image (WSI) H&E digital pathology zero-footprint viewer.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Badge className="bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800 text-xs py-1 px-3">
                <ShieldCheck className="w-3.5 h-3.5 mr-1" /> De-identified Pixel Enclave
              </Badge>
            </div>
          </div>

          {/* Metadata Chips */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2 text-xs font-mono">
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] text-slate-500 block uppercase">Accession Number</span>
              <span className="font-bold text-slate-900 dark:text-slate-200">{study?.accessionNumber || "ACC-UCH-2024-9910"}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] text-slate-500 block uppercase">Modality & Body Part</span>
              <span className="font-bold text-slate-900 dark:text-white">{study?.modality} • {study?.bodyPart}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] text-slate-500 block uppercase">Pathology WSI Slide ID</span>
              <span className="font-bold text-brand-maroon dark:text-rose-300">{study?.pathologySlide?.slideId}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] text-slate-500 block uppercase">AI Tumor Purity Score</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-300">{study?.pathologySlide?.tumorPurityPercent}% Tumor</span>
            </div>
          </div>
        </div>

        {/* Viewers Layout */}
        <Tabs defaultValue="radiology" className="space-y-6">
          <TabsList className="bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1 rounded-xl">
            <TabsTrigger value="radiology" className="text-xs data-[state=active]:bg-brand-maroon data-[state=active]:text-white text-slate-700 dark:text-slate-300">
              <ImageIcon className="w-3.5 h-3.5 mr-1.5" /> PET/CT DICOM Slice Viewer
            </TabsTrigger>
            <TabsTrigger value="pathology" className="text-xs data-[state=active]:bg-brand-maroon data-[state=active]:text-white text-slate-700 dark:text-slate-300">
              <Layers className="w-3.5 h-3.5 mr-1.5" /> Whole Slide Image H&E Pathology
            </TabsTrigger>
            <TabsTrigger value="radiomics" className="text-xs data-[state=active]:bg-brand-maroon data-[state=active]:text-white text-slate-700 dark:text-slate-300">
              <Activity className="w-3.5 h-3.5 mr-1.5" /> Radiomics Quantitative Features
            </TabsTrigger>
          </TabsList>

          {/* Radiology DICOM Viewer */}
          <TabsContent value="radiology" className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Left Controls Sidebar */}
            <div className="lg:col-span-1 space-y-5 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
                <span className="font-bold text-slate-900 dark:text-white uppercase tracking-wider font-mono flex items-center gap-1.5">
                  <Sliders className="w-4 h-4 text-sky-500 dark:text-sky-400" /> Canvas Controls
                </span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setWindowLevel(50);
                    setWindowWidth(350);
                    setSliceIndex(120);
                  }}
                  className="h-6 text-[10px] text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white px-1.5"
                >
                  <RotateCcw className="w-3 h-3 mr-1" /> Reset
                </Button>
              </div>

              {/* Series Selector */}
              <div className="space-y-2">
                <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-mono">Series Selection</span>
                <div className="space-y-1.5">
                  {study?.seriesList.map((ser) => (
                    <button
                      key={ser.seriesId}
                      onClick={() => setActiveSeries(ser.seriesId)}
                      className={`w-full text-left p-2.5 rounded-lg border transition-colors ${
                        activeSeries === ser.seriesId
                          ? "bg-sky-950/60 border-sky-500 text-sky-200"
                          : "bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700"
                      }`}
                    >
                      <span className="font-bold block text-slate-900 dark:text-white">{ser.description}</span>
                      <span className="text-[10px] text-slate-500">{ser.numSlices} Slices • 1.25mm</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Slice Navigation Slider */}
              <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                <div className="flex justify-between font-mono">
                  <span className="text-slate-500 dark:text-slate-400">Slice Index:</span>
                  <span className="font-bold text-sky-600 dark:text-sky-300">{sliceIndex} / 240</span>
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
              <div className="space-y-3 pt-2 border-t border-slate-200 dark:border-slate-800">
                <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-mono">Windowing (HU / SUV)</span>
                <div className="space-y-1">
                  <div className="flex justify-between font-mono text-[11px]">
                    <span className="text-slate-500 dark:text-slate-400">Window Level (Center):</span>
                    <span className="text-slate-700 dark:text-slate-200">{windowLevel} HU</span>
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
                    <span className="text-slate-400">Window Width:</span>
                    <span className="text-slate-200">{windowWidth} HU</span>
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
              <div className="pt-2 border-t border-slate-800">
                <label className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950 border border-slate-800 cursor-pointer">
                  <span className="font-semibold text-slate-300">AI Tumor ROI Mask</span>
                  <Switch
                    checked={showAiAnnotations}
                    onCheckedChange={setShowAiAnnotations}
                    className="data-[state=checked]:bg-sky-500"
                  />
                </label>
              </div>
            </div>

            {/* Simulated DICOM Canvas Box */}
            <div className="lg:col-span-3 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="relative h-96 w-full rounded-xl bg-slate-950 border border-slate-800 overflow-hidden flex items-center justify-center">
                {/* HUD Overlay Info */}
                <div className="absolute top-3 left-3 font-mono text-[10px] text-sky-400 bg-slate-900/80 px-2.5 py-1 rounded border border-slate-800 space-y-0.5 pointer-events-none">
                  <p>UC-CCC MEDICAL RADIOLOGY</p>
                  <p>ACC: {study?.accessionNumber}</p>
                  <p>SLICE: {sliceIndex} / 240</p>
                  <p>WL: {windowLevel} / WW: {windowWidth}</p>
                </div>

                <div className="absolute top-3 right-3 font-mono text-[10px] text-emerald-400 bg-slate-900/80 px-2.5 py-1 rounded border border-slate-800 text-right pointer-events-none">
                  <p>ROI 1: Right Upper Lobe Mass</p>
                  <p className="font-bold text-amber-300">SUVmax = 11.4 g/mL</p>
                  <p>Size: 3.2 x 2.8 cm</p>
                </div>

                {/* DICOM Slice Image Simulation Graphic */}
                <div className="relative w-64 h-64 rounded-full border-2 border-slate-800 bg-gradient-to-tr from-slate-900 via-slate-950 to-slate-900 flex items-center justify-center">
                  <div className="w-48 h-48 rounded-full border border-slate-800/80 flex items-center justify-center">
                    {/* Simulated Lung Fields */}
                    <div className="w-20 h-32 rounded-full border border-slate-700 bg-slate-900/80 mr-2 flex items-center justify-center">
                      {/* AI Tumoral ROI Overlay */}
                      {showAiAnnotations && (
                        <div className="w-8 h-8 rounded-full bg-amber-500/30 border-2 border-amber-400 animate-pulse flex items-center justify-center text-[9px] font-mono text-amber-200 font-bold">
                          SUV 11.4
                        </div>
                      )}
                    </div>
                    <div className="w-20 h-32 rounded-full border border-slate-700 bg-slate-900/80" />
                  </div>

                  {/* Caliper Crosshair */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <Crosshair className="w-6 h-6 text-sky-500/60" />
                  </div>
                </div>

                <div className="absolute bottom-3 left-3 text-[10px] font-mono text-slate-500">
                  OHIF DICOMweb Zero-Footprint Rendering Engine
                </div>
              </div>

              {/* Radiology Summary text */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-500 uppercase font-mono">Radiology Impression</span>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  {study?.findingsSummary}
                </p>
              </div>
            </div>
          </TabsContent>

          {/* Pathology Whole Slide Image Viewer */}
          <TabsContent value="pathology" className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Digital Pathology Whole Slide Image (H&E Stain)</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Slide Barcode: <code className="text-purple-600 dark:text-purple-300 font-mono">{study?.pathologySlide?.slideId}</code> • H&E Stain
                </p>
              </div>

              <div className="flex items-center gap-2 font-mono text-xs">
                <span className="text-slate-500 dark:text-slate-400 mr-1">Magnification:</span>
                {(["10x", "20x", "40x"] as const).map((z) => (
                  <Button
                    key={z}
                    size="sm"
                    variant={pathologyZoom === z ? "default" : "outline"}
                    onClick={() => setPathologyZoom(z)}
                    className={`h-7 text-xs ${
                      pathologyZoom === z
                        ? "bg-purple-600 hover:bg-purple-500 text-white"
                        : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-300"
                    }`}
                  >
                    {z}
                  </Button>
                ))}
              </div>
            </div>

            {/* Simulated WSI pathology canvas */}
            <div className="relative h-80 w-full rounded-xl bg-purple-950/20 border border-purple-900/50 overflow-hidden flex items-center justify-center">
              <div className="absolute top-3 left-3 font-mono text-[10px] text-purple-300 bg-slate-900/90 px-2.5 py-1 rounded border border-slate-800">
                WSI MAGNIFICATION: {pathologyZoom} • STAIN: H&E
              </div>

              {/* AI Segmentation Overlay Box */}
              {showPathologyAiMask && (
                <div className="absolute top-3 right-3 font-mono text-[10px] bg-slate-900/90 p-2.5 rounded border border-slate-800 space-y-1 text-right">
                  <p className="text-emerald-400 font-bold">AI Tumor Purity: 68%</p>
                  <p className="text-slate-400">Stroma: 24% | Necrosis: 8%</p>
                </div>
              )}

              {/* Cellular H&E Pattern Simulation */}
              <div className="w-full h-full bg-gradient-to-r from-pink-950/40 via-purple-950/60 to-rose-950/40 flex items-center justify-center p-8">
                <div className="p-8 rounded-2xl bg-pink-900/20 border border-pink-700/40 backdrop-blur text-center space-y-2 max-w-md">
                  <Layers className="w-8 h-8 text-pink-400 mx-auto" />
                  <p className="text-xs font-bold text-pink-200 font-mono">Invasive Carcinoma Cellular Cluster</p>
                  <p className="text-[11px] text-slate-300">
                    High nuclear-to-cytoplasmic ratio with prominent nucleoli. Moderate lymphocytic infiltrate at tumor margin.
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Radiomics Features Table */}
          <TabsContent value="radiomics" className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Extracted PyRadiomics Quantitative Biomarkers</h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-mono text-[10px] uppercase">
                    <th className="py-2.5 px-3">Biomarker Feature Name</th>
                    <th className="py-2.5 px-3">Category</th>
                    <th className="py-2.5 px-3">Extracted Value</th>
                    <th className="py-2.5 px-3">Cohort Normal Z-Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60 text-slate-700 dark:text-slate-300 font-mono">
                  {study?.radiomicsFeatures.map((f) => (
                    <tr key={f.featureName} className="hover:bg-slate-50 dark:hover:bg-slate-950/60">
                      <td className="py-3 px-3 font-bold text-slate-900 dark:text-white">{f.featureName}</td>
                      <td className="py-3 px-3 text-slate-400">{f.category}</td>
                      <td className="py-3 px-3 text-sky-300 font-bold">{f.value}</td>
                      <td className="py-3 px-3">
                        <Badge className="bg-amber-950 text-amber-300 border-amber-800 text-[10px]">
                          + {f.normalZScore} σ
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
