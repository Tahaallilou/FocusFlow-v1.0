# 🚀 FocusFlow

FocusFlow is a modern, all-in-one productivity web application designed to help users **plan, prioritize, and execute their work efficiently**.

It combines task management, habit tracking, focus sessions, and analytics into a single unified system — helping users stop guessing what to do next and start working with clarity.

---

## 🌟 Overview

FocusFlow is built as a **frontend-only application** that runs entirely in the browser.
All user data is stored locally, ensuring **privacy, speed, and offline capability**.

The application focuses on solving a key problem:

> Users often struggle to decide what to work on next and maintain consistent productivity habits.

FocusFlow provides a structured system to:

* Organize tasks
* Track habits
* Maintain focus
* Analyze progress

---

## ✨ Key Features

### 🧠 Smart Task Management

* Create, edit, and delete tasks
* Set priorities and deadlines
* Filter and search tasks
* Track completion status

### ⚡ Smart Task Recommendation

* Suggests the **best task to work on**
* Based on:

  * Priority
  * Deadline urgency
  * User energy level

---

### 🔁 Habit Tracking

* Create daily or custom habits
* Track streaks and consistency
* GitHub-style heatmap visualization
* Completion statistics

---

### ⏱️ Focus Timer (Pomodoro System)

* Start focused work sessions
* Link sessions to tasks
* Track total focus time
* Accurate timer using real timestamps

---

### 📊 Analytics Dashboard

* Task completion trends
* Focus time evolution
* Habit performance metrics
* Visual charts and graphs

---

### 📅 Calendar View

* Visualize task deadlines
* Navigate tasks by date
* Monthly/weekly overview

---

### 🧩 Eisenhower Matrix

* Automatic task categorization:

  * Urgent & Important
  * Not Urgent & Important
  * Urgent & Not Important
  * Not Urgent & Not Important

---

### 📝 Notes System

* Quick capture for ideas and thoughts
* Lightweight and fast

---

### ⚙️ Settings & Customization

* Light / Dark mode
* Focus timer configuration
* Data import/export
* Reset application data

---

## 🛠️ Tech Stack

### Core

* **React** (JavaScript)
* **Vite**
* **React Router**

### UI & Styling

* **Tailwind CSS**
* **Radix UI**
* **shadcn/ui style components**
* **Lucide Icons**

### Data & Visualization

* **Recharts**
* **react-calendar-heatmap**

### Utilities

* **date-fns**
* **clsx & tailwind-merge**

---

## 🏗️ Architecture

The application follows a **modular and scalable architecture**:

### State Management

* React Context + Reducer pattern
* Separate contexts for:

  * Tasks
  * Habits
  * Sessions
  * Notes
  * Settings
  * Auth

### Data Persistence

* LocalStorage (no backend)
* Custom hooks:

  * `useLocalStorage`
  * `useEnhancedReducer`

### Project Structure

```
src/
├── components/
├── context/
├── hooks/
├── pages/
├── utils/
```

---

## ⚙️ Installation

```bash
git clone https://github.com/Tahaallilou/FocusFlow-v1.0.git
cd FocusFlow-v1.0
npm install
npm run dev
```

---

## 📦 Build

```bash
npm run build
```

---

## 🚀 Usage

1. Create tasks with priorities and deadlines
2. Track your habits daily
3. Start focus sessions
4. Follow recommendations
5. Analyze your productivity

---

## 🎯 Project Objectives

The goal of FocusFlow is to:

* Reduce decision fatigue
* Improve focus and execution
* Encourage habit consistency
* Provide meaningful productivity insights

---

## ⚠️ Limitations

* No backend (data stored locally)
* No real authentication system
* Data is tied to the browser

---

## 🔮 Future Improvements

* Backend integration (Node.js / database)
* Real authentication system
* Cloud sync
* Mobile version
* Notifications system
