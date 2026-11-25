import '../components/LocalComp/Helpcomp/HelpStyles/help.css';
import HelpHero from '../components/LocalComp/Helpcomp/HelpHero';
import HelpTopicsBento from '../components/LocalComp/Helpcomp/HelpTopicsBento';
import HelpFaqAccordion from '../components/LocalComp/Helpcomp/HelpFaqAccordion';
import HelpContactForm from '../components/LocalComp/Helpcomp/HelpContactForm';

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
