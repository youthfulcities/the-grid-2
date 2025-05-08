import averageMostCommonUnit from './averageMostCommonUnit.js';
import normalizePricePer from './normalizePricePer.js';
import normalizeQuantity from './normalizeQuantity.js';

const groupAndNormalize = (deduped) => {
  const grouped = {
    prepared: {},
    not_prepared: {},
  };

  for (const item of deduped.values()) {
    const {
      city,
      category,
      price,
      quantity,
      quantity_unit,
      base_amount,
      base_unit,
      price_per_base_amount,
      prepared_in_canada,
      statscan_quantity,
      statscan_unit,
      timestamp,
    } = item;

    const baseAmount = parseFloat(base_amount);
    const baseUnit = base_unit?.toLowerCase();
    const quantityUnit = quantity_unit?.toLowerCase();
    const isPrepared = prepared_in_canada === 'true';
    const time = new Date(timestamp);

    if (!city || !category || isNaN(price)) continue;

    const { value: normalizedQty, unit: normalizedUnit } = normalizeQuantity(
      quantity,
      quantityUnit
    );

    const { value: normalizedStatscanQty, unit: normalizedStatscanUnit } =
      normalizeQuantity(statscan_quantity, statscan_unit);

    const result = normalizePricePer(
      baseAmount,
      baseUnit,
      parseFloat(price_per_base_amount)
    );

    if (!result) continue;

    const {
      value: normalizedBaseAmount,
      unit: normalizedBaseUnit,
      price_per_base_amount: pricePerBase,
    } = result;

    if (pricePerBase == null) continue;

    const key = `${city}|${category}`;
    const targetGroup = isPrepared ? grouped.prepared : grouped.not_prepared;

    if (!targetGroup[key]) {
      targetGroup[key] = {
        city,
        category: category.toLowerCase().trim(),
        prepared_in_canada: isPrepared,
        latest_timestamp: time,
        total_price: price,
        statscan_quantity: normalizedStatscanQty ?? null,
        statscan_unit: normalizedStatscanUnit ?? null,
        total_price_per_base: pricePerBase,
        total_quantity: normalizedQty ?? 0,
        quantity_count: normalizedQty ? 1 : 0,
        quantity_unit: normalizedUnit ?? null,
        quantity_units: new Set(normalizedUnit ? [normalizedUnit] : []),
        base_amount_total: normalizedBaseAmount ?? 0,
        base_count: normalizedBaseAmount ? 1 : 0,
        base_unit: normalizedBaseUnit ?? null,
        base_units: new Set(normalizedBaseUnit ? [normalizedBaseUnit] : []),
        price_per_base_values: normalizedBaseUnit
          ? [{ unit: normalizedBaseUnit, value: pricePerBase }]
          : [],
        quantity_values:
          normalizedUnit && normalizedQty
            ? [{ unit: normalizedUnit, value: normalizedQty }]
            : [],
        base_amount_values:
          normalizedBaseUnit && !isNaN(normalizedBaseAmount)
            ? [{ unit: normalizedBaseUnit, value: normalizedBaseAmount }]
            : [],
        count: 1,
      };
    } else {
      const group = targetGroup[key];
      group.total_price += price;
      group.total_price_per_base += pricePerBase;
      group.count += 1;

      if (normalizedQty != null && normalizedQty !== 0) {
        group.total_quantity += normalizedQty;
        group.quantity_count += 1;
      }

      if (!isNaN(normalizedBaseAmount) && normalizedBaseAmount !== 0) {
        group.base_amount_total += normalizedBaseAmount;
        group.base_count += 1;
      }

      if (!group.base_unit && normalizedBaseUnit) {
        group.base_unit = normalizedBaseUnit;
      }

      if (!group.quantity_unit && normalizedUnit) {
        group.quantity_unit = normalizedUnit;
      }

      if (normalizedBaseUnit) {
        group.base_units.add(normalizedBaseUnit);
        group.price_per_base_values.push({
          unit: normalizedBaseUnit,
          value: pricePerBase,
        });

        if (!isNaN(normalizedBaseAmount)) {
          group.base_amount_values.push({
            unit: normalizedBaseUnit,
            value: normalizedBaseAmount,
          });
        }
      }

      if (normalizedUnit && normalizedQty != null && normalizedQty !== 0) {
        group.quantity_values.push({
          unit: normalizedUnit,
          value: normalizedQty,
        });
      }

      if (normalizedUnit) {
        group.quantity_units.add(normalizedUnit);
      }

      if (time > group.latest_timestamp) {
        group.latest_timestamp = time;
      }
    }
  }

  const formatGroups = (groupMap) =>
    Object.values(groupMap).map((group) => {
      const pricePerBase = averageMostCommonUnit(group.price_per_base_values);
      const baseAmount = averageMostCommonUnit(group.base_amount_values);

      // ✨ Use base_unit as authoritative for quantity
      const baseUnit = pricePerBase.unit; // use this as the unit filter for quantity
      const matchingQuantities = group.quantity_values
        .filter((q) => (q.unit || '').trim().toLowerCase() === baseUnit)
        .map((q) => q.value)
        .filter((v) => typeof v === 'number' && !isNaN(v));

      const averageQuantity =
        matchingQuantities.length > 0
          ? parseFloat(
              (
                matchingQuantities.reduce((sum, v) => sum + v, 0) /
                matchingQuantities.length
              ).toFixed(5)
            )
          : null;

      const quantityFrequencyMap = {};
      for (const qty of matchingQuantities) {
        quantityFrequencyMap[qty] = (quantityFrequencyMap[qty] || 0) + 1;
      }

      let mostFrequentQuantity;
      let maxCount = 0;

      for (const [valueStr, count] of Object.entries(quantityFrequencyMap)) {
        const value = parseFloat(valueStr);
        if (count > maxCount) {
          maxCount = count;
          mostFrequentQuantity = value;
        }
      }

      return {
        city: group.city,
        category: group.category.toLowerCase().trim(),
        average_price:
          group.count > 0
            ? parseFloat((group.total_price / group.count).toFixed(2))
            : null,
        average_price_per_base: pricePerBase.average,
        statscan_quantity: group.statscan_quantity,
        statscan_unit: group.statscan_unit,
        base_unit: baseUnit,
        average_base_amount: baseAmount.average,
        most_frequent_quantity: mostFrequentQuantity,
        average_quantity: averageQuantity,
        quantity_unit: baseUnit, // 🚨 always use the same unit as base_unit
        latest_timestamp: group.latest_timestamp.toISOString(),
        prepared_in_canada: group.prepared_in_canada,
      };
    });

  const result = [
    ...formatGroups(grouped.prepared),
    ...formatGroups(grouped.not_prepared),
  ];

  return result;
};

export default groupAndNormalize;
