"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const App_1 = require("./App");
const chokidar = require("chokidar");
const config_1 = require("./config");
console.log('Creating watcher');
const watcher = chokidar.watch(config_1.default.source.dirIn, {
    persistent: true,
    awaitWriteFinish: {
        stabilityThreshold: 2000,
        pollInterval: 100
    }
});
console.log('Starting watcher');
watcher.on('add', App_1.default.process_file);
console.log('Watching...');
watcher.on('error', (err) => {
    console.log(err);
});
//# sourceMappingURL=index.js.map