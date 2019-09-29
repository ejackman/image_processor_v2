import config from "./config";
import {createReadStream, createWriteStream, readFileSync, unlinkSync} from "fs";
import * as JsZip from 'jszip';
import S3Upload from "./models/s3-upload";

class App {



    process_asn(file: string){
        try {
            const asn_file:Asn = JSON.parse(readFileSync(file, 'utf8'));
            let zip = new JsZip();
            const name = file;
            console.log('name:', name,  "asn file:", asn_file);
            zip.file(name, JSON.stringify(asn_file));
            asn_file.pictures.forEach((file_name: string) => {
                const file = readFileSync(config.source.dirIn + file_name);
                zip.file(file_name, file);
            });
            this.finish(name, asn_file, zip);
        }
        catch(ex){
            console.log(ex);
        }
    }

    finish(name,asn_file: Asn,zip){
        zip.generateNodeStream({type:'nodebuffer',streamFiles:true})
            .pipe(createWriteStream(name + '.zip'))
            .on('finish',()=>{
                this.cleanup(name,asn_file);
            });
        console.log("finish called");
        const s3 = new S3Upload();
        return s3.upload(name,asn_file,zip,this.cleanup);
    }

    cleanup(name,asn_file: Asn){
        asn_file.pictures.forEach( file => {
            createReadStream(config.source.dirIn + file).pipe(createWriteStream(config.source.dirOut + file));
            // unlinkSync(config.source.dirIn+ file);
        });
        // unlinkSync(name);
    }

    process_file(file){
        if(file.indexOf('.json') > -1){
            console.log(file);
            this.process_asn(file);
        }
    }
}

export default App;
