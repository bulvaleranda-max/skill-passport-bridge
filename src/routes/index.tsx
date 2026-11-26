import { createFileRoute } from "@tanstack/react-router";
import { CandidatePortal } from '@/components/candidate-portal';
import { EmployerView } from '@/components/employer-view';

// The home route ships no og:image, so serve-time hosting can inject the
// project's social preview (explicit og:image or latest screenshot).
export const Route = createFileRoute("/")({
  validateSearch: (search: Record<string, unknown>): { view?: 'employer' } => search['view'] === 'employer' ? { view: 'employer' } : {},
  head: () => ({ meta: [
    { title: 'SkillBridge | Practical Skills, Real Opportunity' },
    { name: 'description', content: 'Verify practical skills, build a shareable skill passport, and bridge skill gaps with Kenyan training vouchers in the SkillBridge demo.' },
    { property: 'og:title', content: 'SkillBridge | Your Potential, Verified' },
    { property: 'og:description', content: 'Show what you know. Bridge what you don’t. Explore practical assessments and sponsored training.' },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary_large_image' },
  ] }),
  component: Index,
});

// IMPORTANT: Replace this placeholder. See ./README.md for routing conventions.
function Index() {
  const { view } = Route.useSearch();
  return view === 'employer' ? <EmployerView/> : <CandidatePortal/>;
}
