import { describe, it, expect } from 'vitest';
import { calculateQuitStats, calculateHealthProgress } from '../lib/calculations';

describe('Calculations Service', () => {
  const mockProfile = {
    cigarettes_per_day: 20,
    pack_price: 20,
    cigarettes_per_pack: 20,
    quit_date: '2026-03-27T10:00:00Z',
  };

  const fixedNow = new Date('2026-03-28T10:00:00Z');

  it('calculates avoided cigarettes correctly over 24 hours', () => {
    const stats = calculateQuitStats(mockProfile, fixedNow);
    expect(stats.avoidedCount).toBe(20);
    expect(stats.days).toBe(1);
    expect(stats.hours).toBe(0);
  });

  it('calculates money saved correctly', () => {
    const stats = calculateQuitStats(mockProfile, fixedNow);
    expect(stats.moneySaved).toBe(20);
  });

  it('calculates hours of life recovered correctly (11 min/cig)', () => {
    const stats = calculateQuitStats(mockProfile, fixedNow);
    expect(stats.minutesRecovered).toBe(220);
  });

  it('marks health milestones correctly after 24 hours', () => {
    const totalSeconds = 86400;
    const progress = calculateHealthProgress(totalSeconds);
    
    const achievedLabels = progress.filter(p => p.achieved).map(p => p.timeLabel);
    expect(achievedLabels).toContain('20 minutos');
    expect(achievedLabels).toContain('8 horas');
    expect(achievedLabels).toContain('24 horas');
    
    const notAchieved = progress.find(p => p.timeLabel === '48 horas');
    expect(notAchieved?.achieved).toBe(false);
  });
});
