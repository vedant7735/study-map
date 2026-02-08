# 🌳 Knowledge Tree

> Transform any PDF textbook into an explorable, zoomable knowledge map.

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38B2AC)](https://tailwindcss.com/)

---

## 📖 About

Knowledge Tree reimagines how we interact with educational content. Instead of scrolling through pages of text, you **navigate knowledge spatially** — like Google Maps, but for concepts.

**Upload a PDF → AI extracts the structure → Explore visually**

The application uses AI to analyze textbooks and documents, automatically extracting hierarchical concept structures with multi-level summaries. The result is an interactive canvas where you can zoom into topics to reveal deeper details, just like zooming into a map reveals more streets.

---

## ✨ Features

### 🗺️ Spatial Knowledge Navigation
- **Semantic Zoom**: Zoom in to reveal more detail, zoom out for the big picture
- **Progressive Disclosure**: Information density increases only as you zoom deeper
- **Spatial Memory**: Concepts have fixed positions, building spatial recall

### 🤖 AI-Powered Extraction
- **Automatic Structure Detection**: Chapters, sections, and concepts extracted automatically
- **Multi-Level Summaries**: Each concept has 4 levels of detail (10 words → 200 words)
- **Content Type Classification**: Conceptual, Procedural, Numerical, Examples, Taxonomic

### 💬 Familiar Chat Interface
- **ChatGPT-Style UI**: Upload PDFs through a familiar chat interface
- **Conversation History**: All your processed documents saved and accessible
- **Real-Time Processing**: Watch as your PDF transforms into a knowledge tree

### 📱 Modern User Experience
- **Responsive Design**: Works on desktop and tablet
- **Keyboard Navigation**: Press Escape to zoom out, click to zoom in
- **Touch Support**: Pinch-to-zoom on touch devices
- **Dark Mode**: Easy on the eyes for long study sessions

---

## 🎯 Use Cases

| User | Use Case |
|------|----------|
| **Students** | Transform textbooks into explorable study maps |
| **Researchers** | Quickly understand the structure of academic papers |
| **Professionals** | Navigate technical documentation spatially |
| **Teachers** | Create visual curriculum overviews |
| **Self-Learners** | Build personal knowledge libraries |

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Canvas**: HTML5 Canvas API
- **State**: React Context + Hooks

### Backend
- **Runtime**: Node.js
- **API**: Next.js API Routes
- **Database**: PostgreSQL (via Prisma ORM)
- **File Processing**: pdf-parse
- **AI**: OpenAI GPT-4o-mini

### Infrastructure
- **Hosting**: Vercel (recommended)
- **Database**: Supabase / Neon / Railway
- **Storage**: Vercel Blob (optional, for PDF storage)