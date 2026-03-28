import { describe, it, expect } from 'vitest';
import { calculateQuitStats, calculateHealthProgress } from '../lib/calculations';

describe('Calculations Service', () => {
  const mockProfile = {
    cigarettes_per_day: 20,
    price_per_cigarette: 1, // R$ 1.00 per cigarette
    quit_date: '2026-03-27T10:00:00Z', // 24 hours ago (relative to a fixed "now")
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
    expect(stats.moneySaved).toBe(20); // 20 cigarettes * 1.00
  });

  it('calculates hours of life recovered correctly (11 min/cig)', () => {
    const stats = calculateQuitStats(mockProfile, fixedNow);
    // 20 cigarettes * 11 minutes = 220 minutes = 3.66 hours
    expect(stats.minutesRecovered).toBe(220);
    expect(stats.hoursRecovered).toBe(3);
  });

  it('marks health milestones correctly after 24 hours', () => {
    const totalSeconds = 86400; // 24 hours
    const progress = calculateHealthProgress(totalSeconds);
    
    // Milestones <= 24h should be achieved
    const achievedLabels = progress.filter(p => p.achieved).map(p => p.label);
    expect(achievedLabels).toContain('20 min');
    expect(achievedLabels).toContain('8 horas');
    expect(achievedLabels).toContain('24 horas');
    
    // 48 hours should NOT be achieved
    const notAchieved = progress.find(p => p.label === '48 horas');
    expect(notAchieved?.achieved).toBe(false);
  });
});
