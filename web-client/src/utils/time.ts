export const humanReadableTime = (milliseconds: number): string => {
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  const displaySeconds = seconds % 60;
  const displayMinutes = minutes % 60;
  const displayHours = hours;

  const timeUnits = [
    { unit: "hour", value: displayHours },
    { unit: "minute", value: displayMinutes },
    { unit: "second", value: displaySeconds },
  ].filter((unit) => unit.value > 0);

  return timeUnits
    .map(({ unit, value }) => `${value} ${unit}${value !== 1 ? "s" : ""}`)
    .join(" ");
};
export const formatTime = (timestamp: Date) => {
  const hours = timestamp.getHours().toString().padStart(2, "0");
  const minutes = timestamp.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
};
