# 🐙 Essential Git Commands for Beginners

## What is Git?
Git is a version control system that:
- Tracks changes to your code
- Lets you go back to previous versions
- Helps you collaborate with others
- Backs up your code to GitHub

---

## Initial Setup (One-Time)

### Configure Your Identity
```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

### Check Your Configuration
```bash
git config --list
```

---

## Starting a New Project

### Initialize Git in Your Project
```bash
cd your-project-folder
git init
```

**What this does:** Creates a hidden `.git` folder that tracks all changes

---

## Daily Git Workflow

### 1. Check Status (Most Important!)
```bash
git status
```

**What you'll see:**
- Red files = Changes not staged
- Green files = Changes staged for commit
- "nothing to commit" = All changes saved

### 2. Add Files to Staging
```bash
# Add specific file
git add filename.txt

# Add all files
git add .

# Add all files in current directory
git add *
```

### 3. Commit Changes
```bash
git commit -m "Your message here"
```

**Good commit messages:**
- ✅ "Add expense form validation"
- ✅ "Fix delete button bug"
- ✅ "Update README with setup instructions"

**Bad commit messages:**
- ❌ "Update"
- ❌ "Changes"
- ❌ "asdfgh"

### 4. Push to GitHub
```bash
# First time
git push -u origin main

# After that, just
git push
```

---

## Complete Workflow Example

```bash
# 1. Make changes to files in VS Code

# 2. Check what changed
git status

# 3. Add all changes
git add .

# 4. Commit with message
git commit -m "Add category filter feature"

# 5. Push to GitHub
git push
```

---

## Connecting to GitHub

### Add Remote Repository
```bash
git remote add origin https://github.com/username/repository.git
```

### Check Remote URL
```bash
git remote -v
```

### Change Remote URL
```bash
git remote set-url origin https://github.com/username/new-repository.git
```

---

## Viewing History

### See Commit History
```bash
git log
```

**Prettier format:**
```bash
git log --oneline --graph --all
```

### See Last 5 Commits
```bash
git log -5
```

### See What Changed in Last Commit
```bash
git show
```

---

## Undoing Changes

### Undo Changes in Working Directory (Before git add)
```bash
# Undo changes to specific file
git checkout -- filename.txt

# Undo all changes
git checkout -- .
```

**Warning:** This permanently removes your changes!

### Unstage Files (After git add, Before git commit)
```bash
# Unstage specific file
git reset filename.txt

# Unstage all files
git reset
```

### Undo Last Commit (Keep Changes)
```bash
git reset --soft HEAD~1
```

### Undo Last Commit (Discard Changes)
```bash
git reset --hard HEAD~1
```

**Warning:** `--hard` deletes your changes forever!

---

## Branches

### Create New Branch
```bash
git branch feature-name
```

### Switch to Branch
```bash
git checkout feature-name
```

### Create and Switch in One Command
```bash
git checkout -b feature-name
```

### List All Branches
```bash
git branch
```

### Delete Branch
```bash
git branch -d feature-name
```

### Merge Branch into Main
```bash
# Switch to main
git checkout main

# Merge feature branch
git merge feature-name
```

---

## Pulling Changes

### Get Latest Changes from GitHub
```bash
git pull
```

### Get Changes Without Merging
```bash
git fetch
```

---

## Handling .gitignore

### Create .gitignore File
```bash
# Windows
echo node_modules/ > .gitignore

# Mac/Linux
echo "node_modules/" > .gitignore
```

### Common .gitignore Entries
```
# Dependencies
node_modules/
package-lock.json

# Environment variables
.env
.env.local

# Build output
dist/
build/

# IDE
.vscode/
.idea/

# OS files
.DS_Store
Thumbs.db

# Logs
*.log
```

### Ignore Files Already Tracked
```bash
# Remove from Git but keep locally
git rm --cached filename

