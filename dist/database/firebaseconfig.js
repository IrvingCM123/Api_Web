"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.firebaseAdmin = void 0;
var admin = require("firebase-admin");
var serviceAccount = require("./firebase.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});
exports.firebaseAdmin = admin;
