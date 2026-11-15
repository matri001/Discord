
const ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;
const API_TOKEN = process.env.CLOUDFLARE_API_TOKEN;
const MODEL = process.env.CLOUDFLARE_CHAT_MODEL;
const AI_TIMEOUT = 70000;

async function chat(messages) {
    // 1. Validate configuration
    if (!ACCOUNT_ID || !API_TOKEN || !MODEL) {
        throw new Error('Missing Cloudflare AI configuration');
    }

    const url =
        `https://api.cloudflare.com/client/v4/accounts/` +
        `${ACCOUNT_ID}/ai/run/${MODEL}`;

    // 2. Send request to Cloudflare
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${API_TOKEN}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            messages,
            max_tokens: 2048,
            // // Disable reasoning to prioritize final answers
            chat_template_kwargs: {
            enable_thinking: false
            }
        }),
        
        signal: AbortSignal.timeout(AI_TIMEOUT)
        
    });

    // 3. Parse response
    const result = await response.json();

    console.log('[Cloudflare] HTTP Status:', response.status);

    // 4. Check API errors
    if (!response.ok || !result.success) {
        console.error('[Cloudflare] API errors:', result.errors);

        throw new Error(
            `Cloudflare API failed: HTTP ${response.status}`
        );
    }

    // 5. Extract model response
    const choice = result.result?.choices?.[0];

    if (!choice) {
        throw new Error('Cloudflare returned no choices');
    }

    console.log('[Cloudflare] Finish reason:', choice.finish_reason);
    console.log('[Cloudflare] Usage:', result.result?.usage);

    // 6. Check whether response was truncated
    if (choice.finish_reason === 'length') {
        throw new Error(
            'AI response was truncated. Token limit reached.'
        );
    }

    // 7. Get final answer
    const answer = choice.message?.content;

    if (typeof answer !== 'string' || !answer.trim()) {
        console.error(
            '[Cloudflare] Unexpected message:',
            JSON.stringify(choice.message, null, 2)
        );

        throw new Error('Cloudflare AI returned empty content');
    }

    // 8. Return answer
    return answer.trim();
}

module.exports = { chat };
