import { directives as paragraphDirectives } from "./paragraph";

import type { App } from "vue";

export * from "./constants";

/**
 * Setup function to register all FiscoZen style
 * Usage: setupFzStyle(app) in your main.ts
 */
export function setupFzStyle(app: App) {

    // Register paragraph directives
    paragraphDirectives.forEach(paragraphDirective => {
        app.directive(paragraphDirective.name, paragraphDirective.directive);
    });
    
    // Future directives can be added here
    // app.directive('highlight', vHighlight)
    // app.directive('uppercase', vUppercase)
}
