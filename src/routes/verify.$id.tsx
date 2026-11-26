import { createFileRoute, Link } from '@tanstack/react-router';
import { ShieldQuestion } from 'lucide-react';
import { useEffect, useState } from 'react';
import { PassportView } from '@/components/passport-view';
import { useWorkspace } from '@/components/skillbridge-provider';
import { isPassport, type Passport } from '@/lib/skillbridge';
import { Button } from '@/components/ui/button';

export const Route = createFileRoute('/verify/$id')({
  validateSearch: (search: Record<string, unknown>): { passport?: string } => typeof search['passport'] === 'string' ? { passport: search['passport'] } : {},
  head: () => ({ meta: [
    { title: 'Skill Passport | SkillBridge' },
    { name: 'description', content: 'View a public SkillBridge demo passport with practical competency scores, a credential fingerprint, and bridging training options.' },
    { property: 'og:title', content: 'Public Skill Passport | SkillBridge' },
    { property: 'og:description', content: 'A shareable record of practical skills and a clear path to bridge the gaps.' },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary_large_image' },
  ] }),
  component: VerifyPage,
});
function VerifyPage() {
  const { id } = Route.useParams();
  const { passport: encoded } = Route.useSearch();
  const { passports, ready } = useWorkspace();
  const [shared, setShared] = useState<Passport | null>(null);
  const [decoded, setDecoded] = useState(false);
  useEffect(() => {
    setShared(null);
    try {
      if (encoded && encoded.length < 20000) { const value: unknown = JSON.parse(atob(encoded)); if (isPassport(value) && value.id === id) setShared(value); }
    } catch { /* Invalid share data is treated as an unavailable passport. */ }
    setDecoded(true);
  }, [encoded, id]);
  if (!ready || !decoded) return <main className="workspace"><p className="empty-state" role="status">Opening skill passport…</p></main>;
  const passport = passports.find(p => p.id === id) ?? shared;
  if (!passport) return <main className="workspace"><div className="empty-state"><ShieldQuestion size={44}/><h2>Passport not available</h2><p>This credential isn’t stored in this browser. Ask the candidate for their full share link.</p><Button asChild className="mt-6"><Link to="/" search={{}}>Go to candidate portal</Link></Button></div></main>;
  return <PassportView passport={passport}/>;
}