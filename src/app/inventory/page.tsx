"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import BottomNav from "@/components/BottomNav";
import VoiceCommandUI from "@/components/VoiceCommandUI";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Search, Mic, Plus, Grid3x3, List, Edit, Trash2, IndianRupee } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

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
    sellingPrice: 52,
    image: "🌾",
    description: "Premium chakki atta for soft rotis",
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
    sellingPrice: 20,
    image: "🧂",
    description: "Iodized salt for daily use",
    status: "low",
  },
  {
    id: 3,
    name: "Fortune Sunflower Oil",
    nameHindi: "फॉर्च्यून तेल",
    category: "तेल / Oil",
    quantity: 15,
    unit: "L",
    threshold: 5,
    mrp: 180,
    sellingPrice: 175,
    image: "🛢️",
    description: "Refined sunflower cooking oil",
    status: "good",
  },
  {
    id: 4,
    name: "Amul Taaza Milk",
    nameHindi: "अमूल ताज़ा दूध",
    category: "डेयरी / Dairy",
    quantity: 2,
    unit: "L",
    threshold: 10,
    mrp: 60,
    sellingPrice: 58,
    image: "🥛",
    description: "Fresh homogenized toned milk",
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
    sellingPrice: 10,
    image: "🍪",
    description: "Glucose biscuits (82g pack)",
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
    sellingPrice: 135,
    image: "🫘",
    description: "Premium quality arhar dal",
    status: "good",
  },
  {
    id: 7,
    name: "Maggi 2-Min Noodles",
    nameHindi: "मैगी नूडल्स",
    category: "नमकीन / Snacks",
    quantity: 3,
    unit: "packets",
    threshold: 15,
    mrp: 12,
    sellingPrice: 12,
    image: "🍜",
    description: "Masala noodles (70g pack)",
    status: "critical",
  },
  {
    id: 8,
    name: "Kurkure Masala Munch",
    nameHindi: "कुरकुरे",
    category: "नमकीन / Snacks",
    quantity: 35,
    unit: "packets",
    threshold: 20,
    mrp: 20,
    sellingPrice: 20,
    image: "🥨",
    description: "Crunchy masala snack (90g)",
    status: "good",
  },
  {
    id: 9,
    name: "Britannia Marie Gold",
    nameHindi: "ब्रिटानिया मेरी गोल्ड",
    category: "बिस्कुट / Biscuits",
    quantity: 22,
    unit: "packets",
    threshold: 15,
    mrp: 35,
    sellingPrice: 35,
    image: "🍪",
    description: "Light & crispy tea biscuits",
    status: "good",
  },
  {
    id: 10,
    name: "MDH Chana Masala",
    nameHindi: "एमडीएच छोले मसाला",
    category: "मसाले / Spices",
    quantity: 18,
    unit: "packets",
    threshold: 10,
    mrp: 15,
    sellingPrice: 14,
    image: "🌶️",
    description: "Chickpea curry masala (100g)",
    status: "good",
  },
  {
    id: 11,
    name: "Sugar",
    nameHindi: "चीनी",
    category: "चीनी / Sugar",
    quantity: 8,
    unit: "kg",
    threshold: 5,
    mrp: 45,
    sellingPrice: 42,
    image: "🍬",
    description: "Refined white sugar",
    status: "good",
  },
];

/** Stock status from quantity vs the item's low-stock threshold.
 *  Matches the seeded statuses: <= half the threshold is critical. */
const statusFor = (quantity: number, threshold: number): string =>
  quantity <= threshold / 2 ? "critical" : quantity <= threshold ? "low" : "good";

