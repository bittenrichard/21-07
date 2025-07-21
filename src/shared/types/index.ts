export type PageKey = 'login' | 'dashboard' | 'new-screening' | 'results';

export interface NavigationItem {
  key: PageKey;
  label: string;
  icon: string;
  active?: boolean;
}