import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wind, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function CalmReset() {
  const [isOpen, setIsOpen] = useState(false);
  const [phase, setPhase] = useState<"inhale" | "hold" | "exhale">("inhale");
  const [timeLeft, setTimeLeft] = useState(60);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    let timer: NodeJS.Timeout;

    if (isOpen) {
      // Reset state
      setPhase("inhale");
      setTimeLeft(60);

      // Breathing cycle logic
      const cycleBreath = () => {
        setPhase("inhale");
        setTimeout(() => {
            if (!isOpen) return;
            setPhase("hold");
            setTimeout(() => {
                if (!isOpen) return;
                setPhase("exhale");
            }, 4000); // Hold for 4s
        }, 4000); // Inhale for 4s
      };

      // Start first cycle
      cycleBreath();
      
      // Loop cycles every 12 seconds (4+4+4)
      interval = setInterval(cycleBreath, 12000);

      // Countdown timer
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsOpen(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      clearInterval(interval);
      clearInterval(timer);
    };
  }, [isOpen]);

  return (
    <>
      <Card className="border-none shadow-md bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 mt-6 cursor-pointer hover:shadow-lg transition-all group" onClick={() => setIsOpen(true)}>
        <CardContent className="p-4 flex items-center gap-4">
          <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Wind className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h3 className="font-bold text-blue-900 dark:text-blue-100">Calm Reset</h3>
            <p className="text-xs text-blue-700/70 dark:text-blue-300/70">1-minute stress relief</p>
          </div>
        </CardContent>
      </Card>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/95 backdrop-blur-sm"
          >
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 h-12 w-12 rounded-full hover:bg-muted/50"
              onClick={() => setIsOpen(false)}
            >
              <X className="w-6 h-6" />
            </Button>

            <div className="relative flex flex-col items-center justify-center w-full max-w-md aspect-square">
              {/* Breathing Circle */}
              <motion.div
                animate={{
                  scale: phase === "inhale" ? 1.5 : phase === "hold" ? 1.5 : 1,
                  opacity: phase === "inhale" ? 0.8 : phase === "hold" ? 0.8 : 0.4,
                }}
                transition={{
                  duration: 4,
                  ease: "easeInOut",
                }}
                className="w-48 h-48 rounded-full bg-blue-400/30 dark:bg-blue-500/30 blur-3xl absolute"
              />
              
              <motion.div
                animate={{
                  scale: phase === "inhale" ? 1.2 : phase === "hold" ? 1.2 : 1,
                }}
                transition={{
                  duration: 4,
                  ease: "easeInOut",
                }}
                className="w-32 h-32 rounded-full bg-blue-500 flex items-center justify-center shadow-[0_0_60px_rgba(59,130,246,0.5)] relative z-10"
              >
                <span className="text-white font-medium text-lg">
                    {phase === "inhale" && "Inhale"}
                    {phase === "hold" && "Hold"}
                    {phase === "exhale" && "Exhale"}
                </span>
              </motion.div>

              <motion.p 
                key={phase}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-12 text-2xl font-light text-muted-foreground text-center"
              >
                {phase === "inhale" && "Breathe in slowly..."}
                {phase === "hold" && "Hold your breath..."}
                {phase === "exhale" && "Release deeply..."}
              </motion.p>
            </div>

            <div className="absolute bottom-12 flex flex-col items-center gap-2">
                <p className="text-sm font-mono text-muted-foreground">Auto-close in {timeLeft}s</p>
                <Button variant="outline" onClick={() => setIsOpen(false)} className="mt-4">
                    End Session
                </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
