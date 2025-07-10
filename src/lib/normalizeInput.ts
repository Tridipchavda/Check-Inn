export function normalizeInputDates(input: object): object {
  const data = input as any;

  return {
    ...data,
    checkIn:
      typeof data.checkIn === "string"
        ? data.checkIn
        : data.checkIn?.toISOString?.(),
    checkOut:
      typeof data.checkOut === "string"
        ? data.checkOut
        : data.checkOut?.toISOString?.(),
  };
}
