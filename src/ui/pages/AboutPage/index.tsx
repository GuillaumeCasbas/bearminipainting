import aboutContent from '../about/ABOUT.md?raw';
import { RenderMarkdown } from '@/ui/components/RenderMarkdown';

export function AboutPage() {
  return (
    <div className="bg-white rounded-lg shadow-md p-8">
      <RenderMarkdown content={aboutContent} />
    </div>
  );
}
