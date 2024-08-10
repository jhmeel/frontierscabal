import crypto, { scryptSync } from 'crypto';
import { Config } from '../config/config.js';
import { Buffer } from 'buffer';

const password = Config.CRYPTO.KEY;

const key = scryptSync(password, 'salt', 24);
const algorithm = 'aes192';
const iv = Buffer.alloc(16, 0);


export const decrypt = (text) => {
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    let decrypted = decipher.update(text, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}

export const encrypt = (text) => {
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;

};




