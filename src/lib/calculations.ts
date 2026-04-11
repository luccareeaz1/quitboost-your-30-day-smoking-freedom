/**
 * Core calculation engine for QuitBoost
 * Centralizes all health and financial logic to ensure consistency across the app.
 */

export interface ProfileStats {
  cigarettes_per_day: number;
  pack_price: number;
  cigarettes_per_pack: number;
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
  packsSaved: number;
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
  const packPrice = profile.pack_price || 0;
  const cigarettesPerPack = profile.cigarettes_per_pack || 20;

  // Average avoided count based on time elapsed
  const avoidedCount = Math.floor((totalSeconds / 86400) * cigarettesPerDay);
  const packsSaved = avoidedCount / cigarettesPerPack;
  const moneySaved = packsSaved * packPrice;

  // Time of life recovered: ~11 min per cigarette (Source: BMJ/OMS)
  const minutesRecovered = avoidedCount * 11;
  const hoursRecovered = parseFloat((minutesRecovered / 60).toFixed(1));

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
    packsSaved: parseFloat(packsSaved.toFixed(1)),
  };
};

/**
 * Scientific health milestones
 */
export const HEALTH_MILESTONES = [
  { timeLabel: "20 minutos", minutes: 20, title: "Pressão Arterial", description: "A pressão arterial e a frequência cardíaca normalizam.", icon: "heart-pulse" },
  { timeLabel: "8 horas", minutes: 8 * 60, title: "Monóxido de Carbono", description: "O nível de monóxido de carbono no sangue cai pela metade.", icon: "wind" },
  { timeLabel: "24 horas", minutes: 24 * 60, title: "Risco de Infarto", description: "O risco de infarto começa a diminuir.", icon: "shield-check" },
  { timeLabel: "48 horas", minutes: 48 * 60, title: "Nicotina Zerada", description: "A nicotina é eliminada; o paladar e o olfato voltam ao normal.", icon: "soup" },
  { timeLabel: "72 horas", minutes: 72 * 60, title: "Respiração Livre", description: "Os brônquios relaxam; respirar torna-se visivelmente mais fácil.", icon: "activity" },
  { timeLabel: "2 semanas", minutes: 14 * 24 * 60, title: "Circulação", description: "A circulação e a função pulmonar melhoram significativamente.", icon: "zap" },
  { timeLabel: "1-9 meses", minutes: 6 * 30 * 24 * 60, title: "Função Pulmonar", description: "A tosse diminui e a função pulmonar aumenta em até 10%.", icon: "stetho" },
  { timeLabel: "1 ano", minutes: 365 * 24 * 60, title: "Risco Coronário", description: "O risco de doenças coronárias cai pela metade.", icon: "heart" },
  { timeLabel: "5 anos", minutes: 5 * 365 * 24 * 60, title: "Risco de AVC", description: "O risco de AVC torna-se igual ao de um não-fumante.", icon: "brain" },
  { timeLabel: "10 anos", minutes: 10 * 365 * 24 * 60, title: "Câncer de Pulmão", description: "O risco de câncer de pulmão é reduzido em 50%.", icon: "lungs" },
  { timeLabel: "15 anos", minutes: 15 * 365 * 24 * 60, title: "Saúde Plena", description: "O risco de doenças infantis é igual ao de quem nunca fumou.", icon: "trophy" },
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

/**
 * Estimates overall health recovery percentage (0-100)
 */
export const calculateOverallHealth = (totalSeconds: number): number => {
  const milestones = calculateHealthProgress(totalSeconds);
  const achieved = milestones.filter(m => m.achieved).length;
  // Weighting recent milestones more, but for simplicity:
  return Math.min(100, Math.round((achieved / milestones.length) * 100));
};

