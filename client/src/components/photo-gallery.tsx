import { motion } from "framer-motion";
import { Image as ImageIcon, Briefcase, Heart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const PHOTOS = {
  professional: [
    { src: "/photos/pro-1.png", alt: "Professional photo 1" },
    { src: "/photos/pro-2.png", alt: "Professional photo 2" },
    { src: "/photos/pro-3.png", alt: "Professional photo 3" }
  ],
  dating: [
    { src: "/photos/dating-1.png", alt: "Dating photo 1" },
    { src: "/photos/dating-2.png", alt: "Dating photo 2" },
    { src: "/photos/dating-3.png", alt: "Dating photo 3" }
  ]
};

export function PhotoGallery() {
  return (
    <Card className="border-none shadow-lg bg-card overflow-hidden mt-6">
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <ImageIcon className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-bold font-heading text-primary">Photo Selector</h3>
        </div>

        <Tabs defaultValue="professional" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="professional" className="flex items-center gap-2">
              <Briefcase className="w-4 h-4" /> Professional
            </TabsTrigger>
            <TabsTrigger value="dating" className="flex items-center gap-2">
              <Heart className="w-4 h-4" /> Dating
            </TabsTrigger>
          </TabsList>

          {Object.entries(PHOTOS).map(([category, images]) => (
            <TabsContent key={category} value={category} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {images.map((photo, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="relative aspect-[3/4] rounded-xl overflow-hidden bg-muted"
                  >
                    <img 
                      src={photo.src} 
                      alt={photo.alt}
                      loading="lazy"
                      className="object-cover w-full h-full"
                    />
                  </motion.div>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}
