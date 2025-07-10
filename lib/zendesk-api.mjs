// Obtener credenciales desde variables de entorno
const ZENDESK_SUBDOMAIN = process.env.ZENDESK_SUBDOMAIN;
const ZENDESK_EMAIL = process.env.ZENDESK_EMAIL;
const ZENDESK_API_TOKEN = process.env.ZENDESK_API_TOKEN;

// Función para buscar usuario por email
export const searchUserInZendesk = async (email) => {
    try {
        // Escapar caracteres especiales en el email para la URL
        const encodedEmail = encodeURIComponent(email);

        // URL de la API de Zendesk
        const url = `https://${ZENDESK_SUBDOMAIN}.zendesk.com/api/v2/users/search.json?query=email:${encodedEmail}`;

        // Crear la cadena de autenticación básica
        const auth = Buffer.from(`${ZENDESK_EMAIL}/token:${ZENDESK_API_TOKEN}`).toString('base64');

        // Realizar la solicitud
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Basic ${auth}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            console.error(`Zendesk API error: ${response.status}`);
            throw new Error(`Zendesk API error: ${response.status}`);
        }

        const data = await response.json();

        // Obtener el primer usuario (que debería ser el único que coincide exactamente)
        const user = data.users.length > 0 ? data.users[0] : null;

        if (user) {
            return user;
        } else {
            console.log('User not found in Zendesk');
            return null;
        }
    } catch (error) {
        console.error('Error searching user in Zendesk:', error);
        throw error;
    }
}; 