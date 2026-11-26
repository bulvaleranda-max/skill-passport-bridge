import { describe, expect, it } from 'vitest';
import { approveVoucher, demoPassport, gapIndexes, getRole, isPassport, requestVoucher, roles, scoreAnswers } from '@/lib/skillbridge';

describe('Practical demo assessment rules', () => {
  it('offers Software Developer, Bookkeeper, and Solar Technician', () => {
    expect(roles.map(role => role.name)).toEqual(['Software Developer', 'Bookkeeper', 'Solar Technician']);
  });
  it('has three practical questions for each candidate role', () => {
    expect(roles.map(role => role.questions.length)).toEqual([3, 3, 3]);
  });
  it('keeps one sample-answer competency below 70% for every role', () => {
    for (const role of roles) {
      const scores = scoreAnswers(role, role.questions.map(q => q.sample));
      expect(scores[2]).toBe(64);
      expect(scores[0]).toBeGreaterThanOrEqual(70);
      expect(scores[1]).toBeGreaterThanOrEqual(70);
    }
  });
  it('dynamically rewards relevant keywords and substantive answers', () => {
    const role = getRole('solar');
    const short = scoreAnswers(role, ['battery', '', '']);
    const detailed = scoreAnswers(role, role.questions.map(q => q.sample));
    expect(detailed[0]).toBeGreaterThan(short[0] ?? 100);
    expect(scoreAnswers(role, ['', '', ''])).toEqual([0, 0, 0]);
  });
  it('recommends bridging only for competency scores strictly under 70%', () => {
    expect(gapIndexes([69, 70, 71])).toEqual([0]);
  });
  it('provides one or two Kenyan training recommendations with cost and duration per role', () => {
    for (const role of roles) {
      expect(role.courses.length).toBeGreaterThanOrEqual(1);
      expect(role.courses.length).toBeLessThanOrEqual(2);
      expect(role.courses.every(c => c.cost > 0 && c.duration.length > 0)).toBe(true);
    }
  });
});
describe('Bridging vouchers', () => {
  it('marks a requested bridging voucher as requested', () => { expect(requestVoucher(demoPassport).voucher).toBe('requested'); });
  it('allows sponsor approval of a requested voucher', () => { expect(approveVoucher(requestVoucher(demoPassport)).voucher).toBe('approved'); });
  it('does not approve unrequested vouchers or undo an approval', () => {
    expect(approveVoucher(demoPassport).voucher).toBe('not-requested');
    expect(requestVoucher({ ...demoPassport, voucher: 'approved' }).voucher).toBe('approved');
  });
  it('validates public share data before rendering it', () => {
    expect(isPassport(demoPassport)).toBe(true);
    expect(isPassport({ ...demoPassport, scores: [92, 86, 110] })).toBe(false);
    expect(isPassport({ ...demoPassport, roleId: 'unknown' })).toBe(false);
    expect(isPassport({ ...demoPassport, hash: 'invalid' })).toBe(false);
  });
});