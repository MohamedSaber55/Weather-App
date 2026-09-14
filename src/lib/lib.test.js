import { aqiLevel, moonAbbreviation, moonIsWaning, shortCondition, uvProtection } from './conditions';
import { addMinutes, clockHours, coordsLabel, dateStamp, dayStamp, utcOffsetLabel } from './units';
import { countryCode } from './countries';

describe('air quality', () => {
  test('maps the US EPA category 1-6, not a 0-500 index', () => {
    expect(aqiLevel(1).label).toBe('Good');
    expect(aqiLevel(2).label).toBe('Moderate');
    expect(aqiLevel(6).label).toBe('Hazardous');
  });

  test('clamps values outside the 1-6 range', () => {
    expect(aqiLevel(0).index).toBe(1);
    expect(aqiLevel(42).index).toBe(6);
    expect(aqiLevel(undefined).index).toBe(1);
  });
});

describe('formatting helpers', () => {
  test('derives the UTC offset from local time and epoch', () => {
    // 2026-09-13 14:00 local, epoch 12:00 UTC -> UTC+2
    expect(utcOffsetLabel('2026-09-13 14:00', Date.UTC(2026, 8, 13, 12, 0) / 1000)).toBe('UTC+2');
    expect(utcOffsetLabel('2026-09-13 17:30', Date.UTC(2026, 8, 13, 12, 0) / 1000)).toBe('UTC+5:30');
    expect(utcOffsetLabel('2026-09-13 07:00', Date.UTC(2026, 8, 13, 12, 0) / 1000)).toBe('UTC-5');
  });

  test('labels coordinates with hemispheres', () => {
    expect(coordsLabel(29.07, 31.1)).toBe('29.07N 31.10E');
    expect(coordsLabel(-33.87, -70.5)).toBe('33.87S 70.50W');
  });

  test('stamps dates and hours', () => {
    expect(dateStamp('2026-09-14 12:40')).toBe('Mon 14 Sep 2026');
    expect(dayStamp('2026-09-14')).toBe('Mon 14');
    expect(clockHours('06:31 AM')).toBeCloseTo(6.5167, 3);
    expect(addMinutes('2026-09-14 12:35', 15, 24)).toBe('12:50');
  });

  test('shortens long condition text for the forecast table', () => {
    expect(shortCondition('Sunny')).toBe('Sunny');
    expect(shortCondition('Partly cloudy')).toBe('Pt cloudy');
  });

  test('describes the moon and UV protection', () => {
    expect(moonAbbreviation('Waxing Crescent')).toBe('WXC');
    expect(moonIsWaning('Waning Gibbous')).toBe(true);
    expect(moonIsWaning('Waxing Crescent')).toBe(false);
    expect(uvProtection(9)).toMatch(/SPF 50/);
    expect(uvProtection(1)).toBe('None needed');
  });

  test('turns country names into ISO codes', () => {
    expect(countryCode('Egypt')).toBe('EG');
    expect(countryCode('United States of America')).toBe('US');
    expect(countryCode('')).toBe('');
  });
});
