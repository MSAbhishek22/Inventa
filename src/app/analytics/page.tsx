"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import BottomNav from "@/components/BottomNav";
import VoiceCommandUI from "@/components/VoiceCommandUI";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, IndianRupee, Mic, Package, ShoppingCart } from "lucide-react";
import { Bar, BarChart, Line, LineChart, Pie, PieChart, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const monthlyData = [
  { month: "जन / Jan", sales: 4200, orders: 145, revenue: 125000 },
  { month: "फर / Feb", sales: 3800, orders: 132, revenue: 112000 },
  { month: "मार / Mar", sales: 5100, orders: 178, revenue: 153000 },
  { month: "अप्र / Apr", sales: 4600, orders: 159, revenue: 138000 },
  { month: "मई / May", sales: 5800, orders: 201, revenue: 174000 },
  { month: "जून / Jun", sales: 6200, orders: 215, revenue: 186000 },
];

const categoryData = [
  { name: "आटा/दाल", value: 35, color: "#0A84FF" },
  { name: "बिस्कुट", value: 25, color: "#00A66C" },
  { name: "नमकीन", value: 20, color: "#FFB020" },
  { name: "डेयरी", value: 12, color: "#E54848" },
  { name: "मसाले", value: 8, color: "#9D9D9D" },
];

const topProducts = [
  { name: "Aashirvaad Atta / आशीर्वाद आटा", sold: 245, revenue: 12740, trend: "+12%" },
  { name: "Parle-G / पारले-जी", sold: 523, revenue: 5230, trend: "+18%" },
  { name: "Maggi Noodles / मैगी", sold: 387, revenue: 4644, trend: "+25%" },
  { name: "Tata Salt / टाटा नमक", sold: 198, revenue: 3960, trend: "+8%" },
  { name: "Fortune Oil / फॉर्च्यून तेल", sold: 156, revenue: 27300, trend: "+5%" },
];

export default function AnalyticsPage() {
  const [showVoiceUI, setShowVoiceUI] = useState(false);
  const [timeRange, setTimeRange] = useState("6m");

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-y-auto pb-20 md:pb-6">
          <div className="container px-4 md:px-6 py-6 space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight high-contrast">
                  एनालिटिक्स / Analytics
                </h1>
                <p className="text-muted-foreground text-base md:text-lg">
                  अपनी दुकान का प्रदर्शन देखें / Track shop performance
                </p>
              </div>
              <Tabs defaultValue="6m" onValueChange={setTimeRange}>
                <TabsList>
                  <TabsTrigger value="7d">7 दिन</TabsTrigger>
                  <TabsTrigger value="1m">1 महीना</TabsTrigger>
                  <TabsTrigger value="6m">6 महीने</TabsTrigger>
                  <TabsTrigger value="1y">1 साल</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              <Card className="border-2">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground">
                    कुल बिक्री / Total Revenue
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl md:text-3xl font-bold flex items-center high-contrast">
                    <IndianRupee className="h-5 w-5 md:h-6 md:w-6" />
                    8.88L
                  </div>
                  <p className="text-xs text-green-600 dark:text-green-500 flex items-center gap-1 mt-1">
                    <TrendingUp className="h-3 w-3" />
                    +12.5%
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground">
                    कुल ऑर्डर / Orders
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl md:text-3xl font-bold high-contrast">1,030</div>
                  <p className="text-xs text-green-600 dark:text-green-500 flex items-center gap-1 mt-1">
                    <TrendingUp className="h-3 w-3" />
                    +8.2%
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground">
                    बिके आइटम / Items Sold
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl md:text-3xl font-bold high-contrast">29.8k</div>
                  <p className="text-xs text-green-600 dark:text-green-500 flex items-center gap-1 mt-1">
                    <TrendingUp className="h-3 w-3" />
                    +15.3%
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground">
                    औसत बिल / Avg Bill
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl md:text-3xl font-bold flex items-center high-contrast">
                    <IndianRupee className="h-5 w-5 md:h-6 md:w-6" />
                    862
                  </div>
                  <p className="text-xs text-green-600 dark:text-green-500 flex items-center gap-1 mt-1">
                    <TrendingUp className="h-3 w-3" />
                    +3.8%
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Charts */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Revenue Chart */}
              <Card className="border-2">
                <CardHeader>
                  <CardTitle className="text-lg md:text-xl">
                    बिक्री ट्रेंड / Revenue Trend
                  </CardTitle>
                  <CardDescription className="text-sm md:text-base">
                    पिछले 6 महीनों की बिक्री / Monthly revenue (₹)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={monthlyData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis 
                          dataKey="month" 
                          stroke="hsl(var(--muted-foreground))"
                          fontSize={11}
                        />
                        <YAxis 
                          stroke="hsl(var(--muted-foreground))"
                          fontSize={11}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "hsl(var(--card))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "8px",
                            fontSize: "12px"
                          }}
                        />
                        <Line
                          type="monotone"
                          dataKey="revenue"
                          stroke="#0A84FF"
                          strokeWidth={3}
                          dot={{ fill: "#0A84FF", r: 4 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Sales Chart */}
              <Card className="border-2">
                <CardHeader>
                  <CardTitle className="text-lg md:text-xl">
                    बिक्री प्रदर्शन / Sales Performance
                  </CardTitle>
                  <CardDescription className="text-sm md:text-base">
                    महीने के अनुसार आइटम बिक्री / Items sold per month
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={monthlyData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis 
                          dataKey="month" 
                          stroke="hsl(var(--muted-foreground))"
                          fontSize={11}
                        />
                        <YAxis 
                          stroke="hsl(var(--muted-foreground))"
                          fontSize={11}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "hsl(var(--card))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "8px",
                            fontSize: "12px"
                          }}
                        />
                        <Bar
                          dataKey="sales"
                          fill="#0A84FF"
                          radius={[8, 8, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Category Distribution */}
              <Card className="border-2">
                <CardHeader>
                  <CardTitle className="text-lg md:text-xl">
                    श्रेणी वितरण / Category Distribution
                  </CardTitle>
                  <CardDescription className="text-sm md:text-base">
                    श्रेणी के अनुसार बिक्री / Sales by category
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={categoryData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {categoryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "hsl(var(--card))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "8px",
                            fontSize: "12px"
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Top Products */}
              <Card className="border-2">
                <CardHeader>
                  <CardTitle className="text-lg md:text-xl">
                    सबसे ज़्यादा बिकने वाले / Top Products
                  </CardTitle>
                  <CardDescription className="text-sm md:text-base">
                    इस महीने के बेस्ट प्रोडक्ट्स / Best sellers this month
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {topProducts.map((product, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm md:text-base truncate high-contrast">
                            {product.name}
                          </p>
                          <p className="text-xs md:text-sm text-muted-foreground">
                            {product.sold} यूनिट बिके
                          </p>
                        </div>
                        <div className="text-right shrink-0 ml-2">
                          <p className="font-bold flex items-center justify-end text-sm md:text-base">
                            <IndianRupee className="h-3 w-3 md:h-4 md:w-4" />
                            {(product.revenue / 1000).toFixed(1)}k
                          </p>
                          <p
                            className={`text-xs md:text-sm font-medium ${
                              product.trend.startsWith("+")
                                ? "text-green-600 dark:text-green-500"
                                : "text-red-600 dark:text-red-500"
                            }`}
                          >
                            {product.trend}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
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