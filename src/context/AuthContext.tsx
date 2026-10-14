import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserRole, DemoAccount } from '../types';
import { dataService } from '../services/dataService';

export interface UserSession {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  brandId?: string;
  creatorId?: string;
  isDemo: boolean;
}

interface AuthContextType {
  user: UserSession | null;
  role: UserRole;
  demoAccounts: DemoAccount[];
  unreadNotificationCount: number;
  loginAsDemo: (demoRole: UserRole) => void;
  loginWithGoogle: (preferredRole?: UserRole) => Promise<void>;
  switchRole: (newRole: UserRole) => void;
  logout: () => void;
  refreshUnreadCount: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserSession | null>(() => {
    try {
      const saved = localStorage.getItem('kroma_user_session');
      if (saved) return JSON.parse(saved);
    } catch {}
    // Default to demo brand Nakshatra Weaves so app is instantly exploratory
    return {
      uid: 'demo-brand-nakshatra',
      email: 'demo.brand@example.com',
      displayName: 'Nakshatra Weaves',
      role: 'brand',
      brandId: 'brand-nakshatra-weaves',
      isDemo: true,
    };
  });

  const [demoAccounts, setDemoAccounts] = useState<DemoAccount[]>([]);
  const [unreadNotificationCount, setUnreadNotificationCount] = useState<number>(0);

  useEffect(() => {
    dataService.getDemoAccounts().then(accs => setDemoAccounts(accs));
  }, []);

  const refreshUnreadCount = async () => {
    if (!user) {
      setUnreadNotificationCount(0);
      return;
    }
    const id = user.role === 'brand' ? user.brandId : user.role === 'creator' ? user.creatorId : undefined;
    const notifs = await dataService.getNotifications(user.role, id);
    setUnreadNotificationCount(notifs.filter(n => !n.read).length);
  };

  useEffect(() => {
    refreshUnreadCount();
  }, [user]);

  const loginAsDemo = (demoRole: UserRole) => {
    const demo = demoAccounts.find(a => a.role === demoRole);
    if (!demo) return;
    const session: UserSession = {
      uid: `demo-${demo.role}`,
      email: demo.email,
      displayName: demo.displayName,
      role: demo.role,
      brandId: demo.brandId,
      creatorId: demo.creatorId,
      isDemo: true,
    };
    setUser(session);
    localStorage.setItem('kroma_user_session', JSON.stringify(session));
  };

  const loginWithGoogle = async (preferredRole: UserRole = 'brand') => {
    const session: UserSession = {
      uid: `google-${Date.now()}`,
      email: 'creator.verified@kroma.ai',
      displayName: 'Verified Google User',
      role: preferredRole,
      brandId: preferredRole === 'brand' ? 'brand-nakshatra-weaves' : undefined,
      creatorId: preferredRole === 'creator' ? 'cr-aanya-frames' : undefined,
      isDemo: false,
    };
    setUser(session);
    localStorage.setItem('kroma_user_session', JSON.stringify(session));
  };

  const switchRole = (newRole: UserRole) => {
    if (!user) return;
    const demo = demoAccounts.find(a => a.role === newRole);
    const updated: UserSession = {
      ...user,
      role: newRole,
      displayName: demo ? demo.displayName : user.displayName,
      brandId: demo?.brandId,
      creatorId: demo?.creatorId,
    };
    setUser(updated);
    localStorage.setItem('kroma_user_session', JSON.stringify(updated));
  };

  const logout = () => {
    loginAsDemo('brand');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || 'brand',
        demoAccounts,
        unreadNotificationCount,
        loginAsDemo,
        loginWithGoogle,
        switchRole,
        logout,
        refreshUnreadCount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
