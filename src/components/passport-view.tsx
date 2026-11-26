import { useEffect, useState } from 'react';
import { Link } from '@tanstack/react-router';
import { QRCodeSVG } from 'qrcode.react';
import { ArrowLeft, ArrowRight, CalendarDays, Check, CheckCircle2, Clock3, Copy, Fingerprint, GraduationCap, ShieldCheck, Ticket, TriangleAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { gapIndexes, getRole, money, requestVoucher, type Passport } from '@/lib/skillbridge';
import { useWorkspace } from './skillbridge-provider';

export function PassportView({ passport }: { passport: Passport }) {
  const { save, session } = useWorkspace();
  const [url, setUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);
  const role = getRole(passport.roleId);
  const gaps = gapIndexes(passport.scores);
  useEffect(() => {
    // Carry the local credential in the share URL so it opens on a different device too.
    const payload = btoa(JSON.stringify(passport));
    setUrl(`${window.location.origin}/verify/${encodeURIComponent(passport.id)}?passport=${encodeURIComponent(payload)}`);
  }, [passport]);
  async function copyLink() { try { await navigator.clipboard.writeText(url); setCopied(true); setCopyError(false); setTimeout(() => setCopied(false), 2500); } catch { setCopyError(true); } }
  return <main className="workspace">
    <Link to="/" search={{}} className="back-link"><ArrowLeft size={14}/>Back to candidate portal</Link>
    <div className="page-heading"><div><div className="eyebrow"><ShieldCheck size={13}/>PUBLIC SKILL PASSPORT</div><h1>Your skills. On the record.</h1><p>A practical snapshot of what you can do—and where you can grow.</p></div><span className="heading-label"><ShieldCheck size={14}/>No sign-in required to view</span></div>
    <div className="passport-layout"><div>
      <section className="credential" aria-label="Verified skill credential">
        <div className="credential-header"><h2>SkillBridge Passport</h2><span className="badge-status"><ShieldCheck size={12}/>Demo verified</span></div>
        <div className="credential-person"><span className="avatar">AW</span><div><h3>{passport.name}</h3><p>{role.name} · Kenya</p></div></div>
        <div className="credential-meta"><span><CalendarDays size={12}/>{new Date(passport.createdAt).toLocaleString('en-GB', { timeZone: 'UTC', day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })} UTC</span><span>Credential ID: {passport.id}</span></div>
        <h3 className="scores-title">PRACTICAL COMPETENCIES</h3>
        {role.questions.map((question, i) => { const score = passport.scores[i] ?? 0; return <div className="score-item" key={question.competency}><div className="score-label"><span>{question.competency}</span><strong className={score < 70 ? 'gap-score' : ''}>{score}%</strong></div><progress className={`score-bar ${score < 70 ? 'gap-score' : ''}`} value={score} max={100} aria-label={`${question.competency}: ${score}%`}/></div>; })}
        <div className="credential-hash"><Fingerprint size={20}/><div>SHA-256 credential fingerprint<code title={passport.hash}>{passport.hash.slice(0, 22)}…{passport.hash.slice(-12)}</code></div><span className="ml-auto"><ShieldCheck size={17}/></span></div>
      </section>
      {gaps.length > 0 && <section className="gap-section"><div className="gap-heading"><h2><GraduationCap size={21} className="text-primary"/>Your skill gap card</h2><span className="badge-status badge-warning">{gaps.length} {gaps.length === 1 ? 'competency' : 'competencies'} to bridge</span></div><p>A little focused training can unlock your next opportunity. Explore these Kenyan training options.</p><div className="gap-list">{gaps.map(i => <span key={i} className="badge-status badge-warning"><TriangleAlert size={11}/>{role.questions[i]?.competency} · {passport.scores[i]}%</span>)}</div>
        <div className="course-grid">{role.courses.map(course => <article className="course-card" key={course.name}><h3>{course.name}</h3><p>{course.provider}</p><div className="course-meta"><strong>{money(course.cost)}</strong><span><Clock3 size={12}/>{course.duration}</span></div></article>)}</div>
        <div className="voucher-row"><p>{passport.voucher === 'approved' ? 'Your demo voucher is approved. You’re one step closer to closing the gap.' : passport.voucher === 'requested' ? 'Your request is ready for an employer or training sponsor to review.' : 'Give your next step a boost with a sponsored training voucher.'}</p><Button onClick={() => save(requestVoucher(passport))} disabled={passport.voucher !== 'not-requested'}><Ticket size={16}/>{passport.voucher === 'approved' ? 'Voucher Approved' : passport.voucher === 'requested' ? 'Voucher Requested' : 'Request Bridging Voucher'}{passport.voucher === 'not-requested' && <ArrowRight size={14}/>}</Button></div>
        {passport.voucher === 'requested' && <Button variant="link" asChild className="px-0 text-xs"><Link to="/" search={{ view: 'employer' }}>Review in Employer & Sponsor View<ArrowRight size={13}/></Link></Button>}
        <p className="public-notice">Illustrative courses, costs, and durations—not live training offers. Demo scoring intentionally keeps one competency below 70%.</p>
      </section>}
    </div><aside><section className="qr-panel"><h2>Proof you can take anywhere.</h2><p>A shareable passport for your next opportunity.</p><div className="qr-code">{url ? <QRCodeSVG value={url} size={210} marginSize={4} level="M" title="Scan to open this skill passport"/> : <div className="h-[210px] w-[210px] bg-muted"/>}</div><span className="badge-status"><CheckCircle2 size={11}/>Publicly accessible</span><Button variant="outline" className="share-button" disabled={!url} onClick={copyLink}>{copied ? <Check size={14}/> : <Copy size={14}/>} {copied ? 'Link copied' : 'Copy passport link'}</Button>{copyError && <p role="alert" className="mt-3 break-all text-xs">Copy this link manually: {url}</p>}</section><p className="public-notice"><ShieldCheck size={15}/>This is a simulated credential, not an accredited qualification. Shared data is not independently authenticated.</p>{session === 'employer' && <Button variant="outline" asChild className="w-full"><Link to="/" search={{ view: 'employer' }}><ArrowLeft size={14}/>Back to sponsor view</Link></Button>}</aside></div>
  </main>;
}