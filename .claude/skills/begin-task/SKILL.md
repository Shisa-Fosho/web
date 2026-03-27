---
name: begin-task
description: Start working on a GitHub issue
user_invocable: true
arguments:
  - name: issue_number
    description: The GitHub issue number
    required: true
---

# Begin Task

1. Read issue: `gh issue view {issue_number} --repo Shisa-Fosho/web`
2. Derive branch: `{issue_number}-{short-kebab-description}`
3. Ensure clean tree
4. Create and checkout branch
5. Enter plan mode
