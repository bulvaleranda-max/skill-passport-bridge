export type RoleId = 'developer' | 'bookkeeper' | 'solar';
export type VoucherStatus = 'not-requested' | 'requested' | 'approved';
export interface Question { competency: string; prompt: string; hint: string; sample: string; keywords: string[] }
export interface Course { name: string; provider: string; cost: number; duration: string }
export interface SkillRole { id: RoleId; name: string; category: string; description: string; questions: Question[]; courses: Course[] }
export interface Passport { id: string; name: string; roleId: RoleId; createdAt: string; scores: number[]; hash: string; voucher: VoucherStatus }

export const roles: SkillRole[] = [
  { id: 'developer', name: 'Software Developer', category: 'TECHNOLOGY', description: 'Build solutions. Prove your technical thinking.', questions: [
    { competency: 'API & backend logic', prompt: 'A checkout API sometimes creates duplicate orders when a customer retries a request. How would you prevent duplicates while allowing safe retries?', hint: 'Consider request identity, database writes, and responses.', sample: 'Use an idempotency key per checkout request. Store the key with a unique database constraint and write the order in a transaction. For a retry, return the existing order response instead of creating a duplicate.', keywords: ['idempotency', 'unique', 'transaction', 'retry', 'database'] },
    { competency: 'Debugging & testing', prompt: 'A page works locally but fails for some customers after deployment. Describe how you would identify the cause and verify the fix.', hint: 'Walk through the evidence you would collect and the tests you would run.', sample: 'Inspect logs and reproduce the error with the affected browser and input. Check network responses and environment configuration, isolate the failing code, then add a regression test. Monitor the deployment to verify the fix.', keywords: ['logs', 'reproduce', 'network', 'test', 'monitor'] },
    { competency: 'Application security', prompt: 'An authenticated user can change the ID in an API request and read another customer’s invoice. What is wrong, and how would you fix it?', hint: 'Think beyond sign-in: who is allowed to access the record?', sample: 'Check authorization on every request, not just authentication. Scope the database query to the user and reject access to other records. Add tests that attempt to access another customer’s invoice.', keywords: ['authorization', 'authentication', 'scope', 'reject', 'test'] },
  ], courses: [{ name: 'Moringa Backend Sprint', provider: 'Moringa School · Nairobi', cost: 15000, duration: '2 weeks' }, { name: 'Secure API Foundations', provider: 'ALX Kenya · Online', cost: 6000, duration: '1 week' }] },
  { id: 'bookkeeper', name: 'Bookkeeper', category: 'FINANCE & BUSINESS', description: 'Make the numbers count. Show your expertise.', questions: [
    { competency: 'Bank reconciliation', prompt: 'Your bank statement shows KSh 124,000, but the cash book shows KSh 118,500. How would you investigate and reconcile the difference?', hint: 'Consider outstanding items, charges, and recording errors.', sample: 'Compare the bank statement to the cash book transaction by transaction. Identify outstanding cheques, deposits in transit, bank charges and errors. Adjust the cash book for missing charges and document the reconciliation.', keywords: ['outstanding', 'deposits', 'charges', 'errors', 'reconciliation'] },
    { competency: 'Double-entry accounting', prompt: 'A business buys KSh 60,000 of equipment on credit, then pays KSh 20,000. Describe the journal entries and remaining liability.', hint: 'Name the accounts, debits, credits, and outstanding balance.', sample: 'Debit equipment KSh 60,000 and credit accounts payable KSh 60,000. On payment, debit accounts payable KSh 20,000 and credit bank KSh 20,000. The remaining liability is KSh 40,000.', keywords: ['debit', 'credit', 'payable', 'bank', '40,000'] },
    { competency: 'QuickBooks controls', prompt: 'A colleague has entered the same supplier bill twice in QuickBooks. How would you correct it and reduce the risk of duplicate entries?', hint: 'Consider audit trails, supplier references, and approvals.', sample: 'Review supplier references and the audit trail, verify the duplicate with the original invoice, then void the duplicate bill. Use unique invoice numbers, approval controls and regular duplicate checks.', keywords: ['audit', 'duplicate', 'void', 'invoice', 'approval'] },
  ], courses: [{ name: 'KASNEB Practical QuickBooks', provider: 'KASNEB Training Partner · Nairobi', cost: 8500, duration: '5 days' }, { name: 'Bookkeeping Controls Workshop', provider: 'KCA Training Partner · Online', cost: 4500, duration: '2 days' }] },
  { id: 'solar', name: 'Solar Technician', category: 'GREEN ENERGY', description: 'Power a brighter future. Verify your practical skills.', questions: [
    { competency: 'Battery bank sizing', prompt: 'A home uses 2.4 kWh of energy daily. Design a 24 V battery bank for two days of autonomy with 50% maximum depth of discharge. What minimum capacity in Ah is required?', hint: 'Show your calculation and state any assumptions.', sample: 'Required energy is 2.4 kWh × 2 days = 4.8 kWh. At 50% depth of discharge, storage must be 9.6 kWh. Capacity = 9600 Wh / 24 V = 400 Ah. Allow extra capacity for efficiency losses and use a suitable battery configuration.', keywords: ['4.8', '9.6', '400', '24', 'efficiency'] },
    { competency: 'Fault troubleshooting', prompt: 'A solar system’s battery is not charging despite full sunshine. What checks would you carry out, and in what order?', hint: 'Follow a safe, systematic diagnostic process.', sample: 'Check the charge controller display and settings, then safely measure panel voltage and battery voltage with a multimeter. Inspect fuses, connectors and polarity. Isolate the system before repairs and retest the charging current.', keywords: ['controller', 'voltage', 'multimeter', 'fuses', 'isolate'] },
    { competency: 'Wiring & electrical safety', prompt: 'You are connecting an inverter to a 24 V battery bank. Describe the safety checks, protective devices, and connection sequence you would follow.', hint: 'Consider isolation, polarity, cable sizing, and grounding.', sample: 'Isolate all power sources and confirm polarity with a meter. Use correctly sized cables and a fuse close to the battery. Connect grounding and follow the manufacturer sequence, then check secure terminals before energizing.', keywords: ['isolate', 'polarity', 'fuse', 'ground', 'cables'] },
  ], courses: [{ name: 'NITA Solar PV T2 Safety Module', provider: 'NITA · Nairobi', cost: 7500, duration: '3 days' }, { name: 'Practical Solar Installation', provider: 'Strathmore Energy Research Centre', cost: 12000, duration: '5 days' }] },
];

