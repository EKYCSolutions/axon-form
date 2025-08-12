export const exportJSON = (data: unknown, filename = 'data.json') => {
  // Convert object to JSON string
  const jsonStr = JSON.stringify(data, null, 2); // Pretty print with 2 spaces

  // Create a Blob with JSON content
  const blob = new Blob([jsonStr], { type: 'application/json' });

  // Create a temporary download link
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  // Set download attributes
  link.href = url;
  link.download = filename;

  // Append link to body and trigger click
  document.body.appendChild(link);
  link.click();

  // Clean up
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
