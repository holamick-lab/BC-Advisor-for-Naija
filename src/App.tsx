import { useState } from 'react';
import Layout from './components/Layout';
import ChatView from './components/ChatView';
import DailyAwareness from './components/DailyAwareness';
import ResourceLibrary from './components/ResourceLibrary';
import FAQView from './components/FAQView';
import AboutView from './components/AboutView';
import FeedbackView from './components/FeedbackView';
import { Language } from './types';

export default function App() {
  const [activePage, setActivePage] = useState('chat');
  const [language, setLanguage] = useState<Language>('english');

  const renderContent = () => {
    switch (activePage) {
      case 'chat':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2">
              <ChatView language={language} />
            </div>
            <div className="hidden lg:block">
              <DailyAwareness />
            </div>
          </div>
        );
      case 'awareness':
        return <DailyAwareness />;
      case 'resources':
        return <ResourceLibrary />;
      case 'faq':
        return <FAQView language={language} />;
      case 'about':
        return <AboutView />;
      case 'feedback':
        return <FeedbackView />;
      default:
        return <ChatView language={language} />;
    }
  };

  return (
    <Layout 
      activePage={activePage} 
      setActivePage={setActivePage} 
      language={language}
      setLanguage={setLanguage}
    >
      {renderContent()}
    </Layout>
  );
}

