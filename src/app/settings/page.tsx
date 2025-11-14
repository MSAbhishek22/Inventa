"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import BottomNav from "@/components/BottomNav";
import VoiceCommandUI from "@/components/VoiceCommandUI";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, Bell, Wifi, WifiOff, Languages, Mic, Download, FileText, Store } from "lucide-react";
import { toast } from "sonner";

export default function SettingsPage() {
  const [showVoiceUI, setShowVoiceUI] = useState(false);
  const [settings, setSettings] = useState({
    lowStockAlerts: true,
    criticalAlerts: true,
    voiceCommands: true,
    offlineMode: false,
    autoSync: true,
    hindiVoice: true,
  });

  const handleToggle = (key: string) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
    toast.success("सेटिंग्स सहेजी गईं / Settings Saved");
  };

  const handleExportGST = () => {
    toast.success("GST रिपोर्ट डाउनलोड हो रही है / Downloading GST Report");
  };

  const handleBackup = () => {
    toast.success("बैकअप शुरू हो गया / Backup Started");
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-y-auto pb-20 md:pb-6">
          <div className="container px-4 md:px-6 py-6 space-y-6 max-w-4xl">
            {/* Header */}
            <div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight high-contrast">
                सेटिंग्स / Settings
              </h1>
              <p className="text-muted-foreground text-base md:text-lg mt-2">
                अपनी दुकान की जानकारी और ऐप सेटिंग्स बदलें
              </p>
            </div>

            {/* Shop Profile */}
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Store className="h-5 w-5 text-primary" />
                  दुकान की जानकारी / Shop Details
                </CardTitle>
                <CardDescription className="text-base">
                  अपनी दुकान का नाम और मोबाइल नंबर अपडेट करें
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="shopname" className="text-base font-medium">
                    दुकान का नाम / Shop Name
                  </Label>
                  <Input 
                    id="shopname" 
                    defaultValue="राज किराना स्टोर"
                    className="h-12 text-base"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ownername" className="text-base font-medium">
                    मालिक का नाम / Owner Name
                  </Label>
                  <Input 
                    id="ownername" 
                    defaultValue="राजेश कुमार"
                    className="h-12 text-base"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-base font-medium">
                    मोबाइल नंबर / Mobile Number
                  </Label>
                  <Input 
                    id="phone" 
                    type="tel" 
                    defaultValue="+91 98765 43210"
                    className="h-12 text-base"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gst" className="text-base font-medium">
                    GST Number (वैकल्पिक / Optional)
                  </Label>
                  <Input 
                    id="gst" 
                    defaultValue="27AABCU9603R1ZM"
                    className="h-12 text-base"
                  />
                </div>
                <Separator />
                <Button className="w-full h-12 text-base font-medium">
                  सेव करें / Save Changes
                </Button>
              </CardContent>
            </Card>

            {/* Language Settings */}
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Languages className="h-5 w-5 text-primary" />
                  भाषा चुनें / Choose Language
                </CardTitle>
                <CardDescription className="text-base">
                  अपनी पसंद की भाषा में बोलें और पढ़ें
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="mainlanguage" className="text-base font-medium">
                    मुख्य भाषा / Main Language
                  </Label>
                  <Select defaultValue="hindi">
                    <SelectTrigger id="mainlanguage" className="h-12 text-base">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hindi" className="text-base py-3">हिंदी / Hindi</SelectItem>
                      <SelectItem value="english" className="text-base py-3">English / अंग्रेज़ी</SelectItem>
                      <SelectItem value="hinglish" className="text-base py-3">Hinglish / हिंग्लिश</SelectItem>
                      <SelectItem value="tamil" className="text-base py-3">தமிழ் / Tamil</SelectItem>
                      <SelectItem value="telugu" className="text-base py-3">తెలుగు / Telugu</SelectItem>
                      <SelectItem value="marathi" className="text-base py-3">मराठी / Marathi</SelectItem>
                      <SelectItem value="bengali" className="text-base py-3">বাংলা / Bengali</SelectItem>
                      <SelectItem value="kannada" className="text-base py-3">ಕನ್ನಡ / Kannada</SelectItem>
                      <SelectItem value="gujarati" className="text-base py-3">ગુજરાતી / Gujarati</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between py-2">
                  <div className="space-y-0.5">
                    <Label className="text-base font-medium">
                      हिंदी वॉइस / Hindi Voice Support
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      हिंदी और हिंग्लिश में बोलें
                    </p>
                  </div>
                  <Switch
                    checked={settings.hindiVoice}
                    onCheckedChange={() => handleToggle("hindiVoice")}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Voice Settings */}
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Mic className="h-5 w-5 text-primary" />
                  वॉइस सेटिंग्स / Voice Settings
                </CardTitle>
                <CardDescription className="text-base">
                  आवाज़ की पहचान की सेटिंग्स
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="flex items-center justify-between py-2">
                  <div className="space-y-0.5">
                    <Label className="text-base font-medium">
                      वॉइस कमांड / Voice Commands
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      आवाज़ से स्टॉक अपडेट करें
                    </p>
                  </div>
                  <Switch
                    checked={settings.voiceCommands}
                    onCheckedChange={() => handleToggle("voiceCommands")}
                  />
                </div>
                <Separator />
                <div className="space-y-2">
                  <Label htmlFor="voicemode" className="text-base font-medium">
                    वॉइस मोड / Voice Mode
                  </Label>
                  <Select defaultValue="balanced">
                    <SelectTrigger id="voicemode" className="h-12 text-base">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fast" className="text-base py-3">
                        तेज़ / Fast (शोर वाली जगह के लिए)
                      </SelectItem>
                      <SelectItem value="balanced" className="text-base py-3">
                        संतुलित / Balanced (सुझाया गया)
                      </SelectItem>
                      <SelectItem value="accurate" className="text-base py-3">
                        सटीक / Accurate (शांत जगह के लिए)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Alerts */}
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Bell className="h-5 w-5 text-primary" />
                  अलर्ट / Alerts
                </CardTitle>
                <CardDescription className="text-base">
                  कम स्टॉक की सूचना पाएं
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="flex items-center justify-between py-2">
                  <div className="space-y-0.5">
                    <Label className="text-base font-medium">
                      कम स्टॉक अलर्ट / Low Stock Alerts
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      जब सामान कम हो तो सूचना दें
                    </p>
                  </div>
                  <Switch
                    checked={settings.lowStockAlerts}
                    onCheckedChange={() => handleToggle("lowStockAlerts")}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between py-2">
                  <div className="space-y-0.5">
                    <Label className="text-base font-medium">
                      जरूरी अलर्ट / Critical Alerts
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      बहुत कम स्टॉक की चेतावनी
                    </p>
                  </div>
                  <Switch
                    checked={settings.criticalAlerts}
                    onCheckedChange={() => handleToggle("criticalAlerts")}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Offline & Sync */}
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <WifiOff className="h-5 w-5 text-primary" />
                  ऑफलाइन मोड / Offline Mode
                </CardTitle>
                <CardDescription className="text-base">
                  इंटरनेट के बिना भी काम करें
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="flex items-center justify-between py-2">
                  <div className="space-y-0.5">
                    <Label className="text-base font-medium">
                      ऑफलाइन मोड / Offline Mode
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      बिना नेट के डेटा सेव करें
                    </p>
                  </div>
                  <Switch
                    checked={settings.offlineMode}
                    onCheckedChange={() => handleToggle("offlineMode")}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between py-2">
                  <div className="space-y-0.5">
                    <Label className="text-base font-medium">
                      <Wifi className="h-4 w-4 inline mr-1" />
                      ऑटो सिंक / Auto Sync
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      नेट आने पर अपने आप सिंक करें
                    </p>
                  </div>
                  <Switch
                    checked={settings.autoSync}
                    onCheckedChange={() => handleToggle("autoSync")}
                  />
                </div>
                <Separator />
                <Button 
                  className="w-full h-12 text-base font-medium" 
                  variant="outline"
                  onClick={handleBackup}
                >
                  <Download className="h-5 w-5 mr-2" />
                  बैकअप लें / Backup Data
                </Button>
              </CardContent>
            </Card>

            {/* GST Export */}
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <FileText className="h-5 w-5 text-primary" />
                  GST रिपोर्ट / GST Report
                </CardTitle>
                <CardDescription className="text-base">
                  GST के लिए रिपोर्ट डाउनलोड करें
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Button 
                    className="h-12 text-base font-medium" 
                    variant="outline"
                    onClick={handleExportGST}
                  >
                    <Download className="h-5 w-5 mr-2" />
                    इस महीने / This Month
                  </Button>
                  <Button 
                    className="h-12 text-base font-medium" 
                    variant="outline"
                    onClick={handleExportGST}
                  >
                    <Download className="h-5 w-5 mr-2" />
                    पिछले महीने / Last Month
                  </Button>
                  <Button 
                    className="h-12 text-base font-medium" 
                    variant="outline"
                    onClick={handleExportGST}
                  >
                    <Download className="h-5 w-5 mr-2" />
                    तिमाही / Quarter
                  </Button>
                  <Button 
                    className="h-12 text-base font-medium" 
                    variant="outline"
                    onClick={handleExportGST}
                  >
                    <Download className="h-5 w-5 mr-2" />
                    साल भर / Yearly
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>

        <BottomNav />
      </div>

      {/* Floating Microphone Button */}
      <Button
        size="lg"
        className="fixed bottom-24 md:bottom-8 right-6 h-16 w-16 rounded-full shadow-2xl glow z-40 hover:scale-110 transition-transform"
        onClick={() => setShowVoiceUI(!showVoiceUI)}
      >
        <Mic className="h-6 w-6" />
      </Button>

      {/* Voice Command UI */}
      <VoiceCommandUI isOpen={showVoiceUI} onClose={() => setShowVoiceUI(false)} />
    </div>
  );
}