import { generateJWT } from './lib/jwt.mjs';
import { searchUserInZendesk } from './lib/zendesk-api.mjs';

// Función simple para validar formato de email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

export const handler = async (event) => {
    try {
        // Extraer el email del evento
        const requestData = JSON.parse(event.body || '{}');
        const email = requestData.email;

        // Validación básica del email
        if (!email) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Email is required' })
            };
        }

        if (!isValidEmail(email)) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Invalid email format' })
            };
        }

        // Buscar el usuario en Zendesk por email
        const userData = await searchUserInZendesk(email);

        if (!userData) {
            return {
                statusCode: 404,
                body: JSON.stringify({ error: 'User not found in Zendesk' })
            };
        }

        // Generar JWT con los datos del usuario
        const token = await generateJWT({
            external_id: userData.external_id || `zendesk_user_${userData.id}`,
            name: userData.name,
            email: userData.email,
            email_verified: true // Asumimos que está verificado si está en Zendesk
        });

        // Devolver el JWT
        return {
            statusCode: 200,
            body: JSON.stringify({ token })
        };
    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Internal server error' })
        };
    }
}; 