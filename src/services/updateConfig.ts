export default async function updateConfig(config: any, log?: any) {
  try {
    const response = await fetch('/api/config', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ config, log })
    });

    if (!response.ok) {
      throw new Error('Error updating config');
    }

    const data = await response.json();

    return data;
  } catch (error: any) {
    console.error('Error:', error.message);
  }
}
