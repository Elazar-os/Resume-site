import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Award, Briefcase, GraduationCap, Heart, ArrowRight, CheckCircle2, User, Star, Zap, Target, Sparkles, BookOpen, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const RESUME_DATA = {
  personalInfo: {
    name: "Elazar Greisman",
    title: "Restaurant Operations & Management Specialist",
    email: "elazar.greisman@outlook.com",
    phone: "201 321 6587",
    location: "Passaic, NJ",
  },
  summary: "Dedicated management professional with 3+ years of experience driving efficiency and service excellence in the food service industry. Proven expertise in team leadership, inventory control, and customer relations, consistently delivering operational improvements. Committed to fostering positive environments that enhance both staff performance and guest satisfaction.",
  skills: [
    "Team Leadership",
    "Inventory Management",
    "Operational Efficiency",
    "Customer Relations",
    "Staff Training",
    "Procurement",
    "Vendor Relations",
    "Schedule Management",
    "Conflict Resolution",
    "Quality Assurance"
  ],
  experience: [
    {
      company: "King of Delancey Restaurant",
      role: "Manager",
      dates: "June 2022 – May 2025",
      location: "Passaic, NJ",
      achievements: [
        "Orchestrated daily restaurant operations, ensuring strict adherence to service standards and food quality protocols.",
        "Directed front- and back-of-house teams, managing schedules and optimizing staff allocation for peak efficiency.",
        "Streamlined procurement processes and inventory control, significantly reducing waste and maintaining cost-effectiveness.",
        "Cultivated lasting customer relationships to drive repeat business and elevate overall guest satisfaction.",
      ]
    },
    {
      company: "King of Delancey Restaurant",
      role: "Assistant Manager",
      dates: "January 2022 – June 2022",
      location: "Passaic, NJ",
      achievements: [
        "Assisted in training new hires and implementing operational improvements to streamline service flow.",
        "Supported senior management in daily oversight, administrative tasks, and conflict resolution.",
      ]
    }
  ],
  otherExperience: [
    {
      role: "Study Program Coordinator",
      organization: "Volunteer",
      description: "Founded and coordinated a community study group, managing scheduling and learning materials to ensure consistent participation."
    },
    {
      role: "Lifeguard/Swim Instructor",
      organization: "Part Time",
      description: "Instructed individuals in swimming techniques and water safety while enforcing rigorous pool regulations."
    }
  ],
  education: {
    school: "Mesivta North Jersey",
    degree: "High School Diploma",
    year: "2021",
    location: "Passaic, NJ"
  },
  careerGoal: "Eager to leverage extensive operations and management experience to drive growth and efficiency in a dynamic new role. Committed to delivering exceptional results through strategic leadership and process optimization."
};

const SHIDDUCH_DATA = {
  basics: {
    age: 23,
    hebrewName: "Elazar",
    location: "Passaic, NJ"
  },
  education: [
    { name: "Yeshiva Tiferes Avner", type: "Beis Medrash" },
    { name: "Mesivta of Las Vegas", type: "Beis Medrash Program" },
    { name: "Yeshivas Ner Boruch PTI", type: "Morning Kollel" },
    { name: "Mesivta of North Jersey", type: "High School", notes: "Graduated with strong commitment to learning" }
  ],
  hashkafa: {
    style: "Modern Orthodox / Modern Yeshivish balance",
    values: "Values Torah learning, personal growth, community, and building a home rooted in warmth and authenticity.",
    personality: "Grounded, thoughtful, emotionally aware, and easy to talk to. Hardworking with a growth mindset — committed to self-development spiritually and professionally. Friendly, responsible, enjoys meaningful conversation."
  },
  family: {
    father: "Moshe Greisman",
    mother: "Elisheva Greisman",
    description: "Respected family in the Passaic community, warm home, strong values."
  },
  lookingFor: "A kind, sincere, and growth-oriented woman who values family, connection, and building a warm Jewish home. Someone emotionally mature, positive, supportive, and excited about building a future of teamwork, communication, and shared values."
};

const PROFILE_SUMMARY = {
  identity: "A high-energy hospitality leader and dedicated ben Torah who thrives on efficiency, connection, and growth. Whether orchestrating a busy dinner service, learning in morning seder, or coordinating community study groups, I bring structure, warmth, and a drive for excellence. I balance high-stakes operational focus with a genuine passion for people and Torah values.",
  strengths: [
    { name: "Operational Strategy", level: 90 },
    { name: "Team Building", level: 95 },
    { name: "Crisis Management", level: 85 },
    { name: "Community Leadership", level: 90 },
    { name: "Mentorship", level: 80 }
  ],
  highlights: [
    "Founded a local study network",
    "Certified Swim Instructor & Lifeguard",
    "3+ Years in Restaurant Management",
    "Active Morning Kollel Member",
    "Aspiring Tech Professional"
  ],
  focus: "Building a career in Tech/AI while maintaining strong Torah values."
};

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

export default function Home() {
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
            <Tabs defaultValue="professional" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="professional">Professional Profile</TabsTrigger>
                <TabsTrigger value="personal">Personal & Shidduch</TabsTrigger>
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

              </TabsContent>
            </Tabs>
          </main>
        </motion.div>
      </div>
    </div>
  );
}
