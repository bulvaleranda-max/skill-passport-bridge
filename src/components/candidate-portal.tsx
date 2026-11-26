import { useState } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import { ArrowLeft, ArrowRight, Award, BadgeCheck, Calculator, Check, CheckCircle2, Clock3, Code2, FileCheck2, GraduationCap, Lightbulb, LoaderCircle, LockKeyhole, ShieldCheck, Sparkles, Sun, Ticket, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { roles, scoreAnswers, demoPassport, type Passport, type SkillRole } from '@/lib/skillbridge';
import { useWorkspace } from './skillbridge-provider';

const roleIcons = { developer: Code2, bookkeeper: Calculator, solar: Sun };
export function CandidatePortal() {
  const { session, login, save, passports } = useWorkspace();
  const navigate = useNavigate();
  const [role, setRole] = useState<SkillRole | null>(null);
  const [answers, setAnswers] = useState<string[]>(['', '', '']);
  const [step, setStep] = useState(0);
  const [evaluating, setEvaluating] = useState(false);
  const [error, setError] = useState('');
  const latest = passports[0] ?? demoPassport;
  function begin(selected: SkillRole) { login('candidate'); setRole(selected); setStep(0); setAnswers(['', '', '']); setError(''); }
  function fillSamples() { if (role) setAnswers(role.questions.map(q => q.sample)); }
  async function submit() {
    if (!role || evaluating) return;
    if (answers.some(a => !a.trim())) { setError('Please answer all three scenarios before submitting.'); return; }
    setEvaluating(true); setError('');
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      const createdAt = new Date().toISOString();
      const id = `SB-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
      const scores = scoreAnswers(role, answers);
      const encoded = new TextEncoder().encode(JSON.stringify({ id, name: 'Amina Wanjiku', roleId: role.id, createdAt, scores }));
      const digest = await crypto.subtle.digest('SHA-256', encoded);
      const hash = Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, '0')).join('');
      const passport: Passport = { id, name: 'Amina Wanjiku', roleId: role.id, createdAt, scores, hash, voucher: 'not-requested' };
      save(passport);
      await navigate({ to: '/verify/$id', params: { id } });
    } catch { setError('Your assessment could not be saved. Please try again.'); } finally { setEvaluating(false); }
  }
  if (role) {
    const question = role.questions[step];
    if (!question) return null;
    return <main className="workspace"><Button variant="ghost" className="back-link px-0" disabled={evaluating} onClick={() => setRole(null)}><ArrowLeft size={14}/>Back to roles</Button><div className="page-heading"><div><div className="eyebrow"><Sparkles size={13}/>PRACTICAL SKILL ASSESSMENT</div><h1>{role.name}</h1><p>Real-world scenarios. Your experience. Your own words.</p></div><span className="heading-label"><span className="badge-status">Amina Wanjiku</span></span></div><div className="assessment-layout"><section className="assessment-tool">{evaluating ? <div className="evaluating" role="status"><LoaderCircle size={42} className="spin-icon"/><h2>AI Evaluating Logic & Rubric...</h2><p className="text-muted-foreground">Checking your practical competencies</p><span className="badge-status">Simulated assessment</span></div> : <><div className="assessment-topline"><span>QUESTION {step + 1} OF 3 · <Clock3 size={12} className="inline"/> ~5 minutes</span><Button variant="ghost" size="sm" onClick={fillSamples}><Sparkles size={13}/>Auto-Fill Sample Answers</Button></div><div className="assessment-track">{role.questions.map((q, i) => <span key={q.competency} className={i <= step ? 'complete' : ''}/>)}</div><div className="eyebrow">SCENARIO {String(step + 1).padStart(2, '0')}</div><h2>{question.competency}</h2><p className="scenario">{question.prompt}</p><label htmlFor="scenario-answer" className="answer-label">Your practical approach</label><Textarea id="scenario-answer" className="assessment-answer" placeholder="Walk us through your thinking..." value={answers[step] ?? ''} onChange={e => { const value = e.target.value; setAnswers(previous => previous.map((a, i) => i === step ? value : a)); setError(''); }}/><p className="answer-hint"><Lightbulb size={13} className="inline mr-1"/>{question.hint}</p>{error && <p className="mb-4 text-destructive text-xs" role="alert">{error}</p>}<div className="assessment-actions"><Button variant="ghost" disabled={step === 0} onClick={() => setStep(s => s - 1)}><ArrowLeft size={14}/>Previous</Button><Button disabled={!(answers[step] ?? '').trim()} onClick={() => step < 2 ? setStep(s => s + 1) : void submit()}>{step === 2 ? 'Submit assessment' : 'Next scenario'}<ArrowRight size={14}/></Button></div></>}</section><aside className="assessment-competencies"><h3>Your assessment roadmap</h3>{role.questions.map((q, i) => <div className={`competency-step ${i === step ? 'current' : ''}`} key={q.competency}><span className="step-number">{i < step ? <Check size={13}/> : i + 1}</span>{q.competency}</div>)}<div className="assessment-note"><ShieldCheck size={18} className="mb-2"/>Your answers are only used in this local demo. Take your time—there’s no countdown.</div></aside></div></main>;
  }
  return <main className="workspace">
    <div className="page-heading"><div><div className="eyebrow"><span className="h-1.5 w-1.5 rounded-full bg-primary"/>YOUR POTENTIAL, VERIFIED</div><h1>Turn your skills into <span className="text-primary">opportunity.</span></h1><p>Show what you know. Bridge what you don’t. Take the next step in your career.</p></div><span className="heading-label"><ShieldCheck size={14}/>Practical skills. Meaningful proof.</span></div>
    <div className="candidate-layout"><div>
      <section className="demo-login-strip" aria-label="Candidate demo login"><span className="avatar">AW</span><div><strong>{session === 'candidate' ? 'Welcome back, Amina Wanjiku' : 'Meet Amina Wanjiku'}</strong><p>{session === 'candidate' ? 'Your next chapter starts with what you know.' : 'Your candidate profile is ready to explore.'}</p></div>{session === 'candidate' ? <span className="badge-status ml-auto"><CheckCircle2 size={12}/>Signed in</span> : <Button variant="outline" className="login-action" onClick={() => login('candidate')}>Continue as Amina<ArrowRight size={13}/></Button>}</section>
      <div className="section-title"><h2>What’s your next role?</h2><span>3 paths. One step forward.</span></div>
      <div className="role-grid">{roles.map(selected => { const Icon = roleIcons[selected.id]; return <article className="role-card" key={selected.id}><div className="role-icon"><Icon size={25} strokeWidth={1.6}/></div><div className="role-category">{selected.category}</div><h3>{selected.name}</h3><p>{selected.description}</p><div className="role-meta"><FileCheck2 size={12}/>3 scenarios<span>·</span><Clock3 size={11}/>~5 min</div><Button variant="outline" className="role-cta" onClick={() => begin(selected)}>Start assessment<ArrowRight size={14}/></Button></article>; })}</div>
      <div className="trust-row"><span><Zap size={12}/>Instant results</span><span><LockKeyhole size={12}/>No CV required</span><span><BadgeCheck size={12}/>Practical, not theoretical</span></div>
      <div className="next-banner"><span className="next-banner-icon"><Ticket size={19}/></span><div><h3>A skill gap isn’t a dead end.</h3><p>Find local training and request a bridging voucher to help you get there.</p></div><ArrowRight size={17} className="ml-auto text-primary shrink-0"/></div>
    </div><aside className="candidate-aside"><section className="journey-panel"><h2>A small step. A bigger future.</h2><p className="journey-subtitle">Your path to verified potential</p>{[{ title: 'Choose your role', text: 'Pick the path that fits your experience.' }, { title: 'Show your skills', text: 'Answer 3 practical, real-world scenarios.' }, { title: 'Get your skill passport', text: 'Share a clear picture of your strengths.' }, { title: 'Bridge the gap', text: 'Connect with training and sponsorship.' }].map((item, i) => <div className="journey-step" key={item.title}><span className="step-number">{i === 0 ? <Check size={13}/> : i + 1}</span><div><h3>{item.title}</h3><p>{item.text}</p></div></div>)}</section>
      <section className="passport-teaser"><div className="mini-passport" aria-hidden="true"><div className="mini-passport-top"><span className="flex items-center gap-1"><Award size={11}/>SKILL PASSPORT</span><ShieldCheck size={12}/></div><div className="mini-passport-person"><span className="avatar">AW</span><div><strong>Amina Wanjiku</strong><p>Verified practical competencies</p></div></div><div className="mini-bars"><span/><span/><span/></div></div><h3>More than a certificate.</h3><p>A living record of your skills, ready to share with the world.</p><Link to="/verify/$id" params={{ id: latest.id }}>Explore a skill passport<ArrowRight size={12}/></Link></section>
    </aside></div>
  </main>;
}