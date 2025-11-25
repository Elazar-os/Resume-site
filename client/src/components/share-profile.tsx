import { useState } from "react";
import { Check, Copy, Share2, Briefcase, Heart, Layout, Mail, MessageSquare, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

export function ShareProfile() {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  
  const links = {
    professional: `${origin}/#/resume`,
    shidduch: `${origin}/#/shidduch`,
    combined: `${origin}/#/combined`
  };

  const messages = {
    professional: `Hi, here is my professional resume and portfolio: ${links.professional}`,
    shidduch: `Hi, here is my shidduch profile: ${links.shidduch}`,
    combined: `Hi, here is my full profile (Elazar OS): ${links.combined}`
  };

  const shareVia = (method: 'sms' | 'whatsapp' | 'email', type: 'professional' | 'shidduch' | 'combined') => {
    const message = messages[type];
    const encodedMessage = encodeURIComponent(message);
    let url = '';

    switch (method) {
      case 'sms':
        // different devices handle sms body differently, standard is body=
        url = `sms:?&body=${encodedMessage}`;
        break;
      case 'whatsapp':
        url = `https://wa.me/?text=${encodedMessage}`;
        break;
      case 'email':
        url = `mailto:?subject=Profile Share&body=${encodedMessage}`;
        break;
    }
    
    window.open(url, '_blank');
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: `${type} link is ready to share.`,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="w-full gap-2 shadow-md bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary transition-all duration-300">
          <Share2 className="w-4 h-4" /> Share Profile
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Elazar OS</DialogTitle>
          <DialogDescription>
            Choose which version of your profile you'd like to share.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="professional" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="professional">Work</TabsTrigger>
            <TabsTrigger value="shidduch">Shidduch</TabsTrigger>
            <TabsTrigger value="combined">Full</TabsTrigger>
          </TabsList>
          
          <TabsContent value="professional" className="space-y-4">
            <div className="flex flex-col items-center justify-center p-6 bg-muted/30 rounded-lg border border-dashed mb-2">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-2">
                <Briefcase className="w-6 h-6" />
              </div>
              <h3 className="font-medium text-sm">Professional Profile</h3>
              <p className="text-xs text-muted-foreground text-center mt-1">
                Shares only your resume, skills, and career highlights. <br/>
                (Hides personal/dating info)
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="link-pro">Profile Link</Label>
              <div className="flex items-center space-x-2">
                <Input id="link-pro" value={links.professional} readOnly />
                <Button size="sm" className="px-3" onClick={() => copyToClipboard(links.professional, "Professional")}>
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            <Button variant="secondary" className="w-full text-xs mb-3" onClick={() => copyToClipboard(messages.professional, "Message")}>
              Copy Pre-written Message
            </Button>

            <div className="grid grid-cols-3 gap-2">
              <Button variant="outline" size="sm" className="w-full h-8 text-xs" onClick={() => shareVia('sms', 'professional')}>
                <Smartphone className="w-3 h-3 mr-1.5" /> SMS
              </Button>
              <Button variant="outline" size="sm" className="w-full h-8 text-xs" onClick={() => shareVia('whatsapp', 'professional')}>
                <MessageSquare className="w-3 h-3 mr-1.5" /> WA
              </Button>
              <Button variant="outline" size="sm" className="w-full h-8 text-xs" onClick={() => shareVia('email', 'professional')}>
                <Mail className="w-3 h-3 mr-1.5" /> Email
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="shidduch" className="space-y-4">
            <div className="flex flex-col items-center justify-center p-6 bg-muted/30 rounded-lg border border-dashed mb-2">
              <div className="w-12 h-12 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center mb-2">
                <Heart className="w-6 h-6" />
              </div>
              <h3 className="font-medium text-sm">Shidduch Profile</h3>
              <p className="text-xs text-muted-foreground text-center mt-1">
                Shares your dating resume, values, and family info. <br/>
                (Hides detailed career specifics)
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="link-shidduch">Profile Link</Label>
              <div className="flex items-center space-x-2">
                <Input id="link-shidduch" value={links.shidduch} readOnly />
                <Button size="sm" className="px-3" onClick={() => copyToClipboard(links.shidduch, "Shidduch")}>
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            <Button variant="secondary" className="w-full text-xs mb-3" onClick={() => copyToClipboard(messages.shidduch, "Message")}>
              Copy Pre-written Message
            </Button>

            <div className="grid grid-cols-3 gap-2">
              <Button variant="outline" size="sm" className="w-full h-8 text-xs" onClick={() => shareVia('sms', 'shidduch')}>
                <Smartphone className="w-3 h-3 mr-1.5" /> SMS
              </Button>
              <Button variant="outline" size="sm" className="w-full h-8 text-xs" onClick={() => shareVia('whatsapp', 'shidduch')}>
                <MessageSquare className="w-3 h-3 mr-1.5" /> WA
              </Button>
              <Button variant="outline" size="sm" className="w-full h-8 text-xs" onClick={() => shareVia('email', 'shidduch')}>
                <Mail className="w-3 h-3 mr-1.5" /> Email
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="combined" className="space-y-4">
            <div className="flex flex-col items-center justify-center p-6 bg-muted/30 rounded-lg border border-dashed mb-2">
              <div className="w-12 h-12 bg-slate-100 text-slate-600 rounded-full flex items-center justify-center mb-2">
                <Layout className="w-6 h-6" />
              </div>
              <h3 className="font-medium text-sm">Full Access</h3>
              <p className="text-xs text-muted-foreground text-center mt-1">
                Shares the complete Elazar OS dashboard. <br/>
                (Includes both Professional & Personal tabs)
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="link-combined">Profile Link</Label>
              <div className="flex items-center space-x-2">
                <Input id="link-combined" value={links.combined} readOnly />
                <Button size="sm" className="px-3" onClick={() => copyToClipboard(links.combined, "Full Access")}>
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            <Button variant="secondary" className="w-full text-xs mb-3" onClick={() => copyToClipboard(messages.combined, "Message")}>
              Copy Pre-written Message
            </Button>

            <div className="grid grid-cols-3 gap-2">
              <Button variant="outline" size="sm" className="w-full h-8 text-xs" onClick={() => shareVia('sms', 'combined')}>
                <Smartphone className="w-3 h-3 mr-1.5" /> SMS
              </Button>
              <Button variant="outline" size="sm" className="w-full h-8 text-xs" onClick={() => shareVia('whatsapp', 'combined')}>
                <MessageSquare className="w-3 h-3 mr-1.5" /> WA
              </Button>
              <Button variant="outline" size="sm" className="w-full h-8 text-xs" onClick={() => shareVia('email', 'combined')}>
                <Mail className="w-3 h-3 mr-1.5" /> Email
              </Button>
            </div>
          </TabsContent>
          
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