export default function InventoryPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [showVoiceUI, setShowVoiceUI] = useState(false);
  const [editingItem, setEditingItem] = useState<typeof inventoryItems[0] | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [items, setItems] = useState(inventoryItems);

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.nameHindi.includes(searchQuery)
  );

  /** Apply a voice/typed stock change (+add / -remove) and keep the
   *  low-stock status (card border, badge, alert dot) in sync. */
  const handleVoiceStockUpdate = (itemId: number, delta: number) => {
    const item = items.find((it) => it.id === itemId);
    setItems((prev) =>
      prev.map((it) => {
        if (it.id !== itemId) return it;
        const quantity = Math.max(0, Math.round((it.quantity + delta) * 100) / 100);
        return { ...it, quantity, status: statusFor(quantity, it.threshold) };
      })
    );
    if (item) {
      const newQty = Math.max(0, Math.round((item.quantity + delta) * 100) / 100);
      if (newQty <= item.threshold) {
        toast.warning(`स्टॉक कम है / Low stock: ${item.name} — सिर्फ ${newQty}${item.unit} बचा है`);
      }
    }
  };

  const handleEdit = (item: typeof inventoryItems[0]) => {
    setEditingItem(item);
    setIsSheetOpen(true);
  };

  const handleAddNew = () => {
    setEditingItem(null);
    setIsSheetOpen(true);
  };

  const handleSave = () => {
    toast.success(editingItem ? "आइटम अपडेट हो गया / Item Updated" : "नया आइटम जोड़ा गया / Item Added");
    setIsSheetOpen(false);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-y-auto pb-20 md:pb-6">
          <div className="container px-4 md:px-6 py-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight high-contrast">
                  इन्वेंटरी / Inventory
                </h1>
                <p className="text-muted-foreground text-base md:text-lg">
                  अपना स्टॉक मैनेज करें / Manage your stock
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="icon"
                  className="h-10 w-10"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid3x3 className="h-5 w-5" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="icon"
                  className="h-10 w-10"
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="search"
                placeholder="खोजें / Search... (Atta, Maggi, दाल)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 text-base"
              />
            </div>

            {/* Inventory Grid/List */}
            <div
              className={cn(
                viewMode === "grid"
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                  : "space-y-3"
              )}
            >
              {filteredItems.map((item) => (
                <Card
                  key={item.id}
                  className={cn(
                    "border-2 hover:shadow-xl transition-all group",
                    item.status === "critical" && "border-red-500/50 bg-red-500/5",
                    item.status === "low" && "border-orange-500/50 bg-orange-500/5"
                  )}
                >
                  <CardContent className={cn("p-4", viewMode === "list" && "flex items-center gap-4")}>
                    <div className={cn("relative", viewMode === "grid" ? "mb-4" : "shrink-0")}>
                      <div
                        className={cn(
                          "rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center",
                          viewMode === "grid" ? "w-full h-40 text-5xl" : "h-20 w-20 text-3xl"
                        )}
                      >
                        {item.image}
                      </div>
                      {item.status !== "good" && (
                        <div className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-red-500 animate-pulse border-2 border-background" />
                      )}
                    </div>

                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <h3 className="font-bold text-base md:text-lg high-contrast">{item.name}</h3>
                          <p className="text-sm text-muted-foreground">{item.nameHindi}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{item.category}</p>
                        </div>
                        <Badge
                          variant={
                            item.status === "good"
                              ? "secondary"
                              : item.status === "low"
                              ? "outline"
                              : "destructive"
                          }
                          className="capitalize shrink-0"
                        >
                          {item.status === "good" ? "ठीक" : item.status === "low" ? "कम" : "बहुत कम"}
                        </Badge>
                      </div>

                      {viewMode === "grid" && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {item.description}
                        </p>
                      )}

                      <div className="flex items-center justify-between pt-2 border-t border-border/50">
                        <div>
                          <p className="text-2xl md:text-3xl font-bold high-contrast">{item.quantity}</p>
                          <p className="text-xs text-muted-foreground">
                            {item.unit} • Min: {item.threshold}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-base md:text-lg font-bold flex items-center justify-end">
                            <IndianRupee className="h-4 w-4" />
                            {item.sellingPrice}
                          </p>
                          <p className="text-xs text-muted-foreground line-through">
                            MRP ₹{item.mrp}
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-2 pt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 h-10"
                          onClick={() => handleEdit(item)}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          एडिट / Edit
                        </Button>
                        <Button 
                          variant="outline" 
                          size="icon"
                          className="h-10 w-10"
                          onClick={() => toast.error("आइटम डिलीट करने की पुष्टि करें")}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </main>

        <BottomNav />
      </div>

      {/* Floating Action Buttons */}
      <Button
        size="lg"
        className="fixed bottom-24 md:bottom-8 right-6 h-16 w-16 rounded-full shadow-2xl glow z-40 hover:scale-110 transition-transform"
        onClick={() => setShowVoiceUI(!showVoiceUI)}
      >
        <Mic className="h-7 w-7" />
      </Button>

      <Button
        size="lg"
        className="fixed bottom-44 md:bottom-28 right-6 h-14 w-14 rounded-full shadow-xl bg-green-600 hover:bg-green-700 z-40 hover:scale-110 transition-transform"
        onClick={handleAddNew}
      >
        <Plus className="h-7 w-7" />
      </Button>

      {/* Voice Command UI */}
      <VoiceCommandUI
        isOpen={showVoiceUI}
        onClose={() => setShowVoiceUI(false)}
        items={items}
        onApplyCommand={handleVoiceStockUpdate}
      />

      {/* Edit/Add Item Sheet */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="text-xl">
              {editingItem ? "आइटम एडिट करें / Edit Item" : "नया आइटम जोड़ें / Add New Item"}
            </SheetTitle>
            <SheetDescription className="text-base">
              {editingItem ? "आइटम की जानकारी अपडेट करें" : "नया आइटम स्टॉक में जोड़ें"}
            </SheetDescription>
          </SheetHeader>
          
          <div className="space-y-5 py-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-base font-medium">
                आइटम का नाम / Item Name
              </Label>
              <Input
                id="name"
                placeholder="e.g., Aashirvaad Atta"
                defaultValue={editingItem?.name}
                className="h-12 text-base"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="nameHindi" className="text-base font-medium">
                हिंदी नाम / Hindi Name
              </Label>
              <Input
                id="nameHindi"
                placeholder="e.g., आशीर्वाद आटा"
                defaultValue={editingItem?.nameHindi}
                className="h-12 text-base"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category" className="text-base font-medium">
                श्रेणी / Category
              </Label>
              <Select defaultValue={editingItem?.category || "आटा / Flour"}>
                <SelectTrigger className="h-12 text-base">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="आटा / Flour" className="text-base py-3">आटा / Flour</SelectItem>
                  <SelectItem value="दाल / Pulses" className="text-base py-3">दाल / Pulses</SelectItem>
                  <SelectItem value="नमकीन / Snacks" className="text-base py-3">नमकीन / Snacks</SelectItem>
                  <SelectItem value="बिस्कुट / Biscuits" className="text-base py-3">बिस्कुट / Biscuits</SelectItem>
                  <SelectItem value="डेयरी / Dairy" className="text-base py-3">डेयरी / Dairy</SelectItem>
                  <SelectItem value="मसाले / Spices" className="text-base py-3">मसाले / Spices</SelectItem>
                  <SelectItem value="तेल / Oil" className="text-base py-3">तेल / Oil</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="quantity" className="text-base font-medium">
                  मात्रा / Quantity
                </Label>
                <Input
                  id="quantity"
                  type="number"
                  placeholder="0"
                  defaultValue={editingItem?.quantity}
                  className="h-12 text-base"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="unit" className="text-base font-medium">
                  यूनिट / Unit
                </Label>
                <Select defaultValue={editingItem?.unit || "kg"}>
                  <SelectTrigger className="h-12 text-base">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kg" className="text-base py-3">किलो / kg</SelectItem>
                    <SelectItem value="g" className="text-base py-3">ग्राम / g</SelectItem>
                    <SelectItem value="L" className="text-base py-3">लीटर / L</SelectItem>
                    <SelectItem value="ml" className="text-base py-3">मिली / ml</SelectItem>
                    <SelectItem value="packets" className="text-base py-3">पैकेट / packets</SelectItem>
                    <SelectItem value="pieces" className="text-base py-3">पीस / pieces</SelectItem>
                    <SelectItem value="dozen" className="text-base py-3">दर्जन / dozen</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="threshold" className="text-base font-medium">
                कम स्टॉक लिमिट / Low Stock Limit
              </Label>
              <Input
                id="threshold"
                type="number"
                placeholder="0"
                defaultValue={editingItem?.threshold}
                className="h-12 text-base"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="mrp" className="text-base font-medium">
                  MRP (₹)
                </Label>
                <Input
                  id="mrp"
                  type="number"
                  placeholder="0"
                  defaultValue={editingItem?.mrp}
                  className="h-12 text-base"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="selling" className="text-base font-medium">
                  बिक्री मूल्य / Selling (₹)
                </Label>
                <Input
                  id="selling"
                  type="number"
                  placeholder="0"
                  defaultValue={editingItem?.sellingPrice}
                  className="h-12 text-base"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-base font-medium">
                विवरण / Description
              </Label>
              <Textarea
                id="description"
                placeholder="आइटम के बारे में..."
                defaultValue={editingItem?.description}
                rows={3}
                className="text-base"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button className="flex-1 h-12 text-base font-medium" size="lg" onClick={handleSave}>
                {editingItem ? "सेव करें / Save" : "जोड़ें / Add"}
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="h-12 text-base"
                onClick={() => setIsSheetOpen(false)}
              >
                रद्द करें / Cancel
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}