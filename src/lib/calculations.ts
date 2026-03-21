/**
 * Core calculation engine for QuitBoost
 * Centralizes all health and financial logic to ensure consistency across the app.
 */

export interface ProfileStats {
  cigarettes_per_day: number;
  price_per_cigarette: number;
  quit_date: string;
}

export interface CalculatedStats {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  avoidedCount: number;
  moneySaved: number;
  hoursRecovered: number;
  minutesRecovered: number;
  totalSeconds: number;
}

/**
 * Calculates time and financial savings based on quit date and consumption
 */
export const calculateQuitStats = (profile: ProfileStats, now: Date = new Date()): CalculatedStats => {
  const quitDate = new Date(profile.quit_date);
  const diffMs = now.getTime() - quitDate.getTime();
  const totalSeconds = Math.max(0, Math.floor(diffMs / 1000));
  
  const days = Math.floor(totalSeconds / (3600 * 24));
  const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const cigarettesPerDay = profile.cigarettes_per_day || 0;
  const pricePerCigarette = profile.price_per_cigarette || 0;

  // Average avoided count based on time elapsed
  // (cigarettes per day / 86400 seconds in a day) * seconds elapsed
  const avoidedCount = Math.floor((totalSeconds / 86400) * cigarettesPerDay);
  const moneySaved = avoidedCount * pricePerCigarette;

  // Time of life recovered: ~11 min per cigarette (Source: BMJ/OMS)
  const minutesRecovered = avoidedCount * 11;
  const hoursRecovered = Math.floor(minutesRecovered / 60);

  return {
    days,
    hours,
    minutes,
    seconds,
    avoidedCount,
    moneySaved,
    hoursRecovered,
    minutesRecovered,
    totalSeconds,
  };
};

/**
 * Health milestones thresholds (in minutes)
 */
export const HEALTH_MILESTONES = [
  { minutes: 20, label: "20 min", benefit: "Pressão arterial normaliza" },
  { minutes: 480, label: "8 horas", benefit: "O₂ no sangue normaliza" },
  { minutes: 1440, label: "24 horas", benefit: "Risco de infarto reduz" },
  { minutes: 2880, label: "48 horas", benefit: "Paladar e olfato melhoram" },
  { minutes: 4320, label: "72 horas", benefit: "Nicotina eliminada do corpo" },
  { minutes: 10080, label: "1 semana", benefit: "Pulmões iniciam regeneração" },
  { minutes: 20160, label: "2 semanas", benefit: "Circulação melhora 30%" },
  { minutes: 43200, label: "1 mês", benefit: "Função pulmonar +30%" },
  { minutes: 129600, label: "3 meses", benefit: "Risco cardíaco reduz 50%" },
  { minutes: 525600, label: "1 ano", benefit: "Risco coronariano metade" },
];

/**
 * Calculates progress for each health milestone
 */
export const calculateHealthProgress = (totalSeconds: number) => {
  const diffMinutes = totalSeconds / 60;
  
  return HEALTH_MILESTONES.map((m) => ({
    ...m,
    progress: Math.min(100, (diffMinutes / m.minutes) * 100),
    achieved: diffMinutes >= m.minutes,
  }));
};
