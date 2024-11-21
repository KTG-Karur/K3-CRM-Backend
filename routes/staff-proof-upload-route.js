'use strict';

const { verifyToken } = require("../middleware/auth");
const { ResponseEntry } = require("../helpers/construct-response");
const responseCode = require("../helpers/status-code");
const messages = require("../helpers/message");
const fs = require('fs');
const path = require('path');
const pump = require('pump');

async function UploadStaffProff(req, res) {
    const responseEntries = new ResponseEntry();
    try {
        // Ensure the uploads directory exists
        const uploadDir = './uploads';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        const parts = await req.files(); // Get all the files and fields
        const files = []; 
        const otherFields = {}; 

        for await (const part of parts) {
            if (part.file) {
                const fileName = `${Date.now()}-${part.filename}`; // Unique file name
                const filePath = path.join(uploadDir, fileName); // Full path to save the file

                await pump(part.file, fs.createWriteStream(filePath)); // Save the file

                files.push(fileName); 
            } else {
                otherFields[part.fieldname] = part.value; // Save non-file fields
            }
        }

        responseEntries.data = messages.UPLOADED_SUCCESSFULLY; // Send the collected data
        if (!responseEntries.data) responseEntries.message = messages.DATA_NOT_FOUND;
    } catch (error) {
        responseEntries.error = true;
        responseEntries.message = error.message ? error.message : error;
        responseEntries.code = responseCode.BAD_REQUEST;
    } finally {
        res.send(responseEntries);
    }
}

module.exports = async function (fastify) {
    fastify.register(require('@fastify/multipart'), {
        limits: {
            fileSize: 1024 * 1024 * 5 // Set file size limit to 5MB
        }
    });

    fastify.route({
        method: 'POST',
        url: '/upload-proof',
        preHandler: verifyToken,
        handler: UploadStaffProff
    });
};
