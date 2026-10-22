/// <reference types="vite/client" />
// pdf.js 6.x ships code that needs Map/WeakMap.prototype.getOrInsertComputed
// (Chrome 145, Firefox 144, Safari/iOS 26.2) and Iterator.prototype.toArray.
// Older browsers and WebViews are polyfilled on the main thread; the worker
// thread can't see these polyfills, so it runs pdf.js's legacy build instead.
// pdfjs-dist must stay on the exact version @tato30/vue-pdf pins: pdf.js
// refuses a worker whose version differs from the API's.
import "core-js/actual/map/get-or-insert-computed";
import "core-js/actual/weak-map/get-or-insert-computed";
import "core-js/actual/iterator/to-array";
import { GlobalWorkerOptions } from "pdfjs-dist";
import legacyWorkerUrl from "pdfjs-dist/legacy/build/pdf.worker.min.mjs?url";

GlobalWorkerOptions.workerSrc = legacyWorkerUrl;
