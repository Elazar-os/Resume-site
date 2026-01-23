import { motion } from "framer-motion";
import { ExternalLink, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { APPS } from "@/lib/apps-config";
import { cn } from "@/lib/utils";
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

export default function AppsHubPage() {
  return (
    <div className="min-h-screen bg-background font-sans">
      <TopNavigation />
      
      <div className="max-w-6xl mx-auto p-4 md:p-8 lg:p-12">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="space-y-8"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="text-center space-y-4">
            <Badge variant="secondary" className="text-sm">Apps Hub</Badge>
            <h1 className="text-4xl md:text-5xl font-bold font-heading text-primary">
              Elazar's Apps
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A collection of apps and tools I've built. Click on any app to open it in a new tab.
            </p>
          </motion.div>

          {/* Apps Grid */}
          <motion.div 
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {APPS.map((app) => {
              const Icon = app.icon;
              return (
                <motion.div key={app.id} variants={itemVariants}>
                  <Card 
                    className="h-full overflow-hidden border-none shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer"
                    onClick={() => window.open(app.replitUrl, "_blank")}
                    data-testid={`app-card-${app.id}`}
                  >
                    {/* Gradient Header */}
                    <div className={cn(
                      "h-2 bg-gradient-to-r",
                      app.gradient
                    )} />
                    
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <div className={cn(
                          "w-12 h-12 rounded-xl flex items-center justify-center",
                          "bg-gradient-to-br shadow-md",
                          app.gradient
                        )}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <Badge variant="outline" className="text-xs">
                          App
                        </Badge>
                      </div>
                      <CardTitle className="text-xl font-heading mt-3 group-hover:text-primary transition-colors">
                        {app.name}
                      </CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      <CardDescription className="text-sm leading-relaxed">
                        {app.description}
                      </CardDescription>

                      <div className="flex items-center justify-between pt-2">
                        <span className="text-xs text-muted-foreground font-mono">
                          {app.subdomain}
                        </span>
                        <Button 
                          size="sm" 
                          className={cn(
                            "bg-gradient-to-r text-white border-none",
                            app.gradient
                          )}
                          asChild
                        >
                          <a 
                            href={app.replitUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            data-testid={`open-app-${app.id}`}
                          >
                            Open App
                            <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                          </a>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Add More Apps Section */}
          <motion.div variants={itemVariants} className="text-center pt-8">
            <Card className="border-dashed border-2 bg-secondary/20">
              <CardContent className="py-8">
                <p className="text-muted-foreground text-sm">
                  More apps coming soon! Check back for updates.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Instructions Card */}
          <motion.div variants={itemVariants}>
            <Card className="bg-card border-none shadow-md">
              <CardHeader>
                <CardTitle className="text-lg font-heading">Quick Access</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <p>You can also access apps directly via:</p>
                <ul className="list-disc list-inside space-y-1 pl-2">
                  <li><code className="bg-secondary px-1.5 py-0.5 rounded text-xs">elazaros.com/#/kod</code> → KOD Menu</li>
                  <li><code className="bg-secondary px-1.5 py-0.5 rounded text-xs">elazaros.com/#/pti</code> → PTI Young Pros</li>
                  <li><code className="bg-secondary px-1.5 py-0.5 rounded text-xs">elazaros.com/#/shadchan</code> → Shadchan</li>
                  <li><code className="bg-secondary px-1.5 py-0.5 rounded text-xs">elazaros.com/#/gary</code> → Gary King</li>
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