export function getRole(id: RoleId): SkillRole { return roles.find(role => role.id === id) ?? roles[0] as SkillRole; }
export function scoreAnswers(role: SkillRole, answers: string[]): number[] {
  return role.questions.map((question, index) => {
    const answer = (answers[index] ?? '').trim().toLowerCase();
    if (!answer) return 0;
    const matches = question.keywords.filter(keyword => answer.includes(keyword)).length;
    const score = Math.min(96, Math.round(25 + Math.min(answer.length / 10, 21) + matches * 10));
    // The simulated demo deliberately leaves the final competency below the voucher threshold.
    return index === 2 ? Math.min(64, score) : score;
  });
}
export function gapIndexes(scores: number[]): number[] { return scores.flatMap((score, index) => score < 70 ? [index] : []); }
export function requestVoucher(passport: Passport): Passport { return { ...passport, voucher: passport.voucher === 'approved' ? 'approved' : 'requested' }; }
export function approveVoucher(passport: Passport): Passport { return { ...passport, voucher: passport.voucher === 'requested' ? 'approved' : passport.voucher }; }
export const demoPassport: Passport = { id: 'SB-AMINA-SOLAR', name: 'Amina Wanjiku', roleId: 'solar', createdAt: '2026-11-26T09:20:00.000Z', scores: [92, 86, 64], hash: '95aa3e87f91db5bc6287df2e849d277e960bf5a4c61233e6509b670dde250624', voucher: 'not-requested' };
export function isPassport(value: unknown): value is Passport {
  if (!value || typeof value !== 'object') return false;
  const p = value as Record<string, unknown>;
  return typeof p['id'] === 'string' && typeof p['name'] === 'string' && roles.some(role => role.id === p['roleId']) && typeof p['createdAt'] === 'string' && !Number.isNaN(Date.parse(p['createdAt'])) && Array.isArray(p['scores']) && p['scores'].length === 3 && p['scores'].every(s => typeof s === 'number' && s >= 0 && s <= 100) && typeof p['hash'] === 'string' && /^[a-f0-9]{64}$/.test(p['hash']) && ['not-requested', 'requested', 'approved'].includes(String(p['voucher']));
}
export function money(amount: number): string { return `KSh ${amount.toLocaleString('en-KE')}`; }