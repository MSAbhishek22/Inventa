# 🛒 **Inventa – Voice-Enabled Inventory for Indian Grocery Stores**

*A modern, intuitive way for India’s kirana shops & city marts to manage stock — hands-free, stress-free.*

**🔗 Live app:** https://inventa-umber.vercel.app/ · **Inventory page:** https://inventa-umber.vercel.app/inventory

---

## 🌟 **Overview**

Inventa is a **voice-first inventory web app** designed for India’s most hard-working businesses — grocery shops, kirana stores, mini-marts, and wholesale outlets.

Shop owners can simply **speak in Hindi, English, or Hinglish** to update items, check quantities, and receive low-stock alerts.
No typing. No learning curve. No complex screens.

> **Inventa turns everyday inventory work into a simple conversation.**

---

## 🎯 **Why This Problem Matters**

Indian grocery stores operate in chaos — customers flowing in, goods being unloaded, payments happening simultaneously, and owners juggling dozens of SKUs from atta to dairy to snacks.

But existing tools fail because they are:

* ❌ Too cluttered
* ❌ Not language-friendly
* ❌ Hard to use during rush hours
* ❌ Made for offices, not shops
* ❌ Unreliable on low-end Android phones
* ❌ Not designed for India’s multilingual reality

Inventa solves these challenges by removing friction and bringing **human-centered simplicity** to one of India’s biggest retail segments.

---

## 💡 **What Inventa Does**

Inventa blends **voice, simplicity, and smart automation** to help shopkeepers stay in control without slowing down.

Shop owners can say things like:

* **“Aashirvaad atta 2 packet add kar do.”**
* **“Fortune oil ka stock kitna bacha?”**
* **“Maggi 4 packet minus kar do.”**

And Inventa handles the rest — updating stock, alerting low quantities, and logging every change neatly.

---

## 🚀 **Key Features**

### 🎤 **Natural Voice-Based Stock Updates**

Speak naturally in Hindi, Hinglish, or English.
Inventa recognizes common grocery brands, units (kg, packet, litre), and local pronunciations.

The mic understands the item and the quantity you say, and the stock number on the inventory page actually changes right away. If the updated quantity drops below that item's low-stock level, Inventa shows a low-stock warning for it.

### 📊 **Smart Analytics for Real Indian Retail**

* Fast-moving items
* Top-selling categories
* Daily consumption patterns
* Stock value (₹)
* Shortage predictions

### ⚠️ **Precise Low Stock Alerts**

Critical essentials like oil, milk, rice, sugar, and snacks get highlighted instantly.

### 🛍 **Kirana-Friendly Inventory Structure**

Supports **kg, g, L, ml, packets, pieces, dozen**, and variants (e.g., 500g, 1kg).

### 📱 **Mobile-First for Low-End Devices**

* Large tappable UI
* High contrast for outdoor shops
* Offline-first caching
* Lightweight screens
* Zero clutter

### 🎧 **Custom Voice Engine UI (Non-Agora)**

* “Listening…”
* “Processing…”
* “Network Slow — Switching to Offline”
* “Couldn’t understand — say again?”

---

## 🧭 **How It Works (20-Second Flow)**

1. Open Inventa on your phone
2. Tap the big microphone button
3. Speak your command
4. See instant confirmation
5. Monitor alerts on dashboard
6. Explore analytics anytime

Simple. Predictable. Reliable.

---

## 🧱 **Tech Stack (Clean & Practical)**

* **Frontend:** Next.js 15 (App Router), React, TypeScript
* **Styling:** TailwindCSS, shadcn/ui components
* **Voice Layer:** Custom STT/TTS pipeline
* **Hosting:** Live on Vercel — https://inventa-umber.vercel.app/

---

## 🎨 **Design Philosophy**

Inventa is built with an aesthetic that feels:

* Calm
* Familiar
* Crisp
* Practical

Inspired by:

* Apple’s clarity
* Notion’s elegance
* Linear’s discipline
* Indian kirana workflows

Every screen is crafted to **stay out of the shopkeeper’s way** and help them finish tasks instantly.

---

## 📂 **Project Structure**

```
/src
  /components      → Reusable UI elements
  /pages           → Main routes (Dashboard, Inventory, Alerts, etc.)
  /voice           → Voice UI + state handlers
  /inventory       → Stock logic + models
  /analytics       → Charts + insights
  /settings        → Preferences, language, offline
  /utils           → Helpers + formatting
```

---

## 🔮 **Future Roadmap**

### 1️⃣ **Complete Indian Language Suite**

Tamil, Telugu, Marathi, Bengali, Kannada, Gujarati.

### 2️⃣ **Billing + GST Integration**

One click → Generate bill → Auto-update stock.

### 3️⃣ **WhatsApp Notifications**

Share low-stock alerts or daily summary to self or staff.

### 4️⃣ **AI Forecasting Engine**

Predict shortages, reorder suggestions, seasonal demand mapping.

### 5️⃣ **Assistant Mode**

A conversational AI that helps during rush hours.

---

## 🏁 **Why Inventa Matters**

India has nearly **13 million kirana shops** — the backbone of daily life.
Most still rely on memory, notebooks, or staff to track inventory.
Errors cost them money.
Manual work costs them time.

**Inventa gives them superpowers without changing their habits.**

> No typing. No training.
> Just speak → and your work is done.

---

## ▶️ **Run Locally (for developers)**

Inventa is already live at https://inventa-umber.vercel.app/ — the steps below are only if you want to run the code on your own machine.

```bash
git clone https://github.com/MSAbhishek22/Inventa.git
cd Inventa
npm install
npm run dev
```

Then open `http://localhost:3000` in your browser.
