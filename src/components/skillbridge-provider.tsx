import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { demoPassport, isPassport, type Passport } from '@/lib/skillbridge';

interface Workspace { passports: Passport[]; ready: boolean; session: 'candidate' | 'employer' | null; login: (role: 'candidate' | 'employer' | null) => void; save: (passport: Passport) => void; storageError: string | null }
const WorkspaceContext = createContext<Workspace | null>(null);
const STORAGE_KEY = 'skillbridge-passports-v1';
export function SkillBridgeProvider({ children }: { children: ReactNode }) {
  const [passports, setPassports] = useState<Passport[]>([demoPassport]);
  const [ready, setReady] = useState(false);
  const [session, login] = useState<Workspace['session']>(null);
  const [storageError, setStorageError] = useState<string | null>(null);
  useEffect(() => {
    function restore() {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        const saved: unknown = raw ? JSON.parse(raw) : null;
        if (Array.isArray(saved)) setPassports(saved.filter(isPassport));
      } catch { setStorageError('Browser storage is unavailable. Changes will last for this visit only.'); }
    }
    restore(); setReady(true);
    window.addEventListener('storage', restore);
    return () => window.removeEventListener('storage', restore);
  }, []);
  function save(passport: Passport) {
    setPassports(previous => {
      const next = [passport, ...previous.filter(p => p.id !== passport.id)];
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch { setStorageError('Your changes could not be saved to this browser.'); }
      return next;
    });
  }
  return <WorkspaceContext.Provider value={{ passports, ready, session, login, save, storageError }}>{children}</WorkspaceContext.Provider>;
}
export function useWorkspace() { const workspace = useContext(WorkspaceContext); if (!workspace) throw new Error('SkillBridge workspace is required'); return workspace; }