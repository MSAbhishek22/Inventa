"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import BottomNav from "@/components/BottomNav";
import VoiceCommandUI from "@/components/VoiceCommandUI";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertTriangle, TrendingDown, Package, CheckCircle, Clock, Mic, Bell } from "lucide-react";
import { cn } from "@/lib/utils";

const alerts = [
  {
    id: 1,
    type: "critical",
    title: "बहुत कम स्टॉक / Critical Stock",
    message: "Amul Milk बहुत कम है (सिर्फ 2 लीटर बचा है)",
    messageEnglish: "Amul Milk is critically low (only 2 liters remaining)",
    item: "Amul Milk / अमूल दूध",
    time: "5 मिनट पहले / 5 minutes ago",
    read: false,
    icon: AlertTriangle,
  },
  {
    id: 2,
    type: "critical",
    title: "बहुत कम स्टॉक / Critical Stock",
    message: "Maggi Noodles खत्म होने वाला है (3 पैकेट बचे हैं)",
    messageEnglish: "Maggi Noodles running out (3 packets left)",
    item: "Maggi Noodles / मैगी",
    time: "15 मिनट पहले / 15 minutes ago",
    read: false,
    icon: AlertTriangle,
  },
  {
    id: 3,
    type: "warning",
    title: "कम स्टॉक चेतावनी / Low Stock Warning",
    message: "Tata Salt कम हो रहा है (4 किलो बचा है)",
    messageEnglish: "Tata Salt is running low (4 kg remaining)",
    item: "Tata Salt / टाटा नमक",
    time: "1 घंटे पहले / 1 hour ago",
    read: false,
    icon: TrendingDown,
  },
  {
    id: 4,
    type: "info",
    title: "रीस्टॉक की सलाह / Restock Recommendation",
    message: "Parle-G बिस्कुट तेज़ी से बिक रहा है - स्टॉक बढ़ाएं",
    messageEnglish: "Parle-G Biscuits selling fast - consider restocking",
    item: "Parle-G / पारले-जी",
    time: "2 घंटे पहले / 2 hours ago",
    read: true,
    icon: Package,
  },
  {
    id: 5,
    type: "warning",
    title: "कम स्टॉक चेतावनी / Low Stock Warning",
    message: "Britannia Marie Gold बिस्कुट कम हो रहा है",
    messageEnglish: "Britannia Marie Gold running low",
    item: "Britannia Marie / ब्रिटानिया मेरी",
    time: "3 घंटे पहले / 3 hours ago",
    read: true,
    icon: TrendingDown,
  },
  {
    id: 6,
    type: "success",
    title: "रीस्टॉक पूरा / Restock Complete",
    message: "Aashirvaad Atta सफलतापूर्वक रीस्टॉक हो गया",
    messageEnglish: "Aashirvaad Atta restocked successfully",
    item: "Aashirvaad Atta / आशीर्वाद आटा",
    time: "1 दिन पहले / 1 day ago",
    read: true,
    icon: CheckCircle,
  },
  {
    id: 7,
    type: "info",
    title: "तेज़ बिकने वाला / Fast Moving",
    message: "Kurkure इस हफ्ते सबसे ज़्यादा बिका",
    messageEnglish: "Kurkure was the top seller this week",
    item: "Kurkure / कुरकुरे",
    time: "1 दिन पहले / 1 day ago",
    read: true,
    icon: TrendingDown,
  },
];

