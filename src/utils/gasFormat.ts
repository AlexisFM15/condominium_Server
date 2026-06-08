interface GasCalculation {
  consumption: number;
  gallons: number;
  amount: number;
}

export function calculateGasBill(
  previousReading: number,
  currentReading: number,
  gallonPrice: number,
): GasCalculation {
  const consumption = currentReading - previousReading;
  const gallons = consumption * 1.27;
  const amount = gallons * gallonPrice;

  return {
    consumption: Number(consumption.toFixed(3)),
    gallons: Number(gallons.toFixed(3)),
    amount: Number(amount.toFixed(2)),
  };
}