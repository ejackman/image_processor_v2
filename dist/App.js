"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("./config");
const fs_1 = require("fs");
const JsZip = require("jszip");
const s3_upload_1 = require("./models/s3-upload");
class App {
    process_asn(file) {
        try {
            const asn_file = JSON.parse(fs_1.readFileSync(file, 'utf8'));
            let zip = new JsZip();
            const name = file;
            console.log('name:', name, "asn file:", asn_file);
            zip.file(name, JSON.stringify(asn_file));
            asn_file.pictures.forEach((file_name) => {
                const file = fs_1.readFileSync(file_name);
                zip.file(file_name, file);
            });
            this.finish(name, asn_file, zip);
        }
        catch (ex) {
            console.log(ex);
        }
    }
    finish(name, asn_file, zip) {
        zip.generateNodeStream({ type: 'nodebuffer', streamFiles: true })
            .pipe(fs_1.createWriteStream(name + '.zip'))
            .on('finish', () => {
            this.cleanup(name, asn_file);
        });
        console.log("finish called");
        const s3 = new s3_upload_1.default();
        return s3.upload(name, asn_file, zip, this.cleanup);
    }
    cleanup(name, asn_file) {
        asn_file.pictures.forEach(file => {
            fs_1.createReadStream(config_1.default.source.dirIn + file).pipe(fs_1.createWriteStream(config_1.default.source.dirOut + file));
            // unlinkSync(config.source.dirIn+ file);
        });
        // unlinkSync(name);
    }
    process_file(file) {
        if (file.indexOf('.json') > -1) {
            console.log(file);
            this.process_asn(file);
        }
    }
}
exports.default = App;
//# sourceMappingURL=App.js.map