# Remove folder
git rm -r --cached foldername/
```

---

## Cloning Repositories

### Clone Repository from GitHub
```bash
git clone https://github.com/username/repository.git
```

### Clone into Specific Folder
```bash
git clone https://github.com/username/repository.git my-folder
```

---

## Common Issues & Solutions

### Issue: "fatal: not a git repository"
**Solution:** You're not in a Git project folder
```bash
git init
```

### Issue: "Permission denied (publickey)"
**Solution:** Use HTTPS instead of SSH, or set up SSH keys
```bash
git remote set-url origin https://github.com/username/repository.git
```

### Issue: "refusing to merge unrelated histories"
**Solution:**
```bash
git pull origin main --allow-unrelated-histories
```

### Issue: Merge Conflicts
**Solution:**
1. Open the conflicted files
2. Look for `<<<<<<<`, `=======`, `>>>>>>>`
3. Edit the file to keep the code you want
4. Remove the conflict markers
5. Save the file
6. Add and commit:
```bash
git add .
git commit -m "Resolve merge conflict"
```

### Issue: Accidentally Committed Large Files
**Solution:**
```bash
# Remove from last commit
git rm --cached large-file.zip
git commit --amend -m "Remove large file"
git push --force
```

---

## Working with Personal Access Tokens

### Generate Token
1. GitHub → Settings → Developer settings
2. Personal access tokens → Tokens (classic)
3. Generate new token (classic)
4. Select scopes: `repo`
5. Copy token (you'll only see it once!)

### Use Token Instead of Password
When Git asks for password:
- Username: your-github-username
- Password: paste-your-token-here

### Save Credentials (Optional)
```bash
# Save credentials for 15 minutes
git config --global credential.helper cache

# Save credentials for 1 hour
git config --global credential.helper 'cache --timeout=3600'

# Save credentials permanently (Windows)
git config --global credential.helper wincred

# Save credentials permanently (Mac)
git config --global credential.helper osxkeychain
```

---

## Useful Git Aliases

### Set Up Shortcuts
```bash
git config --global alias.st status
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.ci commit
git config --global alias.unstage 'reset HEAD --'
```

### Now You Can Use:
```bash
git st      # instead of git status
git co main # instead of git checkout main
git br      # instead of git branch
git ci -m "message" # instead of git commit -m "message"
```

---

## Advanced: Tags

### Create Tag
```bash
git tag v1.0.0
```

### Create Annotated Tag
```bash
git tag -a v1.0.0 -m "Version 1.0.0 release"
```

### Push Tags to GitHub
```bash
git push --tags
```

### List All Tags
```bash
git tag
```

---

## Git Best Practices

### ✅ DO:
- Commit frequently
- Write clear commit messages
- Pull before you push
- Use branches for features
- Keep commits small and focused
- Review changes before committing

### ❌ DON'T:
- Commit sensitive data (.env files, passwords)
- Commit large binary files
- Commit node_modules
- Force push to main branch
- Commit commented-out code
- Use vague commit messages

---

## Quick Reference Card

```
╔═══════════════════════════════════════════════════════════╗
║                   MOST USED GIT COMMANDS                  ║
╠═══════════════════════════════════════════════════════════╣
║  git status              Check what changed              ║
║  git add .               Stage all changes               ║
║  git commit -m "msg"     Save changes                    ║
║  git push                Upload to GitHub                ║
║  git pull                Download from GitHub            ║
║  git log                 See history                     ║
║  git diff                See unstaged changes            ║
║  git checkout -- .       Discard all changes             ║
╚═══════════════════════════════════════════════════════════╝
```

---

## Typical Day: Git Commands in Order

```bash
# Morning: Get latest changes
git pull

# Work on your code...
# (Make changes in VS Code)

# Afternoon: Check what you changed
git status

# Stage your changes
git add .

# Commit with good message
git commit -m "Add user authentication"

# Push to GitHub
git push

# Evening: Check everything is backed up
git status  # Should say "nothing to commit, working tree clean"
```

---

## Resources

- **GitHub Desktop:** GUI alternative to command line - [desktop.github.com](https://desktop.github.com)
- **Git Visualization:** See Git concepts visually - [git-school.github.io/visualizing-git](https://git-school.github.io/visualizing-git)
- **Pro Git Book:** Complete Git guide - [git-scm.com/book](https://git-scm.com/book)

---

## Emergency Commands (Use with Caution!)

### Start Over (Keep Files)
```bash
rm -rf .git
git init
git add .
git commit -m "Fresh start"
```

### Force Push (Overwrite Remote)
```bash
git push --force
```

**⚠️ Warning:** Only use on your own branches! This can lose others' work.

---

## Practice Exercises

Try these to build confidence:

1. **Exercise 1: Basic Workflow**
   ```bash
   echo "test" > test.txt
   git add test.txt
   git commit -m "Add test file"
   git push
   ```

2. **Exercise 2: Undo Changes**
   ```bash
   echo "wrong" > test.txt
   git checkout -- test.txt  # File restored!
   ```

3. **Exercise 3: Branching**
   ```bash
   git checkout -b test-branch
   echo "branch content" > branch.txt
   git add branch.txt
   git commit -m "Add branch file"
   git checkout main
   git merge test-branch
   ```

---

**Remember:** Git is a tool to help you, not scare you! 

The worst that can happen is you need to re-download your code from GitHub. As long as you've pushed to GitHub, your code is safe! 🎉