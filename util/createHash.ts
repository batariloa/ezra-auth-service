import crypto from 'crypto'

export function createHash(val:string):string{

    return crypto.createHash('md5').update(val).digest('hex');
}

