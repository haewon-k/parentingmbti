import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { Products } from './pages/Products';
import { Verify } from './pages/Verify';
import { Dashboard } from './pages/Dashboard';
import { ContentPage } from './pages/ContentPage';
import { Chatbot } from './pages/Chatbot';
import { FAQ } from './pages/FAQ';

import { MBTITest } from './pages/MBTITest';
import { ViewAsSelector } from './components/ViewAsSelector';

import { Compatibility } from './pages/Compatibility';
import { MyPage } from './pages/MyPage';

const App: React.FC = () => {
  const [route, setRoute] = useState(window.location.hash || '#/');

  useEffect(() => {
    const handleHashChange = () => setRoute(window.location.hash || '#/');
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  let Component;
  if (route.startsWith('#/products')) {
    Component = Products;
  } else if (route.startsWith('#/verify')) {
    Component = Verify;
  } else if (route.startsWith('#/dashboard')) {
    Component = Dashboard;
  } else if (route.startsWith('#/content/')) {
    const type = route.split('/')[2];
    Component = () => <ContentPage type={type} />;
  } else if (route.startsWith('#/chatbot')) {
    Component = Chatbot;
  } else if (route.startsWith('#/faq')) {
    Component = FAQ;
  } else if (route.startsWith('#/mbti-test')) {
    Component = MBTITest;
  } else if (route.startsWith('#/compatibility')) {
    Component = Compatibility;
  } else if (route.startsWith('#/mypage')) {
    Component = MyPage;
  } else {
    Component = Home;
  }

  // Hide Navbar for immersive Chatbot experience or just style preference
  const showNavbar = !route.startsWith('#/chatbot');

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 relative">
      {showNavbar && <Navbar />}
      <main>
        <Component />
      </main>
      <ViewAsSelector />
    </div>
  );
};

export default App;