import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Award, Briefcase, GraduationCap, Heart, ArrowRight, CheckCircle2, User, Star, Zap, Target, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { RESUME_DATA, PROFILE_SUMMARY } from "@/lib/data";
import { TopNavigation } from "@/components/top-navigation";

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

export default function ResumePage() {
  return (
    <div className="min-h-screen bg-background font-sans selection:bg-primary/10 selection:text-primary">
      <TopNavigation />
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
                     <div className="w-24 h-24 rounded-full border-4 border-card bg-muted flex items-center justify-center shadow-md overflow-hidden photo-hover">
                        <img src="/photos/dating-1.png" alt="Profile" loading="lazy" className="w-full h-full object-cover" />
                     </div>
                  </div>
                </div>
                <CardContent className="pt-16 pb-6 px-6 text-center space-y-6">
                  <div>
                    <h1 className="text-2xl font-bold font-heading text-primary">{RESUME_DATA.personalInfo.name}</h1>
                    <p className="text-sm font-medium text-accent mt-1">{RESUME_DATA.personalInfo.title}</p>
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
                        <Zap className="w-3 h-3" /> Top Strengths
                      </h3>
                      <div className="space-y-3">
                        {PROFILE_SUMMARY.strengths.map((s, i) => (
                          <div key={i} className="space-y-1">
                            <div className="flex justify-between text-xs font-medium">
                              <span>{s.name}</span>
                            </div>
                            <Progress value={s.level} className="h-1.5" />
                          </div>
                        ))}
                      </div>
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

                     <div className="pt-2">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-2">
                        <Target className="w-3 h-3" /> Current Focus
                      </h3>
                      <Badge variant="outline" className="w-full justify-center py-1.5 font-normal text-foreground bg-background">
                        {PROFILE_SUMMARY.focus}
                      </Badge>
                    </div>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <a href={`mailto:${RESUME_DATA.personalInfo.email}`} className="flex flex-col items-center gap-1 p-2 rounded hover:bg-secondary transition-colors text-muted-foreground hover:text-primary">
                      <Mail className="w-4 h-4" />
                      Email
                    </a>
                    <a href={`tel:${RESUME_DATA.personalInfo.phone.replace(/\s/g, '')}`} className="flex flex-col items-center gap-1 p-2 rounded hover:bg-secondary transition-colors text-muted-foreground hover:text-primary">
                      <Phone className="w-4 h-4" />
                      Phone
                    </a>
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
                {/* Summary */}
                <motion.section variants={itemVariants} className="space-y-4">
                  <div className="flex items-center justify-between border-b pb-2">
                    <h2 className="text-2xl font-bold font-heading text-primary">Professional Summary</h2>
                    <Badge variant="secondary" className="text-xs font-mono">Updated 2025</Badge>
                  </div>
                  <p className="text-base md:text-lg leading-relaxed text-muted-foreground">
                    {RESUME_DATA.summary}
                  </p>
                </motion.section>

                {/* Experience */}
                <motion.section variants={itemVariants} className="space-y-6">
                  <h2 className="text-2xl font-bold font-heading text-primary border-b pb-2 flex items-center gap-2">
                    <Briefcase className="w-6 h-6 text-accent" /> Experience
                  </h2>
                  
                  <div className="space-y-8">
                    {RESUME_DATA.experience.map((job, index) => (
                      <div key={index} className="relative pl-4 border-l-2 border-muted hover:border-accent transition-colors duration-300">
                        <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-background border-2 border-accent" />
                        
                        <div className="space-y-1 mb-4">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                            <h3 className="text-xl font-bold text-primary">{job.role}</h3>
                            <span className="text-sm font-mono text-muted-foreground bg-secondary px-2 py-1 rounded">{job.dates}</span>
                          </div>
                          <p className="text-lg font-medium text-accent">{job.company}</p>
                          <p className="text-sm text-muted-foreground">{job.location}</p>
                        </div>

                        <ul className="space-y-3">
                          {job.achievements.map((achievement, i) => (
                            <li key={i} className="flex items-start gap-3 text-muted-foreground">
                              <CheckCircle2 className="w-5 h-5 text-primary/40 shrink-0 mt-0.5" />
                              <span>{achievement}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </motion.section>

                {/* Skills Grid */}
                <motion.section variants={itemVariants} className="space-y-6">
                    <h2 className="text-2xl font-bold font-heading text-primary border-b pb-2 flex items-center gap-2">
                      <Award className="w-6 h-6 text-accent" /> Skills & Expertise
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {RESUME_DATA.skills.map((skill, index) => (
                        <div key={index} className="flex items-center gap-2 p-3 rounded-lg bg-secondary/30 border border-transparent hover:border-accent/20 transition-colors">
                          <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                          <span className="text-sm font-medium text-foreground/80">{skill}</span>
                        </div>
                      ))}
                    </div>
                </motion.section>

                {/* Volunteer / Other */}
                <motion.section variants={itemVariants} className="space-y-6">
                  <h2 className="text-2xl font-bold font-heading text-primary border-b pb-2 flex items-center gap-2">
                    <Heart className="w-6 h-6 text-accent" /> Volunteer & Leadership
                  </h2>
                  
                  <div className="grid gap-6 md:grid-cols-2">
                    {RESUME_DATA.otherExperience.map((role, index) => (
                      <Card key={index} className="bg-secondary/30 border-none shadow-sm hover:shadow-md transition-shadow">
                        <CardContent className="p-5 space-y-3">
                          <div>
                            <h3 className="font-bold text-primary">{role.role}</h3>
                            <p className="text-sm text-accent font-medium">{role.organization}</p>
                          </div>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {role.description}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </motion.section>
                
                {/* Education */}
                <motion.section variants={itemVariants} className="space-y-6">
                  <h2 className="text-2xl font-bold font-heading text-primary border-b pb-2 flex items-center gap-2">
                      <GraduationCap className="w-6 h-6 text-accent" /> Education
                    </h2>
                    <div className="p-4 rounded-lg border bg-card">
                      <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-bold text-primary">{RESUME_DATA.education.school}</h3>
                            <p className="text-muted-foreground">{RESUME_DATA.education.degree}</p>
                          </div>
                          <div className="text-right text-sm text-muted-foreground">
                            <p>{RESUME_DATA.education.year}</p>
                            <p>{RESUME_DATA.education.location}</p>
                          </div>
                      </div>
                    </div>
                </motion.section>
            </div>
          </main>
        </motion.div>
      </div>
    </div>
  );
}
