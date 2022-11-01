import crypto, { generateKeyPairSync } from 'crypto';
import fs from 'fs';

function generateKeyPair() {
    const { publicKey, privateKey } = generateKeyPairSync('ec', {
        namedCurve: 'secp256k1', // Implementing options
        publicKeyEncoding: {
           type: 'spki',
           format: 'der'
        },
        privateKeyEncoding: {
           type: 'pkcs8',
           format: 'der'
        }
     });
        
}