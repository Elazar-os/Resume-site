import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Award, Briefcase, GraduationCap, Heart, ArrowRight, CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

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
      <div className="max-w-5xl mx-auto p-4 md:p-8 lg:p-12">
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8"
        >
          {/* Sidebar / Header Info */}
          <motion.aside variants={itemVariants} className="lg:col-span-4 space-y-6">
            <div className="lg:sticky lg:top-12 space-y-6">
              <div className="space-y-2">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-primary font-heading">
                  {RESUME_DATA.personalInfo.name.split(' ')[0]}
                  <span className="block text-muted-foreground">{RESUME_DATA.personalInfo.name.split(' ')[1]}</span>
                </h1>
                <p className="text-lg font-medium text-accent pt-2">
                  {RESUME_DATA.personalInfo.title}
                </p>
              </div>

              <Card className="border-l-4 border-l-accent shadow-sm">
                <CardContent className="p-4 space-y-4">
                  <div className="flex items-center gap-3 text-sm font-medium">
                    <div className="p-2 bg-primary/5 rounded-full text-primary">
                      <MapPin className="w-4 h-4" />
                    </div>
                    {RESUME_DATA.personalInfo.location}
                  </div>
                  <div className="flex items-center gap-3 text-sm font-medium">
                    <div className="p-2 bg-primary/5 rounded-full text-primary">
                      <Phone className="w-4 h-4" />
                    </div>
                    {RESUME_DATA.personalInfo.phone}
                  </div>
                  <div className="flex items-center gap-3 text-sm font-medium">
                    <div className="p-2 bg-primary/5 rounded-full text-primary">
                      <Mail className="w-4 h-4" />
                    </div>
                    <a href={`mailto:${RESUME_DATA.personalInfo.email}`} className="hover:text-accent transition-colors">
                      {RESUME_DATA.personalInfo.email}
                    </a>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-4 pt-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                  <Award className="w-4 h-4" /> Key Skills
                </h3>
                <div className="flex flex-wrap gap-2">
                  {RESUME_DATA.skills.map((skill, index) => (
                    <Badge 
                      key={index} 
                      variant="secondary" 
                      className="px-3 py-1 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors cursor-default"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-4 pt-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                  <GraduationCap className="w-4 h-4" /> Education
                </h3>
                <div className="space-y-1">
                  <p className="font-semibold text-primary">{RESUME_DATA.education.school}</p>
                  <p className="text-sm text-muted-foreground">{RESUME_DATA.education.degree}</p>
                  <p className="text-xs text-muted-foreground mt-1">{RESUME_DATA.education.year} • {RESUME_DATA.education.location}</p>
                </div>
              </div>
            </div>
          </motion.aside>

          {/* Main Content */}
          <main className="lg:col-span-8 space-y-10">
            
            {/* Summary */}
            <motion.section variants={itemVariants} className="space-y-4">
              <h2 className="text-2xl font-bold font-heading text-primary border-b pb-2">Professional Summary</h2>
              <p className="text-base md:text-lg leading-relaxed text-muted-foreground">
                {RESUME_DATA.summary}
              </p>
            </motion.section>

            {/* Experience */}
            <motion.section variants={itemVariants} className="space-y-6">
              <h2 className="text-2xl font-bold font-heading text-primary border-b pb-2 flex items-center gap-2">
                <Briefcase className="w-6 h-6 text-accent" /> Professional Experience
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

            {/* Goals */}
            <motion.section variants={itemVariants} className="bg-primary text-primary-foreground rounded-xl p-6 md:p-8 shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 p-12 bg-accent/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
              
              <div className="relative z-10 space-y-4">
                <h2 className="text-xl font-bold font-heading flex items-center gap-2">
                  <ArrowRight className="w-5 h-5 text-accent" /> Career Objective
                </h2>
                <p className="text-lg leading-relaxed text-primary-foreground/90 font-medium">
                  {RESUME_DATA.careerGoal}
                </p>
              </div>
            </motion.section>

          </main>
        </motion.div>
      </div>
    </div>
  );
}
