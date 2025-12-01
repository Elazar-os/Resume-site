import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, Heart } from "lucide-react";
import { motion, useAnimation, PanInfo, useMotionValue, useTransform } from "framer-motion";
import { useState } from "react";
import { AnimatePresence } from "framer-motion";

export function JSwipeProfile() {
  const controls = useAnimation();
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-10, 10]);
  const opacity = useTransform(x, [-200, -150, 0, 150, 200], [0, 1, 1, 1, 0]);
  const [showMatch, setShowMatch] = useState(false);

  const resetCard = async () => {
    await controls.start({ x: 0, opacity: 1, rotate: 0, transition: { duration: 0.5 } });
    x.set(0);
  };

  const handleDragEnd = async (event: any, info: PanInfo) => {
    const offset = info.offset.x;
    const velocity = info.velocity.x;

    if (offset > 100 || velocity > 500) {
      handleSwipe("right");
    } else if (offset < -100 || velocity < -500) {
      handleSwipe("left");
    } else {
      resetCard();
    }
  };

  const handleSwipe = async (direction: "left" | "right") => {
    const targetX = direction === "right" ? 500 : -500;
    
    await controls.start({
      x: targetX,
      opacity: 0,
      rotate: direction === "right" ? 20 : -20,
      transition: { duration: 0.4 }
    });

    if (direction === "right") {
      setShowMatch(true);
      setTimeout(() => {
        setShowMatch(false);
        resetCard();
      }, 2000);
    } else {
      setTimeout(() => {
        resetCard();
      }, 500); // Quick reset for left swipe
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4 relative">
      {/* Match Popup Overlay */}
      <AnimatePresence>
        {showMatch && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={() => setShowMatch(false)}
          >
            <div className="bg-white text-center p-8 rounded-3xl shadow-2xl max-w-sm mx-auto transform rotate-2">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-10 h-10 text-green-600 fill-green-600" />
              </div>
              <h2 className="text-3xl font-bold text-slate-900 mb-2 font-heading">It's a Match!</h2>
              <p className="text-slate-600 text-lg">You matched with Elazar Greisman</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        onDragEnd={handleDragEnd}
        animate={controls}
        style={{ x, rotate, opacity }}
        className="touch-none cursor-grab active:cursor-grabbing z-10"
      >
        <Card className="w-[380px] bg-[#101b2d] text-slate-100 border-none shadow-2xl overflow-hidden rounded-[18px] select-none">
          {/* Photo Area */}
          <div className="h-[420px] bg-black relative pointer-events-none">
            <img 
              src="/photos/dating-1.png" 
              alt="Profile Photo" 
              loading="lazy"
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#101b2d] to-transparent h-24" />
          </div>

          <CardContent className="p-5 space-y-5 relative z-10 -mt-4">
            {/* Header */}
            <div>
              <div className="text-2xl font-bold text-white">Elazar Greisman</div>
              <div className="text-lg text-slate-300">22 • 5'5" • Passaic, NJ</div>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-sm font-bold text-slate-400 mb-1.5 uppercase tracking-wide">Contact</h3>
              <div className="text-sm mb-1"><span className="font-semibold text-slate-300">Phone:</span> 201-321-6587</div>
              <div className="text-sm mb-1"><span className="font-semibold text-slate-300">Email:</span> elazar.greisman@outlook.com</div>
            </div>

            {/* Parents */}
            <div>
              <h3 className="text-sm font-bold text-slate-400 mb-1.5 uppercase tracking-wide">Parents</h3>
              <div className="text-sm mb-1"><span className="font-semibold text-slate-300">Father:</span> Moshie Greisman — Tax Lawyer</div>
              <div className="text-sm mb-1"><span className="font-semibold text-slate-300">Mother:</span> Elisheva Greisman — Teacher</div>
            </div>

            {/* Siblings */}
            <div>
              <h3 className="text-sm font-bold text-slate-400 mb-1.5 uppercase tracking-wide">Siblings</h3>
              <ul className="text-sm space-y-1">
                <li>• Esther Baila (24) — Married, Software Developer</li>
                <li>• Hillel (21) — Single, Car Sales & Auto Leasing</li>
                <li>• Shloimy (17) — Mesivta Toras Maier</li>
                <li>• Perri (14) — Bais Yaakov D'Rav Hirsch</li>
              </ul>
            </div>

            {/* Education */}
            <div>
              <h3 className="text-sm font-bold text-slate-400 mb-1.5 uppercase tracking-wide">Education</h3>
              <ul className="text-sm space-y-1">
                <li>• Mesivta of North Jersey</li>
                <li>• Yeshiva Tiferes Avner</li>
                <li>• Mesivta of Las Vegas</li>
                <li>• Morning Kollel — Yeshivas Ner Baruch</li>
              </ul>
            </div>

            {/* Work */}
            <div>
              <h3 className="text-sm font-bold text-slate-400 mb-1.5 uppercase tracking-wide">Work</h3>
              <div className="text-sm">General Manager — King of Delancey</div>
            </div>

            {/* References */}
            <div>
              <h3 className="text-sm font-bold text-slate-400 mb-1.5 uppercase tracking-wide">References</h3>
              <ul className="text-sm space-y-1">
                <li>Daniel Mayer (Employer): 201-988-6929</li>
                <li>Ronit Gottesman (Family Friend): 908-303-4261</li>
                <li>Rabbi Baruch Bodenheim (Rav): 862-371-3186</li>
              </ul>
            </div>

            <div className="text-xs text-slate-500 text-center pt-4 opacity-60">
              Private parody page — not a real dating profile.
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Swipe Buttons */}
      <div className="flex items-center gap-6 mt-4 pb-8 z-20">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={() => handleSwipe("left")}
          className="w-16 h-16 rounded-full border-4 border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all duration-300 shadow-lg bg-[#101b2d]"
        >
          <X className="w-8 h-8" />
        </Button>
        <Button 
          variant="outline" 
          size="icon" 
          onClick={() => handleSwipe("right")}
          className="w-16 h-16 rounded-full border-4 border-green-500/20 text-green-500 hover:bg-green-500 hover:text-white hover:border-green-500 transition-all duration-300 shadow-lg bg-[#101b2d]"
        >
          <Heart className="w-8 h-8 fill-current" />
        </Button>
      </div>
    </div>
  );
}
