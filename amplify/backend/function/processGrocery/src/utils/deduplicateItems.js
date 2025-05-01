const deduplicateItems = (items) => {
  const deduped = new Map();

  items.forEach((item) => {
    const city = item.city?.toLowerCase();
    const product = item.product_name?.toLowerCase();
    const timestamp = new Date(item.timestamp);

    if (!city || !product || isNaN(timestamp)) return;

    const key = `${city}|${product}`;
    const existing = deduped.get(key);

    if (!existing || existing.timestamp < timestamp) {
      deduped.set(key, item);
    }
  });
  return Array.from(deduped.values());
};

export default deduplicateItems;
