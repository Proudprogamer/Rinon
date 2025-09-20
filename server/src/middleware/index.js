import jwt, {} from "jsonwebtoken";
import {} from "express";
import dotenv from "dotenv";
dotenv.config();
async function tokenChecker(req, token, next) {
    const JWT_SECRET = process.env["JWT_SECRET"];
    const type = req.body.creds.type;
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.id) {
        if (type == decoded.type)
            next();
    }
}
export default tokenChecker;
//# sourceMappingURL=index.js.map