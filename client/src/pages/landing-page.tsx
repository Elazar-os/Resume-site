import { Link } from "wouter";
import { motion } from "framer-motion";
import { Briefcase, Heart, Layout } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="max-w-4xl w-full space-y-12 text-center">
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-4"
        >
          <h1 className="text-6xl md:text-8xl font-bold font-heading tracking-tighter text-primary">
            ELAZAR<span className="text-accent">.OS</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-lg mx-auto">
            Select an interface to begin.
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <Link href="/resume">
            <Card className="group relative overflow-hidden border-2 border-transparent hover:border-accent/50 transition-all duration-300 hover:shadow-xl bg-card cursor-pointer h-full">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="p-8 flex flex-col items-center justify-center space-y-6 h-full relative z-10">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Briefcase className="w-8 h-8 text-primary" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-primary">Professional</h3>
                  <p className="text-sm text-muted-foreground">Resume, Skills & Experience</p>
                </div>
                <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground">Access Profile</Button>
              </div>
            </Card>
          </Link>

          <Link href="/shidduch">
            <Card className="group relative overflow-hidden border-2 border-transparent hover:border-accent/50 transition-all duration-300 hover:shadow-xl bg-card cursor-pointer h-full">
              <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="p-8 flex flex-col items-center justify-center space-y-6 h-full relative z-10">
                <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Heart className="w-8 h-8 text-accent" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-primary">Personal</h3>
                  <p className="text-sm text-muted-foreground">Shidduch Profile & Values</p>
                </div>
                <Button variant="outline" className="w-full group-hover:bg-accent group-hover:text-accent-foreground">Access Profile</Button>
              </div>
            </Card>
          </Link>

          <Link href="/combined">
            <Card className="group relative overflow-hidden border-2 border-transparent hover:border-primary/50 transition-all duration-300 hover:shadow-xl bg-card cursor-pointer h-full">
              <div className="absolute inset-0 bg-gradient-to-br from-background to-secondary opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="p-8 flex flex-col items-center justify-center space-y-6 h-full relative z-10">
                <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Layout className="w-8 h-8 text-foreground" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-primary">Full Access</h3>
                  <p className="text-sm text-muted-foreground">Complete Identity View</p>
                </div>
                <Button variant="outline" className="w-full">View All</Button>
              </div>
            </Card>
          </Link>

        </motion.div>

        <footer className="text-sm text-muted-foreground/50">
          © 2025 Elazar Greisman. All rights reserved.
        </footer>
      </div>
    </div>
  );
}
