import jwt from 'jsonwebtoken';

// En producción, usar AWS Secrets Manager o Parameter Store
const JWT_SECRET = process.env.JWT_SECRET;
const KEY_ID = process.env.KEY_ID;

export const generateJWT = async (userData) => {
    const { external_id, name, email, email_verified } = userData;

    const payload = {
        external_id,
        scope: 'user'
    };

    // Agregar campos opcionales si existen
    if (name) payload.name = name;
    if (email) payload.email = email;
    if (email_verified !== undefined) payload.email_verified = email_verified;

    // Configurar opciones del token (expiración, etc.)
    const options = {
        expiresIn: '1h', // 5 minutos
        header: {
            kid: KEY_ID
        }
    };

    // Generar y firmar el token
    return jwt.sign(payload, JWT_SECRET, options);
}; 