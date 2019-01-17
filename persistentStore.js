import crypto from 'crypto';

const PersistentStore = class {
    constructor({ store, key, secret, algorithm } = {}) {
        this.algorithm = 'aes-256-ctr' || algorithm;
        this.store = store || window.localStorage;
        this.key = key || 'persistent';
        this.secret = secret || 'M3553NG3R';
    }
    _encryptText(text) {
        try {
            const cipher = crypto.createCipher(this.algorithm, this.secret);
            const crypted = cipher.update(text, 'utf8', 'hex') + cipher.final('hex');
            return crypted;
        } catch (ex) {
            return '';
        }
    }
    _encryptObj(obj) {
        try {
            return this._encryptText(JSON.stringify(obj));
        } catch (ex) {
            return '';
        }
    }
    _decryptText(str) {
        try {
            const decipher = crypto.createDecipher(this.algorithm, this.secret);
            const dec = decipher.update(str, 'hex', 'utf8') + decipher.final('utf8');
            return dec;
        } catch (ex) {
            return {};
        }
    }
    _decryptObj(str) {
        try {
            return JSON.parse(this._decryptText(str));
        } catch (ex) {
            return {};
        }
    }
    set(obj) {
        try {
            this.store.setItem(this._encryptText(this.key), this._encryptObj(obj));
        } catch (ex) {
            return;
        }
    }
    get() {
        try {
            return this._decryptObj(this.store.getItem(this._encryptText(this.key)));
        } catch (ex) {
            return {};
        }
    }
};

export default PersistentStore;
