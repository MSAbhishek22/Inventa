"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import BottomNav from "@/components/BottomNav";
import VoiceCommandUI from "@/components/VoiceCommandUI";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Mic, Package, TrendingUp, AlertTriangle, IndianRupee } from "lucide-react";
import { cn } from "@/lib/utils";

const categories = [
  "सभी / All",
  "आटा / Flour",
  "दाल / Pulses", 
  "नमकीन / Snacks",
  "बिस्कुट / Biscuits",
  "डेयरी / Dairy",
  "मसाले / Spices"
];

const inventoryItems = [
  {
    id: 1,
    name: "Aashirvaad Atta",
    nameHindi: "आशीर्वाद आटा",
    category: "आटा / Flour",
    quantity: 25,
    unit: "kg",
    threshold: 10,
    mrp: 55,
    image: "🌾",
    status: "good",
  },
  {
    id: 2,
    name: "Tata Salt",
    nameHindi: "टाटा नमक",
    category: "मसाले / Spices",
    quantity: 4,
    unit: "kg",
    threshold: 5,
    mrp: 22,
    image: "🧂",
    status: "low",
  },
  {
    id: 3,
    name: "Fortune Oil",
    nameHindi: "फॉर्च्यून तेल",
    category: "तेल / Oil",
    quantity: 15,
    unit: "L",
    threshold: 5,
    mrp: 180,
    image: "🛢️",
    status: "good",
  },
  {
    id: 4,
    name: "Amul Milk",
    nameHindi: "अमूल दूध",
    category: "डेयरी / Dairy",
    quantity: 2,
    unit: "L",
    threshold: 10,
    mrp: 60,
    image: "🥛",
    status: "critical",
  },
  {
    id: 5,
    name: "Parle-G Biscuits",
    nameHindi: "पारले-जी बिस्कुट",
    category: "बिस्कुट / Biscuits",
    quantity: 48,
    unit: "packets",
    threshold: 20,
    mrp: 10,
    image: "🍪",
    status: "good",
  },
  {
    id: 6,
    name: "Toor Dal",
    nameHindi: "तूर दाल",
    category: "दाल / Pulses",
    quantity: 12,
    unit: "kg",
    threshold: 8,
    mrp: 140,
    image: "🫘",
    status: "good",
  },
  {
    id: 7,
    name: "Maggi Noodles",
    nameHindi: "मैगी नूडल्स",
    category: "नमकीन / Snacks",
    quantity: 3,
    unit: "packets",
    threshold: 15,
    mrp: 12,
    image: "🍜",
    status: "critical",
  },
  {
    id: 8,
    name: "Kurkure",
    nameHindi: "कुरकुरे",
    category: "नमकीन / Snacks",
    quantity: 35,
    unit: "packets",
    threshold: 20,
    mrp: 20,
    image: "🥨",
    status: "good",
  },
];

