import { DAILY_TOKEN_LIMIT } from './constants';

export function getTokenUsage() {
  const data = localStorage.getItem('shadowforgeTokenUsage');
  if (!data) return 0;

  const { date, usage } = JSON.parse(data);
  const today = new Date().toDateString();

  return today === date ? usage : 0;
}

export function addTokenUsage(newUsage: number) {
  const prevUsage = getTokenUsage();

  const totalUsage = prevUsage + newUsage;
  const today = new Date().toDateString();

  localStorage.setItem(
    'shadowforgeTokenUsage',
    JSON.stringify({ date: today, usage: totalUsage }),
  );
}

export function canUseTokens(newUsage: number) {
  const currentUsage = getTokenUsage();
  return currentUsage + newUsage <= DAILY_TOKEN_LIMIT;
}
