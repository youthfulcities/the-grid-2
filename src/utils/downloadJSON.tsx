const downloadJSON = <T,>(data: T): void => {
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'processedData.json';
  link.click();
  URL.revokeObjectURL(url);
};

export default downloadJSON;
