import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, Zap, Heart, Calendar, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";

// Tech missions (for improving your skills + helping King of Delancey)
const techMissions = [
  "Improve one part of your King of Delancey chatbot",
  "Clean 25 files or photos off your phone",
  "Learn one new JavaScript trick for elazaros.com",
  "Organize your Replit projects for clarity",
  "Automate one repetitive task in your daily life",
  "Watch one productivity/tech video to expand your skills",
  "Update one feature on your website"
];

// Personal missions (your growth, confidence, health)
const personalMissions = [
  "Drink 3 bottles of water",
  "Send one message to build a new connection",
  "Clean one small area (desk, car, drawer)",
  "Read 3–5 pages of a book",
  "Go for a 10-minute walk",
  "Write one thing you're proud of today",
  "Do one thing that moves you closer to meeting a Jewish girl"
];

// Stress reset missions (for your real needs)
const stressResetMissions = [
  "2-minute deep breathing reset",
  "Take a 5-minute break with no phone",
  "Sit in silence for 1 minute and reset your mind",
  "Short stretch to calm your body",
  "Write down your biggest stress and delete it",
  "Do one grounding exercise: 5 things you see, 4 you feel, 3 you hear",
  "Let go of one thing not in your control today"
];

// Deterministic date-based random (FREE daily updates)
function seededRandom(seed: string) {
  let h = 1;
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(31, h) + seed.charCodeAt(i) | 0;
  }
  return (h >>> 0) / 4294967296;
}

function pickMission(list: string[], seedOffset: string) {
  const today = new Date().toISOString().split("T")[0];
  const r = seededRandom(today + seedOffset);
  return list[Math.floor(r * list.length)];
}

export function DailyMissions() {
  const [missions, setMissions] = useState<{tech: string, personal: string, stress: string} | null>(null);
  const [date, setDate] = useState("");
  const [completed, setCompleted] = useState<string[]>([]);

  useEffect(() => {
    setMissions({
      tech: pickMission(techMissions, "A"),
      personal: pickMission(personalMissions, "B"),
      stress: pickMission(stressResetMissions, "C")
    });
    
    const d = new Date();
    setDate(d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }));

    // Load completed state from local storage for today
    const today = new Date().toISOString().split("T")[0];
    const saved = localStorage.getItem(`missions_completed_${today}`);
    if (saved) {
      setCompleted(JSON.parse(saved));
    }
  }, []);

  const toggleComplete = (id: string) => {
    setCompleted(prev => {
      const newState = prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id];
      
      const today = new Date().toISOString().split("T")[0];
      localStorage.setItem(`missions_completed_${today}`, JSON.stringify(newState));
      return newState;
    });
  };

  if (!missions) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.5 }}
      className="w-full mt-12 max-w-5xl mx-auto"
    >
      <div className="flex items-center justify-between mb-6 px-2">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 p-2 rounded-lg">
            <RefreshCw className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold font-heading text-primary">Daily Missions</h2>
            <p className="text-xs text-muted-foreground">Personalized tasks to level up your day</p>
          </div>
        </div>
        <Badge variant="outline" className="font-mono bg-background/50 backdrop-blur-sm">{date}</Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Tech Mission */}
        <MissionCard 
          id="tech"
          title="Tech & Skills" 
          icon={Brain} 
          color="blue" 
          mission={missions.tech} 
          isCompleted={completed.includes("tech")}
          onToggle={() => toggleComplete("tech")}
        />

        {/* Personal Mission */}
        <MissionCard 
          id="personal"
          title="Personal Growth" 
          icon={Zap} 
          color="green" 
          mission={missions.personal} 
          isCompleted={completed.includes("personal")}
          onToggle={() => toggleComplete("personal")}
        />

        {/* Stress Reset Mission */}
        <MissionCard 
          id="stress"
          title="Stress Reset" 
          icon={Heart} 
          color="purple" 
          mission={missions.stress} 
          isCompleted={completed.includes("stress")}
          onToggle={() => toggleComplete("stress")}
        />
      </div>
    </motion.div>
  );
}

function MissionCard({ id, title, icon: Icon, color, mission, isCompleted, onToggle }: any) {
  const colors = {
    blue: "border-l-blue-500 text-blue-500 hover:border-blue-500",
    green: "border-l-green-500 text-green-500 hover:border-green-500",
    purple: "border-l-purple-500 text-purple-500 hover:border-purple-500"
  };
  
  const bgColors = {
    blue: "hover:bg-blue-500/5",
    green: "hover:bg-green-500/5",
    purple: "hover:bg-purple-500/5"
  };

  const checkColors = {
    blue: "bg-blue-500 border-blue-500",
    green: "bg-green-500 border-green-500",
    purple: "bg-purple-500 border-purple-500"
  };

  return (
    <Card 
      className={`bg-card border-l-4 transition-all duration-300 cursor-pointer group ${colors[color as keyof typeof colors].split(' ')[0]} ${bgColors[color as keyof typeof bgColors]} ${isCompleted ? 'opacity-60 grayscale-[0.5]' : 'shadow-sm hover:shadow-md'}`}
      onClick={onToggle}
    >
      <CardHeader className="pb-2 pt-4">
        <CardTitle className={`text-sm font-bold flex items-center gap-2 ${colors[color as keyof typeof colors].split(' ')[1]}`}>
          <Icon className="w-4 h-4" /> {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-3 items-start">
          <div className={`mt-1 h-5 w-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all duration-300 ${isCompleted ? checkColors[color as keyof typeof checkColors] : 'border-muted-foreground/30'}`}>
            {isCompleted && <motion.div initial={{scale: 0}} animate={{scale: 1}}><Icon className="w-3 h-3 text-white" /></motion.div>}
          </div>
          <p className={`font-medium text-sm leading-relaxed ${isCompleted ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
            {mission}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
