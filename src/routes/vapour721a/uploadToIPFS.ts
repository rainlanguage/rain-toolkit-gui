import axios from 'axios'
// const FormData = require("form-data");
// const got = require('got');

const jwt = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI5YzEzNGUyNC03ZTE1LTRiOGYtYjljZS0zY2IyZWU1MmExMjIiLCJlbWFpbCI6Imprcy5oYXJkeUBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJpZCI6Ik5ZQzEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiMjVjMTQ2MGI4Mjg0NWY4NjhjMzkiLCJzY29wZWRLZXlTZWNyZXQiOiIyODUxYjkzMzJhNDMzYzkyNTNjMTU2YTY5NTZhNzAxMTIxYmZkOTZkMDgwYTFjNjEyZjYzNDkyYmQ2OTJmZDNlIiwiaWF0IjoxNjU5NjMyODIyfQ.tlTAgWBqihZUNNitKSDq4k9IrbU_ygVA7j0zMPbFmAQ"
const apikey = "25c1460b82845f868c39"
const apiSecret = "2851b9332a433c9253c156a6956a701121bfd96d080a1c612f63492bd692fd3e"

export const pin = async (data: Object[] | File, progressCallback?: (progressEvent: any) => void) => {
    const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
    try {
        let formData = new FormData();

        // if we're pinning metadata (objets)
        if (typeof data === 'object' && data instanceof Array) {
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
            onUploadProgress: progressCallback || ((p) => {
                console.log(`${p.loaded} / ${p.total}`);
            }),
        })
        return response.data
    } catch (error) {
        return error
        console.log(error);
    }
};