import App from './App';
import * as chokidar from 'chokidar';
import config from "./config";

console.log('Creating watcher');
const watcher = chokidar.watch(config.source.dirIn,{
    persistent:true,
    awaitWriteFinish:{
        stabilityThreshold: 2000,
        pollInterval: 100
    }
});
console.log('Starting watcher');
watcher.on('add', App.process_file);
console.log('Watching...');
