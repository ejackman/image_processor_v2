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

const app = new App();
console.log('Starting watcher');
watcher.on('add', app.process_file);
console.log('Watching...');
watcher.on('error', (err) => {
    console.log(err);
});
