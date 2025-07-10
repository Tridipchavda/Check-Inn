export function calculateBookingCost({
  price,
  capacity,
  guests,
  nights,
}: {
  price: number;
  capacity: number;
  guests: number;
  nights: number;
}) {
  const base = price * nights;
  const extraGuests = Math.max(0, guests - capacity);
  const extraCharge = extraGuests * nights * 500;
  const tax = 0.1 * (base + extraCharge);
  const total = base + extraCharge + tax;

  const summary = [
    `Room Price: ₹${price} x ${nights} nights`,
    ...(extraGuests > 0
      ? [`Extra Guest Charge: ₹${extraCharge} (${extraGuests} extra guest)`]
      : []),
    `Tax (10%): ₹${tax.toFixed(0)}`,
    `Total: ₹${total.toFixed(0)}`,
  ].join("\n");

  return { total, summary };
}
