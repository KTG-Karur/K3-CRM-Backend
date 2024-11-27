'use strict';

const sequelize = require('../models/index').sequelize;
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
        const uploadDir = './uploads';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        const staffProofDir = path.join(uploadDir, 'staff-proof');
        const claimProofDir = path.join(uploadDir, 'claim-proof');

        if (!fs.existsSync(staffProofDir)) fs.mkdirSync(staffProofDir);
        if (!fs.existsSync(claimProofDir)) fs.mkdirSync(claimProofDir);

        const parts = await req.files();
        const files = [];
        const otherFields = {};
        let claimId = 1;
        for await (const part of parts) {
            if (part.file) {
                let filePath = '';
                const fileName = `${Date.now()}-${part.filename}`;
                if (part.fieldname === "staffProof") {
                    filePath = path.join(staffProofDir, fileName);
                    sequelize.models.staffProof.update({
                        proof_image_name: fileName
                    },
                        { where: { staff_id: staff_id } }
                    );
                } else if (part.fieldname === "claimProof") {
                    filePath = path.join(claimProofDir, fileName);
                    sequelize.models.claim.update({
                        recepit_image_name: fileName
                    },
                        { where: { claim_id: part.fields.recordId.value } }
                    );
                } else {
                    filePath = path.join(uploadDir, fileName);
                }

                await pump(part.file, fs.createWriteStream(filePath));
                files.push({ fieldname: part.fieldname, fileName });
            } else {
                otherFields[part.fieldname] = part.value;
            }
        }

        responseEntries.data = messages.UPLOADED_SUCCESSFULLY;
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
            fileSize: 1024 * 1024 * 5
        }
    });

    fastify.route({
        method: 'POST',
        url: '/upload-proof',
        preHandler: verifyToken,
        handler: UploadStaffProff
    });
};
