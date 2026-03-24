const jwt = require('jsonwebtoken');
const SECRET = "supersecretkey";

function verifyToken(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({
            message: "token required"
        })
    }

    const token = authHeader.split(" ")[1];

    jwt.verify(token, SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({
                message: "Invalid token"
            });
        }
        req.user = decoded;
        
        next();
    });
}

module.exports = verifyToken;


