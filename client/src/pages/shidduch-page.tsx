import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Award, Briefcase, GraduationCap, Heart, ArrowRight, CheckCircle2, User, Star, Zap, Target, Sparkles, BookOpen, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { RESUME_DATA, PROFILE_SUMMARY, SHIDDUCH_DATA } from "@/lib/data";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { type: "spring" as const, stiffness: 50 }
  }
};

export default function ShidduchPage() {
  return (
    <div className="min-h-screen bg-background font-sans selection:bg-primary/10 selection:text-primary">
      <div className="max-w-6xl mx-auto p-4 md:p-8 lg:p-12">
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8"
        >
          {/* Profile Summary Card (Left Column) */}
          <motion.aside variants={itemVariants} className="lg:col-span-4 space-y-6">
            <div className="lg:sticky lg:top-12 space-y-6">
              
              <Card className="overflow-hidden border-none shadow-xl bg-card">
                <div className="h-32 bg-gradient-to-br from-primary to-accent relative">
                  <div className="absolute -bottom-12 left-1/2 -translate-x-1/2">
                     <div className="w-24 h-24 rounded-full border-4 border-card bg-muted flex items-center justify-center shadow-md">
                        <User className="w-10 h-10 text-muted-foreground" />
                     </div>
                  </div>
                </div>
                <CardContent className="pt-16 pb-6 px-6 text-center space-y-6">
                  <div>
                    <h1 className="text-2xl font-bold font-heading text-primary">{RESUME_DATA.personalInfo.name}</h1>
                    <p className="text-sm font-medium text-accent mt-1">Personal Profile</p>
                  </div>

                  <div className="space-y-4 text-left">
                    <div className="bg-secondary/50 rounded-lg p-4">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-2">
                        <Sparkles className="w-3 h-3" /> Identity Snapshot
                      </h3>
                      <p className="text-sm text-foreground/80 leading-relaxed">
                        {PROFILE_SUMMARY.identity}
                      </p>
                    </div>

                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
                        <Star className="w-3 h-3" /> Highlights
                      </h3>
                      <ul className="space-y-2">
                        {PROFILE_SUMMARY.highlights.map((h, i) => (
                          <li key={i} className="text-sm flex items-start gap-2 text-muted-foreground">
                            <div className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 shrink-0" />
                            {h}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <a href={`mailto:${RESUME_DATA.personalInfo.email}`} className="flex flex-col items-center gap-1 p-2 rounded hover:bg-secondary transition-colors text-muted-foreground hover:text-primary">
                      <Mail className="w-4 h-4" />
                      Email
                    </a>
                    <div className="flex flex-col items-center gap-1 p-2 rounded text-muted-foreground">
                      <Phone className="w-4 h-4" />
                      Phone
                    </div>
                     <div className="flex flex-col items-center gap-1 p-2 rounded text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      NJ
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.aside>

          {/* Main Content (Right Column) */}
          <main className="lg:col-span-8 pt-6 lg:pt-0">
              <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                
                {/* Intro Header */}
                <motion.section variants={itemVariants} className="bg-accent/5 p-6 rounded-xl border border-accent/10">
                   <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                         <h2 className="text-2xl font-bold font-heading text-primary">Personal Profile</h2>
                         <p className="text-muted-foreground mt-1">Age {SHIDDUCH_DATA.basics.age} • {SHIDDUCH_DATA.basics.location}</p>
                      </div>
                      <div className="text-right hidden md:block">
                        <p className="text-sm font-medium text-primary">Hebrew Name</p>
                        <p className="text-lg font-heading text-accent">{SHIDDUCH_DATA.basics.hebrewName}</p>
                      </div>
                   </div>
                </motion.section>

                {/* Hashkafa & Personality */}
                <motion.section variants={itemVariants} className="space-y-6">
                   <h2 className="text-xl font-bold font-heading text-primary border-b pb-2 flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-accent" /> Hashkafa & Values
                   </h2>
                   <div className="grid gap-6 md:grid-cols-2">
                      <Card className="bg-card border-none shadow-sm">
                         <CardHeader>
                            <CardTitle className="text-lg">Hashkafa</CardTitle>
                         </CardHeader>
                         <CardContent className="space-y-4">
                            <Badge variant="secondary" className="mb-2">{SHIDDUCH_DATA.hashkafa.style}</Badge>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                               {SHIDDUCH_DATA.hashkafa.values}
                            </p>
                         </CardContent>
                      </Card>
                      <Card className="bg-card border-none shadow-sm">
                         <CardHeader>
                            <CardTitle className="text-lg">Personality</CardTitle>
                         </CardHeader>
                         <CardContent>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                               {SHIDDUCH_DATA.hashkafa.personality}
                            </p>
                         </CardContent>
                      </Card>
                   </div>
                </motion.section>

                {/* Yeshiva Education */}
                <motion.section variants={itemVariants} className="space-y-6">
                   <h2 className="text-xl font-bold font-heading text-primary border-b pb-2 flex items-center gap-2">
                      <GraduationCap className="w-5 h-5 text-accent" /> Yeshiva Education
                   </h2>
                   <div className="space-y-4">
                      {SHIDDUCH_DATA.education.map((edu, i) => (
                         <div key={i} className="flex items-center justify-between p-4 bg-secondary/20 rounded-lg border border-transparent hover:border-accent/20 transition-colors">
                            <div>
                               <h3 className="font-bold text-primary">{edu.name}</h3>
                               {edu.notes && <p className="text-xs text-muted-foreground mt-1">{edu.notes}</p>}
                            </div>
                            <Badge variant="outline">{edu.type}</Badge>
                         </div>
                      ))}
                   </div>
                </motion.section>

                {/* Family */}
                <motion.section variants={itemVariants} className="space-y-6">
                   <h2 className="text-xl font-bold font-heading text-primary border-b pb-2 flex items-center gap-2">
                      <Users className="w-5 h-5 text-accent" /> Family Background
                   </h2>
                   <Card className="bg-primary/5 border-none">
                      <CardContent className="p-6 space-y-2">
                         <p className="font-medium text-primary text-lg">Parents: {SHIDDUCH_DATA.family.father} & {SHIDDUCH_DATA.family.mother}</p>
                         <p className="text-muted-foreground">{SHIDDUCH_DATA.family.description}</p>
                      </CardContent>
                   </Card>
                </motion.section>

                {/* Looking For */}
                 <motion.section variants={itemVariants} className="space-y-6">
                   <h2 className="text-xl font-bold font-heading text-primary border-b pb-2 flex items-center gap-2">
                      <Target className="w-5 h-5 text-accent" /> What I'm Looking For
                   </h2>
                   <div className="bg-accent/10 p-6 rounded-xl border border-accent/20">
                      <p className="text-lg leading-relaxed text-primary/90 font-medium italic">
                         "{SHIDDUCH_DATA.lookingFor}"
                      </p>
                   </div>
                </motion.section>

              </div>
          </main>
        </motion.div>
      </div>
    </div>
  );
}