export default function AlertsPage() {
  const [showVoiceUI, setShowVoiceUI] = useState(false);
  const [filter, setFilter] = useState("all");

  const filteredAlerts = alerts.filter((alert) => {
    if (filter === "all") return true;
    if (filter === "unread") return !alert.read;
    return alert.type === filter;
  });

  const unreadCount = alerts.filter((a) => !a.read).length;

  const getAlertColor = (type: string) => {
    switch (type) {
      case "critical":
        return "border-red-500/50 bg-red-500/5";
      case "warning":
        return "border-orange-500/50 bg-orange-500/5";
      case "success":
        return "border-green-500/50 bg-green-500/5";
      default:
        return "border-border/50";
    }
  };

  const getBadgeVariant = (type: string) => {
    switch (type) {
      case "critical":
        return "destructive";
      case "warning":
        return "outline";
      case "success":
        return "secondary";
      default:
        return "secondary";
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-y-auto pb-20 md:pb-6">
          <div className="container px-4 md:px-6 py-6 space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight high-contrast">
                  अलर्ट / Alerts
                </h1>
                <p className="text-muted-foreground text-base md:text-lg">
                  स्टॉक की जानकारी / Inventory updates
                </p>
              </div>
              <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2">
                <Badge variant="destructive" className="px-3 py-1 text-sm">
                  {unreadCount} नए / unread
                </Badge>
                <Button variant="outline" size="sm" className="h-10 whitespace-nowrap">
                  सब पढ़ा / Mark all read
                </Button>
              </div>
            </div>

            {/* Filters */}
            <Tabs defaultValue="all" onValueChange={setFilter}>
              <TabsList className="w-full justify-start overflow-x-auto">
                <TabsTrigger value="all" className="text-sm md:text-base">
                  सभी / All
                </TabsTrigger>
                <TabsTrigger value="unread" className="text-sm md:text-base">
                  नए / Unread
                </TabsTrigger>
                <TabsTrigger value="critical" className="text-sm md:text-base">
                  जरूरी / Critical
                </TabsTrigger>
                <TabsTrigger value="warning" className="text-sm md:text-base">
                  चेतावनी / Warning
                </TabsTrigger>
                <TabsTrigger value="info" className="text-sm md:text-base">
                  जानकारी / Info
                </TabsTrigger>
              </TabsList>
            </Tabs>

            {/* Alerts List */}
            <div className="space-y-3">
              {filteredAlerts.map((alert) => {
                const Icon = alert.icon;
                return (
                  <Card
                    key={alert.id}
                    className={cn(
                      "border-2 transition-all hover:shadow-xl",
                      getAlertColor(alert.type),
                      !alert.read && "shadow-lg"
                    )}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3 md:gap-4">
                        <div
                          className={cn(
                            "h-12 w-12 md:h-14 md:w-14 rounded-full flex items-center justify-center shrink-0",
                            alert.type === "critical" && "bg-red-500/20",
                            alert.type === "warning" && "bg-orange-500/20",
                            alert.type === "success" && "bg-green-500/20",
                            alert.type === "info" && "bg-blue-500/20"
                          )}
                        >
                          <Icon
                            className={cn(
                              "h-6 w-6 md:h-7 md:w-7",
                              alert.type === "critical" && "text-red-600 dark:text-red-500",
                              alert.type === "warning" && "text-orange-600 dark:text-orange-500",
                              alert.type === "success" && "text-green-600 dark:text-green-500",
                              alert.type === "info" && "text-blue-600 dark:text-blue-500"
                            )}
                          />
                        </div>

                        <div className="flex-1 space-y-2 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1 flex-wrap">
                                <h3 className="font-bold text-base md:text-lg high-contrast">
                                  {alert.title}
                                </h3>
                                {!alert.read && (
                                  <div className="h-2.5 w-2.5 rounded-full bg-primary animate-pulse shrink-0" />
                                )}
                              </div>
                              <p className="text-sm md:text-base text-foreground">
                                {alert.message}
                              </p>
                              <p className="text-xs md:text-sm text-muted-foreground mt-1">
                                {alert.messageEnglish}
                              </p>
                            </div>
                            <Badge 
                              variant={getBadgeVariant(alert.type)} 
                              className="capitalize shrink-0 text-xs"
                            >
                              {alert.type === "critical" ? "जरूरी" : 
                               alert.type === "warning" ? "चेतावनी" :
                               alert.type === "success" ? "पूर्ण" : "जानकारी"}
                            </Badge>
                          </div>

                          <div className="flex items-center justify-between pt-2 border-t border-border/50 gap-2 flex-wrap">
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Clock className="h-3 w-3 shrink-0" />
                              <span>{alert.time}</span>
                            </div>
                            <div className="flex gap-2">
                              <Button variant="ghost" size="sm" className="h-9 text-sm">
                                देखें / View
                              </Button>
                              {!alert.read && (
                                <Button variant="outline" size="sm" className="h-9 text-sm">
                                  पढ़ा / Read
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {filteredAlerts.length === 0 && (
              <Card className="border-2">
                <CardContent className="p-12 text-center">
                  <Bell className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <h3 className="text-xl font-semibold mb-2 high-contrast">
                    कोई अलर्ट नहीं / No alerts found
                  </h3>
                  <p className="text-muted-foreground text-base">
                    सब ठीक है! {filter !== "all" && `कोई ${filter} अलर्ट नहीं है।`}
                  </p>
                </CardContent>
              </Card>
            )}
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
        <Mic className="h-7 w-7" />
      </Button>

      {/* Voice Command UI */}
      <VoiceCommandUI isOpen={showVoiceUI} onClose={() => setShowVoiceUI(false)} />
    </div>
  );
}