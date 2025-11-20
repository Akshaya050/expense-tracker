# 🎯 Complete Beginner's Setup Guide

## What You'll Learn
- How to install everything needed
- Where to keep project files
- How to run the application
- How to push to GitHub
- How to fix common problems

---

## Part 1: Installing Software (One-Time Setup)

### 1.1 Install Node.js

**What it is:** JavaScript runtime that lets you run code on your computer

**How to install:**
1. Go to [https://nodejs.org/](https://nodejs.org/)
2. Download the **LTS version** (Long Term Support)
3. Run the installer
4. Keep clicking "Next" and "Accept"
5. **Verify installation:**
   - Open Command Prompt (Windows) or Terminal (Mac)
   - Type: `node --version`
   - Should show something like: `v18.17.0`
   - Type: `npm --version`
   - Should show something like: `9.6.7`

### 1.2 Install Git

**What it is:** Version control system to track changes and upload to GitHub

**How to install:**
1. Go to [https://git-scm.com/downloads](https://git-scm.com/downloads)
2. Download for your operating system
3. Run the installer
4. Keep default settings, click "Next"
5. **Verify installation:**
   - Open Command Prompt/Terminal
   - Type: `git --version`
   - Should show: `git version 2.x.x`

### 1.3 Install MongoDB (Choose One Option)

#### Option A: MongoDB Atlas (Cloud - Recommended for Beginners)

**Pros:** No local installation, works from anywhere, free tier available

**Steps:**
1. Go to [https://www.mongodb.com/cloud/atlas/register](https://www.mongodb.com/cloud/atlas/register)
2. Sign up with Google or Email
3. Choose **"Free" tier** (M0 Sandbox)
4. Choose your region (closest to you)
5. Click **"Create Cluster"** (takes 3-5 minutes)
6. Once created, click **"Connect"**
7. Add your current IP address
8. Create a database user (username + password) - **SAVE THESE!**
9. Choose **"Connect your application"**
10. Copy the connection string (looks like):
    ```
    mongodb+srv://username:<password>@cluster0.xxxxx.mongodb.net/
    ```
11. Replace `<password>` with your actual password

#### Option B: MongoDB Community Server (Local)

**Pros:** Works offline, faster for development

**Steps:**
1. Go to [https://www.mongodb.com/try/download/community](https://www.mongodb.com/try/download/community)
2. Download for your OS
3. Run installer, keep default settings
4. During installation, select **"Install MongoDB as a Service"**
5. After installation, MongoDB runs automatically

---

## Part 2: Project Setup

### 2.1 Where to Keep Your Project

**Recommended location:**

- **Windows:** `C:\Users\YourName\Projects\`
- **Mac/Linux:** `~/Projects/`

**Why?** Easy to find, no spaces in path, organized

### 2.2 Create Project Structure

Open Command Prompt (Windows) or Terminal (Mac):

```bash
# Navigate to where you want to keep projects
cd C:\Users\YourName\Documents  # Windows
# or
cd ~/Documents  # Mac/Linux

# Create Projects folder if it doesn't exist
mkdir Projects
cd Projects

# Create main project folder
mkdir expense-management-system
cd expense-management-system

# Create backend and frontend folders
mkdir backend frontend
```

Your structure now looks like:
```
C:\Users\YourName\Documents\Projects\expense-management-system\
├── backend\
└── frontend\
```

---

## Part 3: Setting Up Backend

### 3.1 Initialize Backend

```bash
# Go to backend folder
cd backend

# Create package.json
npm init -y

# Install all dependencies at once
npm install express mongoose cors helmet express-rate-limit express-validator dotenv node-cache

# Install development dependencies
npm install -D typescript @types/express @types/node @types/cors @types/node-cache nodemon ts-node jest @types/jest ts-jest
```

Wait for installation to complete (1-2 minutes).

### 3.2 Create Backend Files

**Option 1: Using VS Code (Recommended)**

1. Open VS Code
2. Click **"File"** → **"Open Folder"**
3. Navigate to `expense-management-system/backend`
4. Click **"Select Folder"**
5. Create files by right-clicking in the Explorer pane:
   - Right-click → **"New Folder"** → Name it `src`
   - Inside `src`, create folders: `controllers`, `models`, `routes`, `middleware`, `utils`
   - Create files as shown in the README

**Option 2: Using Command Line**

```bash
# Inside backend folder
mkdir -p src/controllers src/models src/routes src/middleware src/utils

# Create files (Windows)
type nul > src/server.ts
type nul > package.json
type nul > tsconfig.json
type nul > .env

# Create files (Mac/Linux)
touch src/server.ts package.json tsconfig.json .env
```

### 3.3 Copy Code from Artifacts

I provided code for these files:
- `src/server.ts`
- `src/models/Expense.ts`
- `src/routes/expenses.ts`
- `src/routes/categories.ts`
- `src/routes/analytics.ts`
- `src/controllers/expenseController.ts`
- `src/controllers/categoryController.ts`
- `src/controllers/analyticsController.ts`
- `src/middleware/errorHandler.ts`
- `src/middleware/validate.ts`
- `src/middleware/cache.ts`
- `src/utils/AppError.ts`
- `src/utils/catchAsync.ts`
- `package.json`
- `tsconfig.json`

**Copy each file's content from the artifacts above into the respective files.**

### 3.4 Create .env File

Create `.env` file in the `backend` folder:

**For MongoDB Atlas (Cloud):**
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/expense-management?retryWrites=true&w=majority
FRONTEND_URL=http://localhost:3000
```

**For Local MongoDB:**
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/expense-management
FRONTEND_URL=http://localhost:3000
```

---

## Part 4: Setting Up Frontend

### 4.1 Initialize Frontend

```bash
# Go to frontend folder (from project root)
cd ../frontend

# Create Vite React TypeScript project
npm create vite@latest . -- --template react-ts

# When prompted, press Enter to confirm

# Install dependencies
npm install

# Install additional packages
npm install react-hot-toast lucide-react

# Install Tailwind CSS
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### 4.2 Create Frontend Files

Create these folders inside `src`:
```bash
mkdir src/components src/services src/types
```

Copy code from artifacts for:
- `src/App.tsx`
- `src/main.tsx`
- `src/index.css`
- `src/components/Dashboard.tsx`
- `src/components/ExpenseForm.tsx`
- `src/components/ExpenseList.tsx`
- `src/components/Analytics.tsx`
- `src/services/api.ts`
- `src/types/index.ts`
- `index.html`
- `vite.config.ts`
- `tsconfig.json`
- `tailwind.config.js`

---

## Part 5: Running the Application

### 5.1 Start Backend

Open a new terminal/command prompt:

```bash
# Navigate to backend
cd C:\Users\YourName\Documents\Projects\expense-management-system\backend

# Start development server
npm run dev
```

**Expected output:**
```
✅ MongoDB connected successfully
🚀 Server running on port 5000
📍 API available at http://localhost:5000/api
```

**If you see errors:**
- Check MongoDB is running (if local)
- Check `.env` file has correct MongoDB connection string
- Check all dependencies are installed

### 5.2 Start Frontend

Open ANOTHER terminal (don't close the backend one):

```bash
# Navigate to frontend
cd C:\Users\YourName\Documents\Projects\expense-management-system\frontend

# Start development server
npm run dev
```

**Expected output:**
```
  VITE v5.0.8  ready in 500 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
```

### 5.3 Open in Browser

1. Open your browser (Chrome, Firefox, Edge)
2. Go to: `http://localhost:3000`
3. You should see the Expense Management System!

**Try it out:**
- Click "Expenses" tab
- Fill out the form on the left
- Click "Add Expense"
- See it appear in the list
- Check Dashboard and Analytics tabs

---

## Part 6: Pushing to GitHub

### 6.1 Create GitHub Account

1. Go to [https://github.com](https://github.com)
2. Click **"Sign up"**
3. Follow the steps
4. Verify your email

### 6.2 Create Repository on GitHub

1. Click the **"+"** icon (top right)
2. Select **"New repository"**
3. Repository name: `expense-management-system`
4. Description: "Full-stack expense tracking application"
5. Choose **Public** (so others can see it)
6. **DO NOT** check "Add a README file" (we already have one)
7. Click **"Create repository"**

### 6.3 Initialize Git Locally

```bash
# Go to project root
cd C:\Users\YourName\Documents\Projects\expense-management-system

# Initialize git
git init

# Create .gitignore
echo node_modules/ > .gitignore
echo .env >> .gitignore
echo dist/ >> .gitignore
echo build/ >> .gitignore

# Add all files
git add .

# Create first commit
git commit -m "Initial commit: Full-stack expense management system"
```

### 6.4 Push to GitHub

**Replace `YOUR_USERNAME` with your actual GitHub username:**

```bash
# Connect to GitHub repository
git remote add origin https://github.com/YOUR_USERNAME/expense-management-system.git

# Rename branch to main
git branch -M main

# Push code to GitHub
git push -u origin main
```

**GitHub will ask for credentials:**
- Username: Your GitHub username
- Password: Use a **Personal Access Token** (not your password)

**How to create Personal Access Token:**
1. GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click "Generate new token (classic)"
3. Give it a name: "Expense Management System"
4. Select scopes: ✅ repo (all checkboxes)
5. Click "Generate token"
6. **COPY THE TOKEN** (you'll only see it once!)
7. Use this token as password when pushing

### 6.5 Verify on GitHub

1. Go to your repository page on GitHub
2. Refresh the page
3. You should see all your files!
4. The README.md will display automatically

---

## Part 7: Making Changes and Updating

### 7.1 Making Changes

1. Edit any file in VS Code
2. Save the file (Ctrl+S or Cmd+S)
3. The development servers will auto-reload

### 7.2 Pushing Updates to GitHub

```bash
# Check what changed
git status

# Add all changed files
git add .

# Commit with a descriptive message
git commit -m "Add new feature: expense filtering"

# Push to GitHub
git push
```

---

## Part 8: Troubleshooting

### Problem: "npm command not found"

**Solution:** Node.js not installed or not in PATH
- Restart your computer
- Reinstall Node.js
- Make sure to check "Add to PATH" during installation

### Problem: "Port 5000 is already in use"

**Solution:** Another app is using that port
- Change port in `backend/.env`: `PORT=5001`
- Restart backend server

### Problem: "MongoDB connection failed"

**Solution:**
- **Atlas:** Check connection string in `.env`, ensure password is correct
- **Local:** Open Services (Windows) and start "MongoDB Server"

### Problem: "Cannot find module"

**Solution:** Dependencies not installed
```bash
cd backend
npm install

cd ../frontend
npm install
```

### Problem: CORS error in browser

**Solution:** Check `FRONTEND_URL` in backend `.env`:
```env
FRONTEND_URL=http://localhost:3000
```

### Problem: Blank white screen

**Solution:**
1. Open browser console (F12)
2. Check for errors
3. Make sure backend is running
4. Check API_URL in frontend

---

## Part 9: VS Code Tips

### Recommended Extensions

1. **ESLint** - Code quality
2. **Prettier** - Code formatting
3. **Thunder Client** - Test APIs
4. **GitLens** - Better Git integration
5. **Error Lens** - Inline errors

### Keyboard Shortcuts

- `Ctrl+`` - Toggle terminal
- `Ctrl+P` - Quick file search
- `Ctrl+Shift+P` - Command palette
- `Ctrl+B` - Toggle sidebar
- `Ctrl+/` - Comment/uncomment line

---

## Part 10: Next Steps

### What to Learn Next

1. **Add Authentication**
   - User login/signup
   - JWT tokens
   - Protected routes

2. **Add More Features**
   - Export to CSV
   - Budget limits
   - Notifications
   - Dark mode

3. **Deploy Online**
   - Frontend: Vercel/Netlify
   - Backend: Railway/Render
   - Database: MongoDB Atlas

### Resources

- [React Documentation](https://react.dev)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [MongoDB Tutorial](https://www.mongodb.com/docs/manual/tutorial/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)

---

## 🎉 Congratulations!

You now have a fully functional full-stack application!

**What you've accomplished:**
- ✅ Set up a complete development environment
- ✅ Built a production-ready backend API
- ✅ Created an interactive React frontend
- ✅ Connected to a database
- ✅ Pushed code to GitHub

**Keep building and learning! 🚀**