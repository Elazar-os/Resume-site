import { motion } from "framer-motion";
import { Mail, Phone, MapPin, User, Star, Zap, Target, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RESUME_DATA, PROFILE_SUMMARY } from "@/lib/data";
import ResumePage from "./resume-page";
import ShidduchPage from "./shidduch-page";

// Extracting the content parts from the pages to avoid full page duplication if we were to refactor, 
// but for now we will just reuse the structure or simplify. 
// Actually, reusing the pages as components might duplicate the sidebar.
// Let's create a combined view that just renders the tabs in the main area and a shared sidebar.

export default function CombinedPage() {
  // We'll use the ResumePage component's internal structure but wrapped in tabs.
  // Since we can't easily import "partial" components without refactoring, 
  // I will copy the relevant Tab logic from the previous home.tsx which I have in memory/history.
  // Wait, I can just import the data and rebuild the layout.

  return (
    <div className="min-h-screen bg-background font-sans selection:bg-primary/10 selection:text-primary">
        {/* To save time and code, we are essentially re-implementing the "Home" component from the previous step 
            which already had the tabs. I will just restore that logic here. */}
        <TabsView />
    </div>
  );
}

import { Briefcase, Award, Heart, GraduationCap, CheckCircle2, BookOpen, Users, Hash } from "lucide-react";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { SHIDDUCH_DATA } from "@/lib/data";
import { DailyMissions } from "@/components/daily-missions";
import { PhotoGallery } from "@/components/photo-gallery";
import { ShareProfile } from "@/components/share-profile";

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

import { CalmReset } from "@/components/calm-reset";

import { JSwipeProfile } from "@/components/jswipe-profile";

function TabsView() {
    return (
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

                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
                        <Hash className="w-3 h-3" /> Identity Tags
                      </h3>
                      <div className="flex flex-wrap gap-1.5">
                        {PROFILE_SUMMARY.tags.map((tag, i) => (
                          <Badge key={i} variant="secondary" className="text-[10px] px-2 py-0.5 bg-secondary/40 hover:bg-accent hover:text-accent-foreground transition-colors cursor-default">
                            {tag}
                          </Badge>
                        ))}
                      </div>
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
                  
                  <div className="px-6 pb-2">
                    <ShareProfile />
                  </div>

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

              {/* Photo Gallery Widget */}
              <PhotoGallery />

              {/* Calm Reset Button */}
              <CalmReset />

            </div>
          </motion.aside>

          {/* Main Content (Right Column) */}
          <main className="lg:col-span-8 pt-6 lg:pt-0">
            <Tabs defaultValue="professional" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="professional">Professional</TabsTrigger>
                <TabsTrigger value="personal">Shidduch</TabsTrigger>
                <TabsTrigger value="jswipe">JSwipe Card</TabsTrigger>
              </TabsList>

              {/* PROFESSIONAL TAB */}
              <TabsContent value="professional" className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
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
              </TabsContent>

              {/* PERSONAL / SHIDDUCH TAB */}
              <TabsContent value="personal" className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                
                <Card className="border-none shadow-sm bg-card">
                  <CardContent className="p-6 md:p-10 space-y-8">
                    
                    {/* Header */}
                    <div className="space-y-4 text-center">
                      <h2 className="text-3xl font-bold font-heading text-primary">{SHIDDUCH_DATA.basics.name}</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-lg text-muted-foreground max-w-lg mx-auto">
                         <div>Age: {SHIDDUCH_DATA.basics.age}</div>
                         <div>DOB: {SHIDDUCH_DATA.basics.dob}</div>
                         <div>Height: {SHIDDUCH_DATA.basics.height}</div>
                         <div>Location: {SHIDDUCH_DATA.basics.location}</div>
                      </div>
                    </div>

                    <Separator />

                    {/* Family */}
                    <section className="space-y-4">
                       <h3 className="text-xl font-bold text-primary uppercase tracking-wide border-b pb-2">Family Information</h3>
                       <div className="space-y-2 text-base md:text-lg">
                          <p><span className="font-semibold text-primary/80">Father:</span> {SHIDDUCH_DATA.family.father}</p>
                          <p><span className="font-semibold text-primary/80">Mother:</span> {SHIDDUCH_DATA.family.mother}</p>
                          
                          <div className="pt-2">
                             <span className="font-semibold text-primary/80 block mb-1">Siblings:</span>
                             <ul className="list-disc list-inside space-y-1 pl-2 text-muted-foreground">
                                {SHIDDUCH_DATA.family.siblings.map((sibling, i) => (
                                   <li key={i}>{sibling}</li>
                                ))}
                             </ul>
                          </div>
                       </div>
                    </section>

                    <Separator />

                    {/* Education */}
                    <section className="space-y-4">
                       <h3 className="text-xl font-bold text-primary uppercase tracking-wide border-b pb-2">Education</h3>
                       <ul className="list-disc list-inside space-y-2 text-base md:text-lg text-muted-foreground">
                          {SHIDDUCH_DATA.education.map((edu, i) => (
                             <li key={i}>{edu}</li>
                          ))}
                       </ul>
                    </section>

                    <Separator />

                    {/* Occupation */}
                    <section className="space-y-4">
                       <h3 className="text-xl font-bold text-primary uppercase tracking-wide border-b pb-2">Current Occupation</h3>
                       <div className="space-y-2 text-base md:text-lg">
                          <p className="font-medium text-primary">{SHIDDUCH_DATA.occupation.title}</p>
                          <p className="text-muted-foreground">Employer Reference: {SHIDDUCH_DATA.occupation.reference}</p>
                       </div>
                    </section>

                    <Separator />

                    {/* References */}
                    <section className="space-y-4">
                       <h3 className="text-xl font-bold text-primary uppercase tracking-wide border-b pb-2">References</h3>
                       <ul className="list-disc list-inside space-y-2 text-base md:text-lg text-muted-foreground">
                          {SHIDDUCH_DATA.references.map((ref, i) => (
                             <li key={i}>{ref}</li>
                          ))}
                       </ul>
                    </section>

                  </CardContent>
                </Card>

              </TabsContent>

              {/* JSWIPE TAB */}
              <TabsContent value="jswipe" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                 <div className="flex flex-col items-center space-y-6">
                    <div className="text-center space-y-2">
                       <h2 className="text-2xl font-bold font-heading text-primary">Quick Resume Card</h2>
                       <p className="text-muted-foreground">A snapshot view of everything important.</p>
                    </div>
                    <JSwipeProfile />
                 </div>
              </TabsContent>
            </Tabs>
          </main>
        </motion.div>
      </div>
    );
}
