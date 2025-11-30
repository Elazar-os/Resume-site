import { motion } from "framer-motion";
import { SHIDDUCH_DATA } from "@/lib/data";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function ShidduchPage() {
  return (
    <div className="min-h-screen bg-background font-sans p-4 md:p-8 lg:p-12 flex justify-center">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl w-full"
      >
        <Card className="shadow-xl border-none bg-card">
          <CardContent className="p-8 md:p-12 space-y-8">
            
            {/* Header */}
            <div className="space-y-4 text-center">
              <h1 className="text-3xl md:text-4xl font-bold font-heading text-primary">{SHIDDUCH_DATA.basics.name}</h1>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-lg text-muted-foreground max-w-xl mx-auto">
                 <div>Age: {SHIDDUCH_DATA.basics.age}</div>
                 <div>DOB: {SHIDDUCH_DATA.basics.dob}</div>
                 <div>Height: {SHIDDUCH_DATA.basics.height}</div>
                 <div>Location: {SHIDDUCH_DATA.basics.location}</div>
              </div>
              
              <div className="flex flex-col md:flex-row justify-center gap-4 text-accent font-medium pt-2">
                 <a href={`tel:${SHIDDUCH_DATA.basics.phone}`} className="hover:underline">{SHIDDUCH_DATA.basics.phone}</a>
                 <span className="hidden md:inline">•</span>
                 <a href={`mailto:${SHIDDUCH_DATA.basics.email}`} className="hover:underline">{SHIDDUCH_DATA.basics.email}</a>
              </div>
            </div>

            <Separator className="my-8" />

            {/* Family */}
            <section className="space-y-4">
               <h2 className="text-xl font-bold text-primary uppercase tracking-wide border-b pb-2">Family Information</h2>
               <div className="space-y-2 text-lg">
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
                  
                  <p className="pt-2"><span className="font-semibold text-primary/80">Family Hashkafa:</span> {SHIDDUCH_DATA.family.hashkafa}</p>
               </div>
            </section>

            <Separator className="my-8" />

            {/* Education */}
            <section className="space-y-4">
               <h2 className="text-xl font-bold text-primary uppercase tracking-wide border-b pb-2">Education / Yeshiva Background</h2>
               <ul className="list-disc list-inside space-y-2 text-lg text-muted-foreground">
                  {SHIDDUCH_DATA.education.map((edu, i) => (
                     <li key={i}>{edu}</li>
                  ))}
               </ul>
            </section>

            <Separator className="my-8" />

            {/* Occupation */}
            <section className="space-y-4">
               <h2 className="text-xl font-bold text-primary uppercase tracking-wide border-b pb-2">Current Occupation</h2>
               <div className="space-y-2 text-lg">
                  <p className="font-medium text-primary">{SHIDDUCH_DATA.occupation.title}</p>
                  <p className="text-muted-foreground">Employer Reference: {SHIDDUCH_DATA.occupation.reference}</p>
               </div>
            </section>

            <Separator className="my-8" />

            {/* References */}
            <section className="space-y-4">
               <h2 className="text-xl font-bold text-primary uppercase tracking-wide border-b pb-2">References</h2>
               <ul className="list-disc list-inside space-y-2 text-lg text-muted-foreground">
                  {SHIDDUCH_DATA.references.map((ref, i) => (
                     <li key={i}>{ref}</li>
                  ))}
               </ul>
            </section>

          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
