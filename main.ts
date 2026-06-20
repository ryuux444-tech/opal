// main.ts
Deno.serve(async (req) => {
    const url = new URL(req.url);
    const query = url.searchParams.get('q');

    // CORS headers
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
    };

    // Health check
    if (url.pathname === '/health') {
        return new Response(JSON.stringify({ status: 'OK', message: 'Opal is running!' }), { headers });
    }

    // Search endpoint
    if (url.pathname === '/search' && query) {
        try {
            const response = await fetch('https://api.exa.ai/search', {
                method: 'POST',
                headers: {
                    'x-api-key': 'f38c66db-8052-44a3-8209-ab0342b561c7',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    query: query,
                    numResults: 10,
                    type: 'auto',
                    contents: { text: true, highlights: true }
                })
            });

            const data = await response.json();
            return new Response(JSON.stringify({
                success: true,
                query: query,
                results: data.results || []
            }), { headers });

        } catch (error) {
            return new Response(JSON.stringify({ error: error.message }), {
                status: 500,
                headers
            });
        }
    }

    // Root
    return new Response(JSON.stringify({ 
        message: '🚀 Opal Backend is running!',
        endpoints: {
            search: '/search?q=YOUR_QUERY',
            health: '/health'
        }
    }), { headers });
});
