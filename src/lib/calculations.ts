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
 * Baseado na OMS e documentação científica sobre recuperação pós-tabagismo
 */
export const HEALTH_MILESTONES = [
  { minutes: 20, title: "Pulsação", description: "A sua pulsação volta ao normal." },
  { minutes: 8 * 60, title: "Níveis de oxigénio", description: "Os níveis de oxigénio no sangue voltam ao normal." },
  { minutes: 24 * 60, title: "Nível de Monóxido de Carbono", description: "Monóxido de carbono escurece no sangue." },
  { minutes: 48 * 60, title: "Fim da nicotina", description: "A nicotina já não existe no seu corpo." },
  { minutes: 72 * 60, title: "Paladar e olfato", description: "O seu sentido de paladar e olfato melhoram." },
  { minutes: 72 * 60 + 1, title: "Respiração", description: "Os tubos brônquicos começam a relaxar." },
  { minutes: 5 * 24 * 60, title: "Energia", description: "Os níveis de energia aumentam em todo o corpo." },
  { minutes: 14 * 24 * 60, title: "Circulação", description: "A circulação sanguínea melhora." },
  { minutes: 30 * 24 * 60, title: "Função pulmonar", description: "A função pulmonar aumenta em até 10%." },
  { minutes: 90 * 24 * 60, title: "Tosse e fadiga", description: "A tosse e os problemas respiratórios diminuem substancialmente." },
  { minutes: 180 * 24 * 60, title: "Prevenção infecções", description: "Cílios nos pulmões voltam a nascer, ajudando a combater infecções." },
  { minutes: 365 * 24 * 60, title: "Risco Cardíaco", description: "O risco de ataque cardíaco cai para metade." },
  { minutes: 5 * 365 * 24 * 60, title: "Risco de AVC", description: "O risco de AVC reduz-se ao nível de um não-fumador." },
  { minutes: 10 * 365 * 24 * 60, title: "Prevenção de Cancro 1", description: "O risco de desenvolver cancro do pulmão é reduzido para metade." },
  { minutes: 12 * 365 * 24 * 60, title: "Prevenção de Cancro 2", description: "Maior proteção contra cancro da boca, garganta, esôfago e bexiga." },
  { minutes: 15 * 365 * 24 * 60, title: "Saúde Restabelecida", description: "O risco de doenças coronárias é igual ao de um não-fumador." },
];

/**
 * Calculates progress for each health milestone
 */
export const calculateHealthProgress = (totalSeconds: number) => {
  const diffMinutes = totalSeconds / 60;
  
  return HEALTH_MILESTONES.map((m) => ({
    ...m,
    progress: Math.min(100, Math.max(0, (diffMinutes / m.minutes) * 100)),
    achieved: diffMinutes >= m.minutes,
  }));
};
