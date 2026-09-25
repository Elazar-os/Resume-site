import { motion } from "framer-motion";
import { ArrowUpRight, FileText, LayoutDashboard, Monitor, MessageCircle } from "lucide-react";
import { TopNavigation } from "@/components/top-navigation";

const PROJECTS = [
  {
    id: "resume",
    name: "Resume Site",
    description: "ElazarOS portfolio and apps hub.",
    url: "https://elazaros-app.elazar-greisman.workers.dev/",
    icon: LayoutDashboard,
  },
  {
    id: "menu",
    name: "ElazarOS Menu",
    description: "King of Delancey digital menu system.",
    url: "https://elazaros-production-ecfd.up.railway.app/login",
    icon: Monitor,
  },
  {
    id: "gary",
    name: "Gary",
    description: "ElazarOS AI assistant for background, projects, and more.",
    url: "https://elazaros-app.elazar-greisman.workers.dev/#/gary",
    icon: MessageCircle,
  },
  {
    id: "invoice",
    name: "KOD Invoice Tracker",
    description: "Invoice and business workflow project.",
    url: "https://kod-tracker.pages.dev/",
    icon: FileText,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.08 } },
};

const itemVariants = {
  hidden: { y: 16, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: "spring" as const, stiffness: 55, damping: 14 } },
};

export default function AppsHubPage() {
  return (
    <div className="min-h-screen bg-[#f5f7fb] font-sans text-[#0b0d12]">
      <TopNavigation />

      <main className="relative overflow-hidden">
        <div className="pointer-events-none absolute -top-40 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-[#3156e8]/10 blur-3xl" />
        <div className="pointer-events-none absolute right-0 top-80 h-64 w-64 rounded-full bg-[#1737c8]/[0.07] blur-3xl" />

        <div className="relative mx-auto max-w-5xl px-5 py-12 md:px-8 md:py-20">
          <motion.div initial="hidden" animate="visible" variants={containerVariants} className="space-y-10">
            <motion.div variants={itemVariants} className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#3156e8]">ElazarOS</p>
              <h1 className="text-4xl font-bold tracking-tight md:text-5xl">Apps</h1>
              <p className="max-w-xl text-sm leading-6 text-slate-500 md:text-base">
                A small collection of projects built to solve real problems.
              </p>
            </motion.div>

            <motion.div variants={containerVariants} className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              {PROJECTS.map((project) => {
                const Icon = project.icon;
                return (
                  <motion.a
                    key={project.id}
                    variants={itemVariants}
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex min-h-[260px] flex-col rounded-[28px] border border-white/80 bg-white/65 p-5 shadow-[0_18px_55px_rgba(15,23,42,0.08),inset_0_1px_0_rgba(255,255,255,0.9)] backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-[#3156e8]/20 hover:shadow-[0_24px_65px_rgba(15,23,42,0.12)]"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#3156e8]/10 bg-[#1737c8]/[0.07] text-[#3156e8] shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]">
                        <Icon className="h-5 w-5" />
                      </div>
                      <ArrowUpRight className="h-5 w-5 text-slate-400 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#3156e8]" />
                    </div>

                    <div className="mt-auto pt-12">
                      <div className="mb-2 flex items-center gap-2">
                        <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#3156e8]">Live</span>
                        <span className="h-1 w-1 rounded-full bg-slate-300" />
                        <span className="text-[10px] uppercase tracking-[0.14em] text-slate-400">Project</span>
                      </div>
                      <h2 className="text-xl font-semibold tracking-tight text-[#0b0d12]">{project.name}</h2>
                      <p className="mt-2 text-sm leading-6 text-slate-500">{project.description}</p>
                      <span className="mt-4 inline-flex items-center rounded-xl px-3 py-2 text-xs font-semibold text-[#3156e8] transition group-hover:bg-[#1737c8]/[0.07]">
                        Open app
                        <ArrowUpRight className="ml-1.5 h-3.5 w-3.5" />
                      </span>
                    </div>
                  </motion.a>
                );
              })}
            </motion.div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
