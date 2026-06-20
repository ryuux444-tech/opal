const axios = require('axios');

const EXA_API_KEY = 'f38c66db-8052-44a3-8209-ab0342b561c7';

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const query = req.query.q;

    if (!query) {
        return res.status(400).json({ error: 'Missing q parameter' });
    }

    try {
        const response = await axios.post('https://api.exa.ai/search', {
            query: query,
            numResults: 10,
            type: 'auto',
            contents: { text: true, highlights: true }
        }, {
            headers: {
                'x-api-key': EXA_API_KEY,
                'Content-Type': 'application/json'
            }
        });

        res.json({
            success: true,
            query: query,
            results: response.data.results || []
        });

    } catch (error) {
        res.status(500).json({
            error: error.message,
            details: error.response?.data || null
        });
    }
};