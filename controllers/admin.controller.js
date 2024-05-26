const UniqueCode = require('../models/uniqueCode.model');
const User = require('../models/user.model');
const csv = require('csv-parser');
const path = require('path');
const fs = require('fs');
const qr = require('qr-image');
const { parse } = require('json2csv');

async function uploadUniqueCodes(req, res) {
    try {
        const results = [];
        fs.createReadStream(req.file.path)
            .pipe(csv())
            .on('data', (data) => results.push(data))
            .on('end', async () => {
                await UniqueCode.insertMany(results);
                res.status(200).send({ message: 'Unique codes uploaded successfully!' });
            });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
}


const generateQRCodes = async (req, res) => {
    try {
        const uniqueCodes = await UniqueCode.find({ status: 'unused' });
        const csvData = [];
        const qrCodeDir = path.join(__dirname, '../public/qrcodes');

        if (!fs.existsSync(qrCodeDir)) {
            fs.mkdirSync(qrCodeDir, { recursive: true });
        }

        uniqueCodes.forEach((code) => {
            const qrCodeData = `http://localhost:3000/${code.random_code}|${code.hash_key}`;
            const qrCode = qr.imageSync(qrCodeData, { type: 'png' });

            const qrCodeFileName = `${code.random_code}_${code.hash_key}.png`;
            const qrCodeFilePath = path.join(qrCodeDir, qrCodeFileName);
            fs.writeFileSync(qrCodeFilePath, qrCode);

            const buffer = Buffer.from(qrCode);
            const base64QR = buffer.toString('base64');

            csvData.push({
                unique_number: code.unique_number,
                series: code.series,
                random_code: code.random_code,
                hash_key: code.hash_key,
                qr_code: base64QR,
                qr_code_image: `/qrcodes/${qrCodeFileName}`
            });
        });

        const csvString = parse(csvData);
        fs.writeFileSync('qr_codes.csv', csvString);
        res.setHeader('Content-Disposition', 'attachment; filename=qr_codes.csv');
        res.status(200).send(csvString);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};


async function createUniqueCode(req, res) {
    try {
        const uniqueCode = new UniqueCode(req.body);
        await uniqueCode.save();
        res.status(200).send({ message: 'Unique code created successfully!', uniqueCode });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
}


async function updateUniqueCode(req, res) {
    try {
        const uniqueCode = await UniqueCode.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!uniqueCode) {
            return res.status(404).send({ message: 'Unique code not found.' });
        }
        res.status(200).send({ message: 'Unique code updated successfully!', uniqueCode });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
}

async function deleteUniqueCode(req, res) {
    try {
        await UniqueCode.findByIdAndDelete(req.params.id);
        res.status(200).send({ message: 'Unique code deleted successfully!' });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
}


async function dashboard(req, res) {
    try {
        const totalCodes = await UniqueCode.countDocuments();
        const usedCodes = await UniqueCode.countDocuments({ status: 'used' });
        const unusedCodes = totalCodes - usedCodes;
        const locationWiseUsers = await User.aggregate([
            { $group: { _id: "$location", count: { $sum: 1 } } }
        ]);
        const repeatUsers = await User.aggregate([
            { $group: { _id: "$mobile_number", count: { $sum: 1 } } },
            { $match: { count: { $gt: 1 } } }
        ]);

        res.status(200).send({
            totalCodes,
            usedCodes,
            unusedCodes,
            locationWiseUsers,
            repeatUsers: repeatUsers.length
        });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
}


async function editUser(req, res) {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).send(user);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
}


async function deleteUser(req, res) {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.status(200).send({ message: 'User deleted successfully!' });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
}

module.exports = {
    uploadUniqueCodes,
    generateQRCodes,
    createUniqueCode,
    updateUniqueCode,
    deleteUniqueCode,
    dashboard,
    editUser,
    deleteUser
};
