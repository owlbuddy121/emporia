# GitHub Push Authentication Guide

## The Issue
The push failed with a 403 error because GitHub requires authentication. Since August 2021, GitHub no longer accepts password authentication for Git operations.

## ✅ What's Already Done
- ✅ Git repository initialized
- ✅ All files committed
- ✅ Branch renamed to `main`
- ✅ Remote origin added: https://github.com/owlbuddy121/emporia.git

## 🔑 Solution: Use Personal Access Token (PAT)

### Option 1: Using GitHub CLI (Recommended)

1. Install GitHub CLI if you haven't:
   ```bash
   winget install GitHub.cli
   ```

2. Authenticate:
   ```bash
   gh auth login
   ```

3. Push the code:
   ```bash
   git push -u origin main
   ```

### Option 2: Using Personal Access Token

1. **Create a Personal Access Token:**
   - Go to https://github.com/settings/tokens
   - Click "Generate new token" → "Generate new token (classic)"
   - Give it a name (e.g., "Emporia Project")
   - Select scopes: `repo` (full control of private repositories)
   - Click "Generate token"
   - **COPY THE TOKEN** (you won't see it again!)

2. **Push with the token:**
   ```bash
   git push -u origin main
   ```
   
   When prompted for username: enter your GitHub username
   When prompted for password: **paste your Personal Access Token**

### Option 3: Using SSH (Most Secure)

1. **Generate SSH key** (if you don't have one):
   ```bash
   ssh-keygen -t ed25519 -C "your_email@example.com"
   ```

2. **Add SSH key to GitHub:**
   - Copy your public key:
     ```bash
     cat ~/.ssh/id_ed25519.pub
     ```
   - Go to https://github.com/settings/keys
   - Click "New SSH key"
   - Paste your public key

3. **Change remote URL to SSH:**
   ```bash
   git remote set-url origin git@github.com:owlbuddy121/emporia.git
   ```

4. **Push:**
   ```bash
   git push -u origin main
   ```

## 🚀 After Successful Push

Once authenticated and pushed, your repository will be live at:
https://github.com/owlbuddy121/emporia

You can then:
- Add a description and topics
- Enable GitHub Pages (if needed)
- Set up GitHub Actions for CI/CD
- Invite collaborators

## 📝 For Future Pushes

After the first successful push with authentication, Git will remember your credentials (if using credential helper), and you can simply use:
```bash
git push
```

---

**Need help?** The GitHub CLI option is the easiest for Windows users!
