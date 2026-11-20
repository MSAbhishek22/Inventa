"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { X, Mic, MicOff, Volume2, Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { parseVoiceCommand, type VoiceItem } from "@/lib/voiceCommand";

interface VoiceCommandUIProps {
  isOpen: boolean;
  onClose: () => void;
  /** Current inventory (from the Inventory page). Optional: on other pages
   *  the mic still works, but stock can only be changed from Inventory. */
  items?: VoiceItem[];
  /** Apply a signed stock change (+add / -remove) for an item id. */
  onApplyCommand?: (itemId: number, delta: number) => void;
}

type ResultType = "success" | "info" | "warning" | "error";

interface CommandResult {
  type: ResultType;
  message: string;
  messageHindi?: string;
}

/* --- Minimal Web Speech API typing (not in TS DOM lib) --- */
interface SpeechResultLike {
  isFinal: boolean;
  0: { transcript: string };
}
interface SpeechRecognitionEventLike {
  resultIndex: number;
  results: ArrayLike<SpeechResultLike>;
}
interface SpeechRecognitionLike {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  maxAlternatives: number;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
}
type SpeechRecognitionCtor = new () => SpeechRecognitionLike;

function getSpeechRecognitionCtor(): SpeechRecognitionCtor | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as {
    SpeechRecognition?: SpeechRecognitionCtor;
    webkitSpeechRecognition?: SpeechRecognitionCtor;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

function fmtQty(q: number): string {
  return Number.isInteger(q) ? String(q) : String(Math.round(q * 100) / 100);
}

export default function VoiceCommandUI({ isOpen, onClose, items, onApplyCommand }: VoiceCommandUIProps) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [results, setResults] = useState<CommandResult[]>([]);
  const [waveform, setWaveform] = useState<number[]>(Array(20).fill(0));
  const [speechSupported, setSpeechSupported] = useState<boolean | null>(null);
  const [typedCommand, setTypedCommand] = useState("");

  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const finalTranscriptRef = useRef("");
  const errorRef = useRef(false);
  const processedRef = useRef(false);

  // Voice activity waveform (visual only, while listening)
  useEffect(() => {
    if (!isListening) return;

    const interval = setInterval(() => {
      setWaveform(Array(20).fill(0).map(() => Math.random()));
    }, 100);

    return () => clearInterval(interval);
  }, [isListening]);

  // Detect speech support once on mount
  useEffect(() => {
    setSpeechSupported(getSpeechRecognitionCtor() !== null);
  }, []);

  // Stop the mic if the sheet is closed mid-listen
  useEffect(() => {
    if (!isOpen && recognitionRef.current) {
      recognitionRef.current.abort();
      recognitionRef.current = null;
      setIsListening(false);
    }
  }, [isOpen]);

  useEffect(() => {
    return () => {
      recognitionRef.current?.abort();
      recognitionRef.current = null;
    };
  }, []);

  const processCommand = (rawText: string) => {
    const text = rawText.trim();
    if (!text) return;
    setTranscript(text);

    if (!items || !onApplyCommand) {
      setResults([
        {
          type: "info",
          message: "Stock can only be changed from the Inventory page",
          messageHindi: "स्टॉक बदलने के लिए इन्वेंटरी पेज से वॉइस कमांड दें",
        },
      ]);
      return;
    }

    const parsed = parseVoiceCommand(text, items);
    if (!parsed) {
      setResults([
        {
          type: "error",
          message: "Samajh nahi aaya, phir se bolo",
          messageHindi: "समझ नहीं आया, फिर से बोलो",
        },
      ]);
      return;
    }

    const { item, action, quantity } = parsed;
    const delta = action === "add" ? quantity : -quantity;
    const oldQty = item.quantity;
    const newQty = Math.max(0, Math.round((oldQty + delta) * 100) / 100);

    onApplyCommand(item.id, delta);

    const next: CommandResult[] = [
      {
        type: "success",
        message: "Stock Updated Successfully",
        messageHindi: "स्टॉक अपडेट हो गया ✓",
      },
      {
        type: "info",
        message: `${item.name}: ${fmtQty(oldQty)}${item.unit} → ${fmtQty(newQty)}${item.unit}`,
        messageHindi: `${item.nameHindi}: ${fmtQty(oldQty)} → ${fmtQty(newQty)} ${item.unit}`,
      },
    ];

    if (newQty <= item.threshold) {
      next.push({
        type: "warning",
        message: `Low stock — ${item.name} is at ${fmtQty(newQty)}${item.unit} (min ${item.threshold}${item.unit})`,
        messageHindi: `स्टॉक कम है — ${item.nameHindi} सिर्फ ${fmtQty(newQty)} ${item.unit} बचा है`,
      });
    }

    setResults(next);
  };

  const startListening = () => {
    const Ctor = getSpeechRecognitionCtor();
    if (!Ctor) {
      setSpeechSupported(false);
      setResults([
        {
          type: "error",
          message: "Voice is not supported in this browser — type your command below",
          messageHindi: "इस ब्राउज़र में वॉइस सपोर्ट नहीं है — नीचे कमांड टाइप करें",
        },
      ]);
      return;
    }

    setTranscript("");
    setResults([]);
    finalTranscriptRef.current = "";
    errorRef.current = false;
    processedRef.current = false;

    const recognition = new Ctor();
    recognition.lang = "hi-IN";
    recognition.interimResults = true;
    recognition.continuous = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      let interim = "";
      let finalText = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) finalText += result[0].transcript;
        else interim += result[0].transcript;
      }
      if (finalText) finalTranscriptRef.current += finalText;
      setTranscript(finalTranscriptRef.current + interim);
    };

    recognition.onerror = (event) => {
      errorRef.current = true;
      setIsListening(false);
      if (event.error === "not-allowed" || event.error === "service-not-allowed") {
        setResults([
          {
            type: "error",
            message: "Microphone permission was not given — allow the mic, or type your command below",
            messageHindi: "माइक की अनुमति नहीं मिली — अनुमति दें, या नीचे कमांड टाइप करें",
          },
        ]);
      } else if (event.error === "no-speech") {
        setResults([
          {
            type: "error",
            message: "Samajh nahi aaya, phir se bolo",
            messageHindi: "कुछ सुनाई नहीं दिया, फिर से बोलो",
          },
        ]);
      }
    };

    recognition.onend = () => {
      setIsListening(false);
      recognitionRef.current = null;
      const heard = finalTranscriptRef.current.trim();
      if (heard && !errorRef.current && !processedRef.current) {
        processedRef.current = true;
        processCommand(heard);
      }
    };

    recognitionRef.current = recognition;
    try {
      recognition.start();
      setIsListening(true);
    } catch {
      setIsListening(false);
      recognitionRef.current = null;
    }
  };

  const stopListening = () => {
    // onend fires after stop() and processes whatever was heard.
    recognitionRef.current?.stop();
  };

  const handleTypedSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!typedCommand.trim()) return;
    processCommand(typedCommand);
    setTypedCommand("");
  };

  const resultBadge = (type: ResultType) => {
    switch (type) {
      case "success":
        return { variant: "default" as const, label: "सफल / Success" };
      case "warning":
        return { variant: "destructive" as const, label: "चेतावनी / Low Stock" };
      case "error":
        return { variant: "destructive" as const, label: "गलती / Error" };
      default:
        return { variant: "secondary" as const, label: "जानकारी / Info" };
    }
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
            <div className="container max-w-2xl mx-auto px-4 py-6 space-y-6 overflow-y-auto max-h-[85vh]">
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

              {/* Speech unsupported notice */}
              {speechSupported === false && (
                <div className="bg-destructive/10 rounded-xl p-3 text-center border border-destructive/30">
                  <p className="text-sm font-medium text-destructive">
                    इस ब्राउज़र में वॉइस सपोर्ट नहीं है
                    <br />
                    <span className="text-xs">
                      Voice is not supported in this browser — type your command below instead.
                    </span>
                  </p>
                </div>
              )}

              {/* Microphone Button */}
              <div className="flex flex-col items-center justify-center py-6 space-y-6">
                <Button
                  size="lg"
                  onClick={isListening ? stopListening : startListening}
                  disabled={speechSupported === false}
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

              {/* Typed command fallback */}
              <form onSubmit={handleTypedSubmit} className="flex gap-2">
                <Input
                  value={typedCommand}
                  onChange={(e) => setTypedCommand(e.target.value)}
                  placeholder="या यहाँ कमांड टाइप करें — e.g. chini 1 kilo kam kar do"
                  className="h-12 text-base flex-1"
                />
                <Button type="submit" size="lg" className="h-12 shrink-0">
                  <Send className="h-5 w-5 mr-2" />
                  भेजें
                </Button>
              </form>

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
                    {results.map((result, i) => {
                      const badge = resultBadge(result.type);
                      return (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.1 }}
                        >
                          <Card
                            className={cn(
                              "border-2",
                              result.type === "error" && "border-destructive/50 bg-destructive/5",
                              result.type === "warning" && "border-orange-500/50 bg-orange-500/5"
                            )}
                          >
                            <CardContent className="p-4">
                              <div className="flex items-start gap-3">
                                <Badge variant={badge.variant} className="mt-0.5 shrink-0">
                                  {badge.label}
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
                      );
                    })}
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
                      { cmd: "Chini 1 kilo kam kar do", hindi: "चीनी 1 किलो कम कर दो" },
                      { cmd: "Add 2 kg sugar", hindi: "2 किलो चीनी बढ़ा दो" },
                      { cmd: "Maggi 10 packet badha do", hindi: "मैगी 10 पैकेट बढ़ा दो" },
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
