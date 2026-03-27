---
name: commit-push-pr
description: Stage, commit, push, and open a PR
user_invocable: true
arguments:
  - name: message
    description: Optional commit message override
    required: false
---

# Commit, Push & PR

1. Stage relevant files (never stage secrets or generated code)
2. Generate commit message from diff if not provided
3. Commit (no AI attribution)
4. Push with `-u origin {branch}` if needed
5. Create or update PR
6. Return PR URL

**Never commit:** `.env`, `node_modules/`, `.next/`, `dist/`
