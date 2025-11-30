import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Upload, Check, X, Loader2, Sparkles, Image as ImageIcon, Info } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";

// Declare globals for CDN loaded libraries
declare global {
  interface Window {
    tf: any;
    mobilenet: any;
  }
}

// Define categories and their keywords
const CATEGORIES = {
  professional: {
    label: "Professional",
    keywords: ["suit", "tie", "jacket", "uniform", "official", "business", "desk", "office", "monitor", "keyboard", "laptop"],
    color: "bg-blue-500"
  },
  casual: {
    label: "Casual / Dating",
    keywords: ["smile", "person", "happy", "park", "outdoor", "shirt", "t-shirt", "jean", "glasses", "male", "man", "boy"],
    color: "bg-pink-500"
  },
  adventurous: {
    label: "Adventurous",
    keywords: ["mountain", "ski", "snow", "beach", "water", "swimming", "bicycle", "bike", "running", "sport", "ball"],
    color: "bg-green-500"
  },
  family: {
    label: "Family / Group",
    keywords: ["people", "group", "crowd", "team", "wedding", "party"],
    color: "bg-purple-500"
  }
};

interface ScoredImage {
  file: File;
  url: string;
  category: keyof typeof CATEGORIES;
  confidence: number;
  tags: string[];
}

export default function SmartPhotoSelector() {
  const { toast } = useToast();
  const [model, setModel] = useState<any>(null);
  const [isLoadingModel, setIsLoadingModel] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzedImages, setAnalyzedImages] = useState<ScoredImage[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load MobileNet model on mount
  useEffect(() => {
    async function loadModel() {
      try {
        // Wait for globals to be available
        if (!window.tf || !window.mobilenet) {
           console.log("Waiting for TF/MobileNet globals...");
           await new Promise(resolve => setTimeout(resolve, 1000));
        }

        if (window.tf && window.mobilenet) {
           await window.tf.ready();
           const loadedModel = await window.mobilenet.load();
           setModel(loadedModel);
           setIsLoadingModel(false);
        } else {
           throw new Error("TensorFlow libraries not loaded");
        }
      } catch (error) {
        console.error("Failed to load TF model:", error);
        toast({
          title: "AI Engine Error",
          description: "Could not load the image recognition model. Please refresh.",
          variant: "destructive"
        });
      }
    }
    loadModel();
  }, []);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !model) return;
    
    setIsAnalyzing(true);
    const files = Array.from(e.target.files);
    const results: ScoredImage[] = [];

    for (const file of files) {
      try {
        const result = await analyzeImage(file);
        results.push(result);
      } catch (err) {
        console.error("Error analyzing image:", err);
      }
    }

    setAnalyzedImages(prev => [...prev, ...results]);
    setIsAnalyzing(false);
    
    toast({
      title: "Analysis Complete",
      description: `Processed ${results.length} photos successfully.`
    });
  };

  const analyzeImage = (file: File): Promise<ScoredImage> => {
    return new Promise((resolve, reject) => {
      const img = document.createElement('img');
      img.src = URL.createObjectURL(file);
      img.onload = async () => {
        if (!model) return reject("Model not loaded");
        
        const predictions = await model.classify(img);
        
        // Simple heuristic scoring
        let bestCategory: keyof typeof CATEGORIES = "casual";
        let maxScore = 0;
        const allTags = predictions.map(p => p.className.toLowerCase());

        Object.entries(CATEGORIES).forEach(([key, data]) => {
          let score = 0;
          data.keywords.forEach(keyword => {
            if (allTags.some(tag => tag.includes(keyword))) {
              score += 1;
            }
          });
          if (score > maxScore) {
            maxScore = score;
            bestCategory = key as keyof typeof CATEGORIES;
          }
        });

        resolve({
          file,
          url: img.src,
          category: bestCategory,
          confidence: predictions[0].probability,
          tags: predictions.slice(0, 3).map(p => p.className.split(',')[0])
        });
      };
      img.onerror = reject;
    });
  };

  const removeImage = (index: number) => {
    setAnalyzedImages(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold font-heading text-primary flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-accent" /> Smart Photo Selector
            </h1>
            <p className="text-muted-foreground">AI-powered categorization for your profile photos.</p>
          </div>
          <Link href="/combined">
             <Button variant="outline" size="sm">Back to Profile</Button>
          </Link>
        </div>

        {/* Upload Area */}
        <Card className="border-dashed border-2 border-muted hover:border-primary/50 transition-colors">
          <CardContent className="p-12 flex flex-col items-center justify-center text-center space-y-4">
             <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
               {isLoadingModel ? (
                 <Loader2 className="w-8 h-8 text-primary animate-spin" />
               ) : (
                 <Upload className="w-8 h-8 text-primary" />
               )}
             </div>
             
             <div>
               <h3 className="text-lg font-medium">
                 {isLoadingModel ? "Loading AI Model..." : "Upload Photos to Analyze"}
               </h3>
               <p className="text-sm text-muted-foreground mt-1">
                 Supports JPG, PNG (Max 5MB). Runs 100% private on your device.
               </p>
             </div>

             <div className="flex gap-4 pt-4">
               <input
                 type="file"
                 multiple
                 accept="image/*"
                 className="hidden"
                 ref={fileInputRef}
                 onChange={handleFileSelect}
                 id="file-upload"
               />
               <Button 
                 disabled={isLoadingModel || isAnalyzing} 
                 onClick={() => fileInputRef.current?.click()}
                 className="min-w-[150px]"
               >
                 {isAnalyzing ? (
                   <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Analyzing...</>
                 ) : (
                   "Select Photos"
                 )}
               </Button>
             </div>
          </CardContent>
        </Card>

        {/* Results Grid */}
        {analyzedImages.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold font-heading">Analysis Results</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <AnimatePresence>
                {analyzedImages.map((img, idx) => (
                  <motion.div
                    key={img.url}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    layout
                  >
                    <Card className="overflow-hidden h-full flex flex-col">
                      <div className="relative aspect-[4/5] group">
                         <img src={img.url} alt="thumbnail" loading="lazy" className="w-full h-full object-cover" />
                         <Button 
                           variant="destructive" 
                           size="icon" 
                           className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8"
                           onClick={() => removeImage(idx)}
                         >
                           <X className="w-4 h-4" />
                         </Button>
                      </div>
                      
                      <CardContent className="p-4 space-y-3 flex-1">
                         <div className="flex items-center justify-between">
                           <Badge className={CATEGORIES[img.category].color}>
                             {CATEGORIES[img.category].label}
                           </Badge>
                           <span className="text-xs font-mono text-muted-foreground">
                             {(img.confidence * 100).toFixed(0)}% Match
                           </span>
                         </div>
                         
                         <div className="flex flex-wrap gap-1">
                           {img.tags.map(tag => (
                             <Badge key={tag} variant="outline" className="text-[10px]">
                               #{tag}
                             </Badge>
                           ))}
                         </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
