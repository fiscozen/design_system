---
"@fiscozen/action": patch
"@fiscozen/alert": patch
"@fiscozen/badge": patch
"@fiscozen/button": patch
"@fiscozen/card": patch
"@fiscozen/chat-container": patch
"@fiscozen/checkbox": patch
"@fiscozen/collapse": patch
"@fiscozen/datepicker": patch
"@fiscozen/input": patch
"@fiscozen/navlink": patch
"@fiscozen/progress": patch
"@fiscozen/radio": patch
"@fiscozen/select": patch
"@fiscozen/stepper": patch
"@fiscozen/tab": patch
"@fiscozen/table": patch
"@fiscozen/textarea": patch
"@fiscozen/toast": patch
"@fiscozen/tooltip": patch
"@fiscozen/typeahead": patch
---

Move @fiscozen/icons from dependencies to peerDependencies. Consumers now need to install @fiscozen/icons explicitly. This decouples icon updates from component version bumps.