export default function DashboardPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("सभी / All");
  const [showVoiceUI, setShowVoiceUI] = useState(false);

  const stats = {
    totalItems: 144,
    lowStock: 2,
    fastMoving: 8,
    totalValue: 45680,
  };

  const filteredItems = inventoryItems.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.nameHindi.includes(searchQuery);
    const matchesCategory = selectedCategory === "सभी / All" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-y-auto pb-20 md:pb-6">
          <div className="container px-4 md:px-6 py-6 space-y-6">
            {/* Welcome */}
            <div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight high-contrast">
                नमस्ते 🙏 / Hello
              </h1>
              <p className="text-muted-foreground text-base md:text-lg mt-1">
                आज का स्टॉक सारांश / Today's Stock Summary
              </p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              <Card className="border-2">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground">
                    कुल आइटम / Total Items
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-2xl md:text-3xl font-bold high-contrast">{stats.totalItems}</div>
                    <Package className="h-8 w-8 text-primary opacity-70" />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    सभी श्रेणियां
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 border-red-500/30 bg-red-500/5">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground">
                    कम स्टॉक / Low Stock
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-2xl md:text-3xl font-bold text-red-600 dark:text-red-500">{stats.lowStock}</div>
                    <AlertTriangle className="h-8 w-8 text-red-600 dark:text-red-500 opacity-70" />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    ध्यान दें
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 border-green-500/30 bg-green-500/5">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground">
                    तेज़ बिकने वाला / Fast Moving
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-2xl md:text-3xl font-bold text-green-600 dark:text-green-500">{stats.fastMoving}</div>
                    <TrendingUp className="h-8 w-8 text-green-600 dark:text-green-500 opacity-70" />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    ज़्यादा मांग
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 border-primary/30 bg-primary/5">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground">
                    कुल वैल्यू / Total Value
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-2xl md:text-3xl font-bold text-primary flex items-center">
                      <IndianRupee className="h-5 w-5 md:h-6 md:w-6" />
                      {(stats.totalValue / 1000).toFixed(1)}k
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    स्टॉक मूल्य
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="search"
                placeholder="खोजें / Search... (e.g., Atta, Maggi, दाल)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 text-base"
              />
            </div>

            {/* Category Chips */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className="whitespace-nowrap rounded-full h-10 px-4 text-sm md:text-base font-medium"
                >
                  {category}
                </Button>
              ))}
            </div>

            {/* Voice Prompt */}
            <Card className="border-2 border-primary/50 bg-gradient-to-r from-primary/10 to-primary/5">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                    <Mic className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-base">आवाज़ से बोलें / Speak to Update</p>
                    <p className="text-sm text-muted-foreground">
                      "आटा 5 किलो बढ़ा दो" या "Maggi kitna bacha?"
                    </p>
                  </div>
                  <Button 
                    size="lg" 
                    className="shrink-0 h-12 px-6"
                    onClick={() => setShowVoiceUI(!showVoiceUI)}
                  >
                    बोलें
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Inventory List */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-xl md:text-2xl font-semibold">
                  आइटम सूची / Items List
                </h2>
                <Badge variant="secondary" className="text-sm">{filteredItems.length} आइटम</Badge>
              </div>

              <div className="grid gap-3">
                {filteredItems.map((item) => (
                  <Card
                    key={item.id}
                    className={cn(
                      "border-2 hover:shadow-lg transition-all cursor-pointer",
                      item.status === "critical" && "border-red-500/50 bg-red-500/5",
                      item.status === "low" && "border-orange-500/50 bg-orange-500/5"
                    )}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="relative shrink-0">
                          <div className="h-16 w-16 md:h-20 md:w-20 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center text-3xl md:text-4xl">
                            {item.image}
                          </div>
                          {item.status !== "good" && (
                            <div className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 animate-pulse" />
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-base md:text-lg truncate high-contrast">
                            {item.name}
                          </h3>
                          <p className="text-sm text-muted-foreground">{item.nameHindi}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{item.category}</p>
                        </div>

                        <div className="text-right shrink-0">
                          <div
                            className={cn(
                              "text-2xl md:text-3xl font-bold high-contrast",
                              item.quantity <= item.threshold && "text-red-600 dark:text-red-500",
                              item.quantity > item.threshold && item.quantity <= item.threshold * 1.5 && "text-orange-500"
                            )}
                          >
                            {item.quantity}
                          </div>
                          <p className="text-xs md:text-sm text-muted-foreground font-medium">
                            {item.unit}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Min: {item.threshold}
                          </p>
                        </div>

                        <div className="shrink-0 text-right">
                          <Badge
                            variant={
                              item.status === "good"
                                ? "secondary"
                                : item.status === "low"
                                ? "outline"
                                : "destructive"
                            }
                            className="capitalize mb-2"
                          >
                            {item.status === "good" ? "ठीक" : item.status === "low" ? "कम" : "बहुत कम"}
                          </Badge>
                          <p className="text-sm font-semibold flex items-center justify-end">
                            <IndianRupee className="h-3 w-3" />
                            {item.mrp}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
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