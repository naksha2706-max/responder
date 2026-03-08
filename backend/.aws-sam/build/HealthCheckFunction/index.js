export const handler = async (event) => {
  return {
    statusCode: 200,
    headers: { 
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      status: 'healthy',
      service: 'AI First Responder API',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    })
  };
};