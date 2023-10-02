const express = require('express');
const router = express.Router();
const AWS = require('aws-sdk');
const Facedetect = require('../models/Facedetect');
let multer = require('multer');

const upload = multer();
//AWS access details
AWS.config.update({
    accessKeyId: 'AKIA2OLJ62BHWLUFBV7O',
    secretAccessKey: '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',
    region: 'us-west-2'
});

const rekognition = new AWS.Rekognition();

async function detectAndRecognizeFaces(imageBuffer) {
    const params = {
        
        Image: {
            Bytes: imageBuffer
        },
        Attributes: [
            "ALL"
        ]
    };

    try {
        
        const response = await rekognition.detectFaces(params).promise();

        console.log(response)

        return response;
    } catch (error) {
        console.error('Error recognizing faces:', error);
        throw error;
    }
}
async function addFaces(buffer, personName) {

    try {
        const response = await rekognition.indexFaces({
            "CollectionId": "Face_Detect",
            "DetectionAttributes": ["ALL"],
            "ExternalImageId": personName,
            "Image": {
                "Bytes": buffer
            }
        }).promise();

        return response.FaceRecords;
    } catch (error) {
        console.error('Error recognizing faces:', error);
        throw error;
    }


}







//@route Post api/Facelandmark
//desc post route
//@access Public
router.post('/', upload.single('image'), async (req, res) => {
    try {

        const { buffer } = req.file;
        
        
        let output = await detectAndRecognizeFaces(buffer)


    
            res.json(output)
        


    } catch (error) {
        console.log(error)
        console.error('Error indexing face:', error);
        res.status(500).json({ error: 'An error occurred' });
    }
});




module.exports = router;