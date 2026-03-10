import { User } from '../types';

const USER_KEY = 'mindguide_user';

export const authService = {
  login: (email: string, licenseKey: string, productIds: string[]) => {
    const user: User = {
      email,
      licenseKey,
      purchasedProducts: productIds,
    };
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    return user;
  },

  logout: () => {
    localStorage.removeItem(USER_KEY);
    window.location.hash = '/';
  },

  getUser: (): User | null => {
    const stored = localStorage.getItem(USER_KEY);
    return stored ? JSON.parse(stored) : null;
  },

  updateProfile: (profile: any) => {
    const user = authService.getUser();
    if (user) {
      user.childProfile = profile;
      localStorage.setItem(USER_KEY, JSON.stringify(user));
      window.dispatchEvent(new Event('profileUpdated'));
      return user;
    }
    return null;
  },

  updateParentProfile1: (profile: any) => {
    const user = authService.getUser();
    if (user) {
      user.parentProfile1 = profile;
      localStorage.setItem(USER_KEY, JSON.stringify(user));
      window.dispatchEvent(new Event('profileUpdated'));
      return user;
    }
    return null;
  },

  updateParentProfile2: (profile: any) => {
    const user = authService.getUser();
    if (user) {
      user.parentProfile2 = profile;
      localStorage.setItem(USER_KEY, JSON.stringify(user));
      window.dispatchEvent(new Event('profileUpdated'));
      return user;
    }
    return null;
  },

  hasAccess: (productId: string): boolean => {
    const user = authService.getUser();
    if (!user) return false;
    if (user.purchasedProducts.includes('prod_bundle')) return true;
    return user.purchasedProducts.includes(productId);
  }
};