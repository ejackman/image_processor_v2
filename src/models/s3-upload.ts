import config from "../config";
import * as s3 from 's3';
import * as AWS from 'aws-sdk';
import * as fetch from 'node-fetch';

class S3Upload{
    upload(name,asn_file,zip,cb){
        let options = {
            hostname	: config.api.base_url,
            port 		: 3173,
            method		: "GET",
            path		: "asn/" + asn_file.typeId,
            headers		: { "x-owd-api-token":config.api.key}
        };
        console.log("create owd api request:", asn_file.typeId);
        fetch("http://" + config.api.base_url + "/asn/" + asn_file.typeId, { headers : options.headers })
            .then( res => {
                return res.json();
                // s3.ListBuckets((err,buckets) => {
                // 	console.log("Buckets:",buckets)
                // });
            }).then( data => {
            console.log("Data:",data);
            if(data.length > 0) {
                fetch("http://" + config.api.base_url + "/client/" + data.data[0].client_fkey)
                    .then(res => {
                        return res.json();
                    }).then(data => {
                    console.log("company", data.data[0].company_name.replace(/([^a-z0-9]+)/gi, '-'));

                    let params = {
                        Bucket: "owd.s3.imagepacks",
                        Body: zip.generateNodeStream({type: 'nodebuffer', streamFiles: true}),
                        Key: this.get_folder(asn_file) + "/" + data.data[0].company_name.replace(/([^a-z0-9]+)/gi, '-') + "." + name + ".zip",

                    };

                    let upload = new AWS.S3.ManagedUpload({params: params, queueSize: 1})
                        .on("httpUploadProgress", progress => {
                            console.log("Progress:", progress);
                        })
                        .send((err, data) => {
                            if (err) return console.log("Error:", err);
                            console.log("Upload:", data);
                            cb(name, asn_file);
                        });
                });
            }
        });

        // let req = http.request(options, response => {
        // 	console.log("Response", response);
        // 	response.on("data", chunk => {
        // 		s3.ListBuckets((err,buckets) => {
        // 			console.log("Buckets:",buckets)
        // 		});
        // 	});


        // 	// s3.ListBuckets((err,buckets) => {ET32YUESTfz@!6QztYQuSTAWqfrxrzmq	tyuaQ	rsz2WTW1Q`6Yz~! MUKq5
        // 	// 	buckets.forEach(bucket => {
        // 	// 		if(bucket.Name == client){

        // 	// 		}
        // 	// 	});
        // 	// });
        // });

        // req.end();

        // req.on('error', err => {
        // 	console.log("Error:", err);
        // });
    }

    get_folder(asn_file){
        if(asn_file.type == "receive") return "receives";
        else if(asn_file.type == 'return') return 'returns';
        else return 'uncategorized'
    }
}

export default S3Upload;
