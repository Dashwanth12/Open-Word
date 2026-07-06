// middlewares/authMiddleware.js
const { ClerkExpressRequireAuth } = require('@clerk/clerk-sdk-node');

const requireAdmin = [
    ClerkExpressRequireAuth(),

    (req, res, next) => {
        const claims = req.auth.sessionClaims || {};
        const meta = claims.publicMetadata || claims.public_metadata || {};
        const { role } = meta;

        if (role !== 'admin') {
            return res.status(403).json({ message: 'Forbidden: Admins only.' });
        }
        next();
    }
    
];
const requireAuth = ClerkExpressRequireAuth()

module.exports = { requireAdmin, requireAuth };