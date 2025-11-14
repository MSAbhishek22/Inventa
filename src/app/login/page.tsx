"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mic, Store, Phone } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function LoginPage() {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [showOTP, setShowOTP] = useState(false);
  const [language, setLanguage] = useState("hindi");
  const router = useRouter();

  const handleSendOTP = (e: React.FormEvent) => {
    e.preventDefault();
    setShowOTP(true);
  };

  const handleVerifyOTP = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-background dark:via-background dark:to-primary/5 p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-3">
          <div className="mx-auto h-20 w-20 rounded-2xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-xl">
            <Store className="h-10 w-10 text-primary-foreground" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight high-contrast">
            स्वागत है / Welcome
          </h1>
          <p className="text-muted-foreground text-base md:text-lg">
            अपनी दुकान का स्टॉक आवाज़ से मैनेज करें
            <br />
            Manage your shop with voice commands
          </p>
        </div>

        <Card className="border-2 shadow-2xl">
          <CardHeader>
            <CardTitle className="text-xl">
              लॉगिन करें / Login
            </CardTitle>
            <CardDescription className="text-base">
              अपना मोबाइल नंबर डालें / Enter your mobile number
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {/* Language Selection */}
            <div className="space-y-2">
              <Label htmlFor="language" className="text-base font-medium">
                भाषा चुनें / Choose Language
              </Label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger id="language" className="h-12 text-base">
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
                </SelectContent>
              </Select>
            </div>

            {!showOTP ? (
              <form onSubmit={handleSendOTP} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-base font-medium">
                    मोबाइल नंबर / Mobile Number
                  </Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      className="h-12 text-base pl-10"
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full h-12 text-base font-medium" size="lg">
                  OTP भेजें / Send OTP
                </Button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOTP} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="otp" className="text-base font-medium">
                    OTP डालें / Enter OTP
                  </Label>
                  <Input
                    id="otp"
                    type="text"
                    placeholder="6-digit OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                    maxLength={6}
                    className="h-12 text-base text-center text-2xl tracking-widest"
                  />
                  <p className="text-sm text-muted-foreground text-center">
                    {phone} पर OTP भेजा गया है
                  </p>
                </div>

                <Button type="submit" className="w-full h-12 text-base font-medium" size="lg">
                  वेरिफाई करें / Verify & Login
                </Button>

                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-full h-12 text-base font-medium"
                  onClick={() => setShowOTP(false)}
                >
                  नंबर बदलें / Change Number
                </Button>
              </form>
            )}

            <div className="mt-6 text-center text-base">
              <span className="text-muted-foreground">
                नया यूज़र हैं? / New user?{" "}
              </span>
              <Link href="/signup" className="text-primary font-medium hover:underline">
                साइन अप करें / Sign up
              </Link>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-muted-foreground px-4">
          जारी रखने से आप हमारी शर्तों और निजता नीति से सहमत हैं
          <br />
          By continuing, you agree to our Terms & Privacy Policy
        </p>
      </div>
    </div>
  );
}