import fs, { write } from "fs"
import Jimp from "jimp"


export async function filterImageFromURL(inputURL) {
    return new Promise(async (resolve, reject) => {
        try {
            const photo = await Jimp.read(inputURL)
            const outpath =  "/tmp/filtered." + Math.floor(Math.random() * 2000) + ".jpg"
            await photo 
                .resize(256, 256)
                .quality(60)
                .greyscale()
                .write(outpath, (img) => {
                    resolve(outpath)
                })
        }catch (error){
            reject(error)
        }
    })
}


export async function deleteLocalFiles(files) {
    for (let file of files) {
        fs.unlinkSync(file)
    }
}