import './help.css';
import HelpHero from './HelpHero';
import HelpTopicsBento from './HelpTopicsBento';
import HelpFaqAccordion from './HelpFaqAccordion';
import HelpContactForm from './HelpContactForm';

export default function HelpPage({ onTopicSelect, onContactSubmitSuccess }) {
  return (
    <div className="help-page-container">
      <HelpHero />
      <HelpTopicsBento onTopicSelect={onTopicSelect} />
      <HelpFaqAccordion />
      <HelpContactForm onSubmitSuccess={onContactSubmitSuccess} />
    </div>
  );
}
