# 🧠 Kenmark AI Chatbot — Full Stack AI Assistant

An AI-powered chatbot built for **Kenmark ITan Solutions** that answers user queries using structured company knowledge, Excel-based FAQs, and website content.  
The system demonstrates real-world AI integration, scalable backend design, and a modern UI.


---

## 📌 Project Overview

This project implements a production-style AI chatbot that:

- Understands user queries
- Retrieves information from:
  - Company knowledge files
  - Excel-based FAQs
  - Scraped website content
- Generates accurate and contextual AI responses using a local LLM
- Provides a clean, responsive chat interface
- Includes an Admin Panel for knowledge updates

---

## ⚙️ Tech Stack

| Layer | Technology |
|------|-----------|
Frontend | Next.js 16 (App Router), Tailwind CSS |
Backend | Next.js API Routes |
AI Engine | Ollama (Mistral) |
Knowledge Parsing | ExcelJS, File System |
Language | TypeScript |
UI | Responsive Chat Widget + Admin Panel |

---

## 🧩 Features

### Core
- Floating AI Chat Widget
- Session-based conversation memory
- Knowledge retrieval from multiple sources
- Non-hallucinatory AI responses
- Admin panel for Excel knowledge uploads

### Bonus
- Typing indicator
- Dark UI
- Website content ingestion
- Modular & scalable architecture

---

## 🧪 Example Knowledge Format (Excel)

| Category | Question | Answer |
|--------|---------|-------|
| About | What is Kenmark ITan Solutions? | Kenmark ITan Solutions is a technology company... |
| Services | What services are offered? | Consulting, AI solutions, training, etc. |
| Contact | How can I contact the company? | Visit kenmarkitan.com |

---

## 🚀 Setup & Run Instructions

### 1. Install Dependencies

```bash
npm install

### 2. Environment Variables

Create .env file:

OLLAMA_URL=http://127.0.0.1:11434

### 3. Start Application
npm run dev


### 🛠 Admin Panel

Access:

/admin


Upload Excel files containing structured company knowledge.


### 🧠 AI Model Details

Model: Mistral

Runtime: openrouter API

Approach: RAG (Retrieval Augmented Generation)
