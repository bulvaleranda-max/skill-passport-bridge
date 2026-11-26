import { Link } from '@tanstack/react-router';
import { ArrowUpRight, Building2, ChevronDown, GraduationCap, ShieldCheck, Sprout } from 'lucide-react';
import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { useWorkspace } from './skillbridge-provider';
import { demoPassport } from '@/lib/skillbridge';

export function SkillBridgeShell({ children }: { children: ReactNode }) {
  const { passports, session, login, storageError } = useWorkspace();
  const latest = passports[0] ?? demoPassport;
  return <div className="app-shell">
    <header className="app-header"><div className="header-inner">
      <Link to="/" search={{}} className="brand" aria-label="SkillBridge home"><span className="brand-mark"><Sprout size={23}/></span><span>Skill<span className="text-primary">Bridge</span><span className="brand-dot">.</span></span></Link>
      <nav className="main-nav" aria-label="Main navigation">
        <Link to="/" search={{}} activeOptions={{ exact: true, includeSearch: true }} activeProps={{ className: 'nav-link nav-active' }} inactiveProps={{ className: 'nav-link' }}><GraduationCap size={17}/>Candidate Portal</Link>
        <Link to="/verify/$id" params={{ id: latest.id }} activeProps={{ className: 'nav-link nav-active' }} inactiveProps={{ className: 'nav-link' }}><ShieldCheck size={17}/>Public Skill Passport</Link>
        <Link to="/" search={{ view: 'employer' }} activeOptions={{ includeSearch: true }} activeProps={{ className: 'nav-link nav-active' }} inactiveProps={{ className: 'nav-link' }}><Building2 size={17}/>Employer & Sponsor</Link>
      </nav>
      <div className="header-account"><span className="demo-badge"><span/>Demo workspace</span>{session ? <Button variant="ghost" className="account-button" onClick={() => login(null)} title="Sign out of demo"><span className="avatar">{session === 'candidate' ? 'AW' : 'ES'}</span><span>{session === 'candidate' ? 'Amina' : 'Sponsor'}</span><ChevronDown size={14}/></Button> : <span className="header-lock"><ShieldCheck size={19}/></span>}</div>
    </div></header>
    {storageError && <p role="alert" className="storage-warning">{storageError}</p>}
    {children}
    <footer className="app-footer"><span><Sprout size={15}/>Built for potential. Backed by proof.</span><span>Simulated assessments · Local demo only <ArrowUpRight size={14}/></span><span className="footer-location">Made for Kenya <span className="kenya-mark"/></span></footer>
  </div>;
}