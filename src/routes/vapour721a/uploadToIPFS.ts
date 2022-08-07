import type { Vapour721AConfig } from '$routes/vapour721a/vapour721a-types';
import axios from 'axios'
import type { Writable } from 'svelte/store';
// const FormData = require("form-data");
// const got = require('got');

const jwt = import.meta.env.VITE_PINATA_JWT
const apikey = import.meta.env.VITE_PINATA_API_KEY
const apiSecret = import.meta.env.VITE_PINATA_API_SECRET

export const pin = async (data: Object[] | File, progressStore?: Writable<number>) => {
    const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
    let formData = new FormData();
    console.log(data)
    // if we're pinning metadata (objets)
    if (data instanceof Array) {
        data = data as Object[]
        for (const [i, d] of data.entries()) {
            const blob = new Blob([JSON.stringify(d, null, 2)], { type: 'application/json' });
            formData.append(`file`, blob, `dir/${i}.json`);
        }
    }
    // or we're pinning the media file 
    else {
        formData.append('file', data, data.name)
    }

    const response = await axios.request({
        url,
        method: 'post',
        headers: {
            "pinata_api_key": apikey,
            "pinata_secret_api_key": apiSecret,
            "Content-Type": `multipart/form-data;`,
            "Authorization": `Bearer ${jwt}`
        },
        data: formData,
        onUploadProgress: ((p) => {
            console.log(`${p.loaded} / ${p.total}`);
            progressStore.set(p.loaded / p.total);
        }),
    })
    return response.data
};

export const generateMetadata = (config: Vapour721AConfig): any => {
    let metadata = []
    for (let i = 0; i < config.maxSupply; i++) {
        metadata[i] = {
            name: config.name,
            description: config.description,
            image: `ipfs://${config.mediaUploadResp.IpfsHash}`
        }
    }
    return metadata
} 