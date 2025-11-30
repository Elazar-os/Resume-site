import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function JSwipeProfile() {
  return (
    <div className="flex justify-center p-4">
      <Card className="w-[380px] bg-[#101b2d] text-slate-100 border-none shadow-2xl overflow-hidden rounded-[18px]">
        {/* Photo Area */}
        <div className="h-[420px] bg-black relative">
          <img 
            src="/photos/dating-1.png" 
            alt="Profile Photo" 
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#101b2d] to-transparent h-24" />
        </div>

        <CardContent className="p-5 space-y-5 relative z-10 -mt-4">
          {/* Header */}
          <div>
            <div className="text-2xl font-bold text-white">Elazar Greisman</div>
            <div className="text-lg text-slate-300">22 • 5'5" • Passaic, NJ</div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-bold text-slate-400 mb-1.5 uppercase tracking-wide">Contact</h3>
            <div className="text-sm mb-1"><span className="font-semibold text-slate-300">Phone:</span> 201-321-6587</div>
            <div className="text-sm mb-1"><span className="font-semibold text-slate-300">Email:</span> elazar.greisman@outlook.com</div>
          </div>

          {/* Parents */}
          <div>
            <h3 className="text-sm font-bold text-slate-400 mb-1.5 uppercase tracking-wide">Parents</h3>
            <div className="text-sm mb-1"><span className="font-semibold text-slate-300">Father:</span> Moishy Greisman — Tax Lawyer</div>
            <div className="text-sm mb-1"><span className="font-semibold text-slate-300">Mother:</span> Elisheva Greisman — Teacher</div>
          </div>

          {/* Siblings */}
          <div>
            <h3 className="text-sm font-bold text-slate-400 mb-1.5 uppercase tracking-wide">Siblings</h3>
            <ul className="text-sm space-y-1">
              <li>• Esther Baila (24) — Married, Software Developer</li>
              <li>• Hillel (21) — Single, Car Sales & Auto Leasing</li>
              <li>• Shloimy (17) — Mesivta Torah Maier</li>
              <li>• Perri (14) — Ashirah</li>
            </ul>
          </div>

          {/* Education */}
          <div>
            <h3 className="text-sm font-bold text-slate-400 mb-1.5 uppercase tracking-wide">Education</h3>
            <ul className="text-sm space-y-1">
              <li>• Mesivta of North Jersey</li>
              <li>• Yeshiva Tiferes Avner</li>
              <li>• Mesivta of Las Vegas</li>
              <li>• Morning Kollel — Yeshivas Ner Baruch</li>
            </ul>
          </div>

          {/* Work */}
          <div>
            <h3 className="text-sm font-bold text-slate-400 mb-1.5 uppercase tracking-wide">Work</h3>
            <div className="text-sm">General Manager — King of Delancey</div>
          </div>

          {/* References */}
          <div>
            <h3 className="text-sm font-bold text-slate-400 mb-1.5 uppercase tracking-wide">References</h3>
            <ul className="text-sm space-y-1">
              <li>Daniel Mayer (Employer): 201-988-6929</li>
              <li>Ronit Gottesman (Family Friend): 908-303-4261</li>
              <li>Rabbi Baruch Bodenheim (Rav): 862-371-3186</li>
            </ul>
          </div>

          <div className="text-xs text-slate-500 text-center pt-4 opacity-60">
            Private parody page — not a real dating profile.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
