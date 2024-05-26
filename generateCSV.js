const fs = require('fs');
const { parse } = require('json2csv');

const data = [
    { unique_number: 1001, series: 'A', random_code: 'E594llJ6', hash_key: 'hash1', status: 'unused', prize: '50% Discount', winnerName: '', winnerContact: '' },
    { unique_number: 1002, series: 'A', random_code: 'B9gVw3xl', hash_key: 'hash2', status: 'unused', prize: '50% Discount', winnerName: '', winnerContact: '' },
    { unique_number: 1003, series: 'A', random_code: '9rxeYUym', hash_key: 'hash3', status: 'unused', prize: '30% Discount', winnerName: '', winnerContact: '' },
    { unique_number: 1004, series: 'A', random_code: 'V6zvB2Ht', hash_key: 'hash4', status: 'unused', prize: '30% Discount', winnerName: '', winnerContact: '' },
    { unique_number: 1005, series: 'A', random_code: 'LG3H1NpC', hash_key: 'hash5', status: 'unused', prize: '30% Discount', winnerName: '', winnerContact: '' },
    { unique_number: 1006, series: 'A', random_code: 'f4uVAZum', hash_key: 'hash6', status: 'unused', prize: '10% Discount', winnerName: '', winnerContact: '' },
    { unique_number: 1007, series: 'A', random_code: 'vWfvwkQS', hash_key: 'hash7', status: 'unused', prize: '10% Discount', winnerName: '', winnerContact: '' },
    { unique_number: 1008, series: 'A', random_code: '70rfv5Lq', hash_key: 'hash8', status: 'unused', prize: '10% Discount', winnerName: '', winnerContact: '' },
    { unique_number: 1009, series: 'A', random_code: 'fCyy1jqn', hash_key: 'hash9', status: 'unused', prize: '10% Discount', winnerName: '', winnerContact: '' }
];

const fields = ['unique_number', 'series', 'random_code', 'hash_key', 'status', 'prize', 'winnerName', 'winnerContact'];

try {
    const csv = parse(data, { fields });
    fs.writeFileSync('unique_codes.csv', csv);
    console.log('CSV file has been generated successfully.');
} catch (err) {
    console.error(err);
}
