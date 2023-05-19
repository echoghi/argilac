export default async function clearErrorLogs() {
  try {
    const response = await fetch('/api/logs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ action: 'delete' })
    });

    if (!response.ok) {
      throw new Error('Error deleting logs');
    }

    const data = await response.json();

    return data;
  } catch (error: any) {
    console.error('Error:', error.message);
  }
}
