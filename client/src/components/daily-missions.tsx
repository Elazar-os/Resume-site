import { motion } from "framer-motion";
import { CheckCircle2, Clock, Zap, Users, Briefcase, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DAILY_MISSIONS } from "@/lib/data";
import { useState } from "react";
import { cn } from "@/lib/utils";

const iconMap: Record<string, any> = {
  Career: Briefcase,
  Social: Users,
  Energy: Zap,
};

const colorMap: Record<string, string> = {
  Career: "text-blue-500 bg-blue-500/10 border-blue-500/20",
  Social: "text-purple-500 bg-purple-500/10 border-purple-500/20",
  Energy: "text-amber-500 bg-amber-500/10 border-amber-500/20",
};

export function DailyMissions() {
  const [completed, setCompleted] = useState<number[]>([]);

  const toggleMission = (index: number) => {
    setCompleted(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  return (
    <Card className="border-none shadow-lg bg-card relative overflow-hidden">
      <div className="absolute top-0 right-0 p-24 bg-primary/5 rounded-full blur-3xl -mr-12 -mt-12 pointer-events-none" />
      
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="text-xl font-heading flex items-center gap-2">
              <Zap className="w-5 h-5 text-accent" /> 
              Daily Missions
            </CardTitle>
            <p className="text-xs text-muted-foreground font-medium">
              {completed.length}/{DAILY_MISSIONS.length} Completed
            </p>
          </div>
          <Badge variant="outline" className="font-mono text-xs">
            {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
          </Badge>
        </div>
        
        {/* Progress Bar */}
        <div className="h-1.5 w-full bg-secondary mt-3 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-accent"
            initial={{ width: 0 }}
            animate={{ width: `${(completed.length / DAILY_MISSIONS.length) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </CardHeader>

      <CardContent className="space-y-4 pt-4">
        {DAILY_MISSIONS.map((mission, index) => {
          const Icon = iconMap[mission.category] || Zap;
          const isDone = completed.includes(index);
          const colorClass = colorMap[mission.category] || "text-primary bg-primary/10";

          return (
            <motion.div 
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => toggleMission(index)}
              className={cn(
                "group flex items-start gap-3 p-3 rounded-xl border transition-all duration-200 cursor-pointer hover:shadow-md",
                isDone 
                  ? "bg-secondary/50 border-transparent opacity-60" 
                  : "bg-background border-border hover:border-accent/30"
              )}
            >
              <div className={cn("p-2 rounded-lg shrink-0 mt-0.5 transition-colors", isDone ? "bg-muted text-muted-foreground" : colorClass)}>
                <Icon className="w-4 h-4" />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className={cn("font-bold text-sm truncate", isDone && "line-through text-muted-foreground")}>
                    {mission.title}
                  </h4>
                  <Badge variant="secondary" className="text-[10px] h-5 px-1.5 font-mono shrink-0">
                    {mission.duration}
                  </Badge>
                </div>
                <p className={cn("text-xs text-muted-foreground leading-snug", isDone && "line-through")}>
                  {mission.description}
                </p>
              </div>

              <div className={cn(
                "w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-1 transition-colors",
                isDone 
                  ? "bg-green-500 border-green-500 text-white" 
                  : "border-muted-foreground/30 group-hover:border-accent"
              )}>
                {isDone && <CheckCircle2 className="w-3 h-3" />}
              </div>
            </motion.div>
          );
        })}
      </CardContent>
    </Card>
  );
}
