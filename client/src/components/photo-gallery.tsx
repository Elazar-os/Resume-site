import { motion } from "framer-motion";
import { Image as ImageIcon, User, Briefcase, Heart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const PHOTOS = {
  professional: [
    {
      src: "/photos/pro-1.png",
      alt: "Suit & Jacket",
      tags: ["Formal", "Executive", "Serious"],
      rating: "Top Pick"
    },
    {
      src: "/photos/pro-2.png",
      alt: "Clean Button Down",
      tags: ["Smart Casual", "Approachable", "Clean"],
      rating: "Strong"
    },
    {
      src: "/photos/pro-3.png",
      alt: "Checked Shirt Smile",
      tags: ["Friendly", "Daily Wear", "Warm"],
      rating: "Good"
    }
  ],
  dating: [
    {
      src: "/photos/dating-1.png",
      alt: "Warm Smile",
      tags: ["Profile Pic", "Inviting", "Confident"],
      rating: "Best Profile"
    },
    {
      src: "/photos/dating-2.png",
      alt: "Candid Laughing",
      tags: ["Authentic", "Personality", "Joy"],
      rating: "Personality"
    },
    {
      src: "/photos/dating-3.png",
      alt: "Vacation Vibe",
      tags: ["Fun", "Relaxed", "Travel"],
      rating: "Variety"
    }
  ]
};

export function PhotoGallery() {
  return (
    <Card className="border-none shadow-lg bg-card overflow-hidden mt-6">
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <ImageIcon className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-bold font-heading text-primary">Photo Selector</h3>
          <div className="ml-auto">
            <a href="/#/photo-selector" className="text-xs bg-primary text-primary-foreground px-3 py-1.5 rounded-full hover:bg-primary/90 transition-colors font-medium flex items-center gap-1">
              <User className="w-3 h-3" /> Smart AI Selector
            </a>
          </div>
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
                    className="group relative aspect-[3/4] rounded-xl overflow-hidden bg-muted"
                  >
                    <img 
                      src={photo.src} 
                      alt={photo.alt}
                      loading="lazy"
                      className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                      <div className="flex flex-wrap gap-1 mb-2">
                        {photo.tags.map(tag => (
                          <Badge key={tag} variant="secondary" className="text-[10px] h-5 bg-white/20 text-white border-none backdrop-blur-sm">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <p className="text-white text-xs font-medium">{photo.alt}</p>
                    </div>
                    <Badge className="absolute top-2 right-2 bg-primary/90 text-[10px]">
                      #{index + 1}
                    </Badge>
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
