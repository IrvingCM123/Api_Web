"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.firebaseAdmin = void 0;
const firebase_admin_1 = __importDefault(require("firebase-admin"));
firebase_admin_1.default.initializeApp({
    credential: firebase_admin_1.default.credential.cert({
        projectId: "biblioteca-f2285",
        privateKey: "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDcOjw7iMYaXc4I\njmUFz5Jyjbbx0ZYy0w4L9quSn0v9NgB33xHf4y56pXJ7c8zMnkaMNxf82XXwX4hF\n0Tw18DUj5khOH9NAVZEQcSJ9pN3sW2RnrnQqgR6SmyxZuAHQeUa+3uwptv1CeTiH\nv5X7IN1uo3oqmkA4njZqDJvdMEK0Tf5U/xtmT5hwPrLUpm5fQ3AIxzjsgLJRy+9p\nJkv96h1LIorflSs8JL6jwj4iyqafhJEIVKtBac2BCBX9SEM9mvjk7y8fyZObvE98\nZWcY9hbIjwuqixKHM+wEDEntU9EAN5egtssnK0nyFK+5UGtvCXuruCJyIwoLTQ0f\nLBPszPbxAgMBAAECggEAAzIZI6gFb+aCkd83GhF8B4uE5xdqfYxQfN30eWk0WhVJ\nhnPHN599UixKb/4rL6DwVyKJh5LEQluwh4rUu9ejfcTesbuGfj1/oGRz4qzcx4w/\n9b0zVFaRUgFMcHTaGeNYonZrqONN44QMzPN7wqwkanGW2T1pxyiMk5dhP6Fupl0g\neZ6yxLlSqW/+cAJT45SH02EfS2MXKELDHaeQivMC2a5nOqSPRL9mNzW71ZYIGcDy\na+BvrMQ56nBmnrxjTxDWofbiwBCBxAqtjeCqHTK1uhnaEUk23IMnuiyuGp9WElJs\noYstJrwxI369mNs84iB02wNzM1A2G+TCkKVlq0E6EQKBgQD1Vqm3x6ve0i0sXbR5\nIeR3zQyC0O+uNr45BxaFj3F8IpK/bmxXs0Qs+w7TlyYkqrS6prJGT8yDQ1+UYnJP\njXYsbKo58FShdrF3gaCyx9QA9q0GytRbmqwVcag/b2BeXMX24FnLGiQKJSqx8sqm\noMW5FZ3cz6qzkqEG3OL6kYu/VQKBgQDlzDesdOP1LEsqZpZ18AAa+60SCJ6ZJH81\nmQ/9vxRGhivzACgK57i9GpT8XE0a6ggNExGwzQf5kugE7tIr06MhUV3M0fqCjV5m\nxSP//xPWnG1qDWZ0xtbqZzXvOOt0WHm3XzzHi3STEINnrP5vpLfJMIke71j/fqEi\nJTkhy4kBLQKBgQDyF8h134SL5d5Jr1XNSlKGnUJBPCenQ8HFyGbC+N9FXWBtomsq\nx2z47eydgsNS31hj7uZwV4I57Ru98r9WHQOFptz7O1pn0hYhFTsb7/AV21S2JSQU\nGLbCmlsp7Z+sveNjT9OLhYoWsMJGwoySjIdPsjMKl6mcdY6MlR8tnr3F2QKBgEX6\nEzYT/lrpmxYVWVoetJmC7GgicdFmuMokiycVKeJz9ywvbwIrICmNz7KtlNlOTRdW\nKDvzo6sPXlIqO5wW/YUm1u6JPsTEseuPuu+4yFzBE9yIqhuDdWy580WeyqyKSL5b\nZRHK2Lvz+l/24SA0Q7cjbY4bCrn64KyaMzSkW1sdAoGBAM2uMmN5yv1kNr+aBO6a\naMNBrv1/wTFtjsmqqJ272M0eJfHErru98wovTtpBbL1YqUtF2q+udasyvAcIT4E2\nQspU0q0xysffD1SGgZzHtdEDGrP/MzCt2aG3Pb7cjR50ba5o8gghmuu1pHZcmeAW\nU+2Kz0Hf5IqP6+BkCOC+XQNb\n-----END PRIVATE KEY-----\n",
        clientEmail: "firebase-adminsdk-03nxz@biblioteca-f2285.iam.gserviceaccount.com",
    }),
});
exports.firebaseAdmin = firebase_admin_1.default;
