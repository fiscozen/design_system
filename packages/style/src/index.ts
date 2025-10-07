import { directives } from "./custom-directives";

import type { App } from "vue";

export * from "./constants";

/**
 * Setup function to register all FiscoZen style
 * Usage: setupFzStyle(app) in your main.ts
 */
export function setupFzStyle(app: App) {
    // Register custom directives
    directives.forEach(directive => {
        app.directive(directive.name, directive.directive);
    });
}
