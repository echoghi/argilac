interface Status {
  status: boolean;
}

export default async function updateStatus(status: Status) {
  try {
    const response = await fetch('/api/status', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ status })
    });

    if (!response.ok) {
      throw new Error('Error updating status');
    }

    const data = await response.json();

    return data;
  } catch (error: any) {
    console.error('Error:', error.message);
  }
}
