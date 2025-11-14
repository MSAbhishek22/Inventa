"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, Mic, MicOff, Volume2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface VoiceCommandUIProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function VoiceCommandUI({ isOpen, onClose }: VoiceCommandUIProps) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [results, setResults] = useState<Array<{ type: string; message: string; messageHindi?: string }>>([]);
  const [waveform, setWaveform] = useState<number[]>(Array(20).fill(0));

  // Simulate voice activity waveform
  useEffect(() => {
    if (!isListening) return;

    const interval = setInterval(() => {
      setWaveform(Array(20).fill(0).map(() => Math.random()));
    }, 100);

    return () => clearInterval(interval);
  }, [isListening]);

  const startListening = () => {
    setIsListening(true);
    setTranscript("");
    setResults([]);
    
    // Simulate voice recognition with Indian context
    setTimeout(() => {
      setTranscript("Aashirvaad atta 5 kilo badha do");
    }, 1500);

    setTimeout(() => {
      setIsListening(false);
      setResults([
        { 
          type: "success", 
          message: "Stock Updated Successfully",
          messageHindi: "स्टॉक अपडेट हो गया ✓"
        },
        { 
          type: "info", 
          message: "Aashirvaad Atta: 25kg → 30kg",
          messageHindi: "आशीर्वाद आटा: 25 किलो → 30 किलो"
        },
      ]);
    }, 3500);
  };

  const stopListening = () => {
    setIsListening(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Bottom Sheet */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50 glass border-t-2 border-primary/20 rounded-t-3xl shadow-2xl max-h-[85vh] overflow-hidden"
          >
            <div className="container max-w-2xl mx-auto px-4 py-6 space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-14 w-14 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg">
                    <Volume2 className="h-7 w-7 text-primary-foreground" />
                  </div>
                  <div>
                    <h2 className="text-xl md:text-2xl font-bold high-contrast">
                      वॉइस कमांड / Voice Command
                    </h2>
                    <p className="text-sm md:text-base text-muted-foreground">
                      {isListening ? "सुन रहे हैं... / Listening..." : "बोलने के लिए टैप करें / Tap to speak"}
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={onClose} className="shrink-0">
                  <X className="h-6 w-6" />
                </Button>
              </div>

              {/* Language Hint */}
              <div className="bg-primary/10 rounded-xl p-3 text-center">
                <p className="text-sm font-medium text-primary">
                  हिंदी, English या Hinglish में बोलें 🎤
                  <br />
                  <span className="text-xs text-muted-foreground">
                    Speak in Hindi, English or Hinglish
                  </span>
                </p>
              </div>

              {/* Microphone Button */}
              <div className="flex flex-col items-center justify-center py-6 space-y-6">
                <Button
                  size="lg"
                  onClick={isListening ? stopListening : startListening}
                  className={cn(
                    "h-28 w-28 rounded-full transition-all duration-300 shadow-2xl",
                    isListening && "glow animate-pulse scale-110"
                  )}
                >
                  {isListening ? (
                    <MicOff className="h-12 w-12" />
                  ) : (
                    <Mic className="h-12 w-12" />
                  )}
                </Button>

                {/* Waveform Animation */}
                {isListening && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center justify-center gap-1.5 h-20"
                  >
                    {waveform.map((height, i) => (
                      <motion.div
                        key={i}
                        className="w-1.5 bg-primary rounded-full"
                        animate={{
                          height: `${20 + height * 50}px`,
                        }}
                        transition={{
                          duration: 0.1,
                        }}
                      />
                    ))}
                  </motion.div>
                )}
              </div>

              {/* Live Transcript */}
              <AnimatePresence>
                {transcript && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="bg-muted/70 rounded-xl p-4 text-center border-2 border-primary/20"
                  >
                    <p className="text-sm text-muted-foreground mb-1">आपने कहा / You said:</p>
                    <p className="text-lg md:text-xl font-semibold high-contrast">{transcript}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Results */}
              <AnimatePresence>
                {results.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-3 max-h-60 overflow-y-auto"
                  >
                    {results.map((result, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                      >
                        <Card className="border-2">
                          <CardContent className="p-4">
                            <div className="flex items-start gap-3">
                              <Badge
                                variant={result.type === "success" ? "default" : "secondary"}
                                className="mt-0.5 shrink-0"
                              >
                                {result.type === "success" ? "सफल / Success" : "जानकारी / Info"}
                              </Badge>
                              <div className="flex-1">
                                <p className="text-sm md:text-base font-medium">{result.message}</p>
                                {result.messageHindi && (
                                  <p className="text-sm text-muted-foreground mt-1">{result.messageHindi}</p>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Voice Commands Help */}
              {!isListening && results.length === 0 && (
                <div className="space-y-3">
                  <p className="text-sm font-semibold text-muted-foreground">
                    उदाहरण / Try saying:
                  </p>
                  <div className="grid gap-2">
                    {[
                      { cmd: "Aashirvaad atta 5 kilo badha do", hindi: "आशीर्वाद आटा 5 किलो बढ़ा दो" },
                      { cmd: "Maggi kitna bacha hai?", hindi: "मैगी कितना बचा है?" },
                      { cmd: "Tata salt kam ho raha hai", hindi: "टाटा नमक कम हो रहा है" },
                      { cmd: "5 Dairy Milk minus kar do", hindi: "5 डेयरी मिल्क माइनस कर दो" },
                    ].map((command, i) => (
                      <div
                        key={i}
                        className="bg-muted/40 rounded-lg px-4 py-3 border border-border/50"
                      >
                        <p className="text-sm font-medium">"{command.cmd}"</p>
                        <p className="text-xs text-muted-foreground mt-0.5">"{command.hindi}"</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}