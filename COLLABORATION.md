# 🤝 Team Collaboration Guide (4 Members)

This guide outlines the development workflow, branch management strategy, and task organization to ensure smooth collaboration among the 4 team members on the **Fast & Furious Car Showroom** project.

---

## 🧭 1. Git Branching Strategy (Feature Branch Workflow)

To prevent team members from overwriting each other's work and to keep the `main` branch stable:

### **Rule #1: Never commit directly to `main`**
All development must occur on separate feature branches.

### **Workflow Steps:**
1. **Sync your local repository** before starting any work:
   ```bash
   git checkout main
   git pull origin main
   ```
2. **Create a new branch** for your task:
   ```bash
   # Naming convention: feature/name-short-task-description
   # Example: feature/umesh-finance-calculator
   git checkout -b feature/yourname-task-description
   ```
3. **Commit your work** in small, logical chunks:
   ```bash
   git add .
   git commit -m "feat: add EMI calculations to finance page"
   ```
4. **Push the branch** to GitHub:
   ```bash
   git push origin feature/yourname-task-description
   ```
5. **Open a Pull Request (PR)** on GitHub to merge into `main`. 
   * Require **at least 1 peer approval** from another team member before merging.

---

## ⚔️ 2. Avoiding and Resolving Merge Conflicts

When 4 people edit the same codebase, merge conflicts can happen. Follow these practices to minimize them:

* **Communicate:** Let teammates know which files you are working on.
* **Keep local branches updated:** Regularly merge or rebase the latest `main` into your feature branch:
  ```bash
  git fetch origin
  git merge origin/main
  # OR
  git rebase origin/main
  ```
* **Divide by components/files:** Avoid having multiple members edit the exact same lines of code in the same files simultaneously.

---

## 📋 3. Task Management & Division of Labor

Use a **Kanban Board** (e.g., GitHub Projects, Trello, or Jira) to visualize work.

### Recommended Column Structure:
1. **Backlog:** Ideas/tasks to do in the future.
2. **To Do:** Tasks committed for the current sprint/week.
3. **In Progress:** What team members are actively working on (limit to 1 task per person).
4. **In Review:** Pull requests awaiting code review.
5. **Done:** Successfully reviewed and merged into `main`.

### Suggested Role Allocation for 4 Members:
* **Member 1 (Frontend UI/UX Specialist):** Focused on UI design, Tailwind configurations, Framer Motion animations, and responsive layouts.
* **Member 2 (Frontend Logic & State Specialist):** Focused on forms (Test Drive, Finance calculations), routing, and connecting the frontend API queries to the backend.
* **Member 3 (Backend & AI Engineer):** Focused on FastAPI endpoints, LangChain configuration, RAG optimization, database integration, and prompt engineering.
* **Member 4 (QA, Database & Integration Engineer):** Focused on Supabase database schemas, user authentication, end-to-end testing, and deploying the application.

---

## 🔑 4. Environment Variables Coordination

* **Never commit `.env` files** to GitHub (already blocked in `.gitignore`).
* If you introduce a new environment variable (e.g., a new service API key), **always** add it to `backend/.env.example` or `frontend/.env.example` with a placeholder value, and notify the team in your communications.
