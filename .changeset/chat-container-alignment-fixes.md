---
"@fiscozen/chat-container": patch
---

fix(chat-container): refine waiting for response message and message alignment

- Remove unnecessary v-bold directive from waiting for response message text
- Unify message card content alignment to start (alignItems="start") for consistent formatting
- Remove getMessageAlignment helper in favor of fixed alignment
