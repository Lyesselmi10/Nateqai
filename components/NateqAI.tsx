import React, { useState, useEffect, useRef } from 'react';
import { Send, Plus, Menu, Settings, User, Moon, Sun, Copy, ThumbsUp, ThumbsDown, Globe, MessageSquare, Zap, LogOut, Edit3 } from 'lucide-react';

const NateqAI = () => {
  // State management
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [language, setLanguage] = useState('ar');
  const [theme, setTheme] = useState('light');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [currentConversationId, setCurrentConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showLandingPage, setShowLandingPage] = useState(true);
  
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Translation object
  const translations = {
    ar: {
      appName: 'ناطق الذكي',
      slogan: 'مساعدك الذكي متعدد اللغات',
      startChat: 'ابدأ المحادثة',
      login: 'تسجيل الدخول',
      register: 'إنشاء حساب',
      continueAsGuest: 'متابعة كزائر',
      email: 'البريد الإلكتروني',
      password: 'كلمة المرور',
      confirmPassword: 'تأكيد كلمة المرور',
      name: 'الاسم',
      loginWithGoogle: 'تسجيل الدخول بجوجل',
      loginWithFacebook: 'تسجيل الدخول بفيسبوك',
      newChat: 'محادثة جديدة',
      upgrade: 'ترقية',
      settings: 'الإعدادات',
      logout: 'تسجيل خروج',
      typeMessage: 'اكتب رسالتك هنا...',
      send: 'إرسال',
      typing: 'يكتب الآن...',
      copy: 'نسخ',
      copied: 'تم النسخ!',
      like: 'إعجاب',
      dislike: 'عدم إعجاب',
      today: 'اليوم',
      yesterday: 'أمس',
      thisWeek: 'هذا الأسبوع',
      older: 'أقدم',
      darkMode: 'الوضع الداكن',
      lightMode: 'الوضع الفاتح',
      language: 'اللغة',
      arabic: 'العربية',
      english: 'English',
      profile: 'الملف الشخصي',
      editProfile: 'تعديل الملف الشخصي',
      privacy: 'سياسة الخصوصية',
      terms: 'شروط الاستخدام',
      support: 'الدعم',
      welcomeMessage: 'مرحباً! كيف يمكنني مساعدتك اليوم؟'
    },
    en: {
      appName: 'NateqAI',
      slogan: 'Your multilingual AI assistant',
      startChat: 'Start Chatting',
      login: 'Sign In',
      register: 'Sign Up',
      continueAsGuest: 'Continue as Guest',
      email: 'Email',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      name: 'Name',
      loginWithGoogle: 'Continue with Google',
      loginWithFacebook: 'Continue with Facebook',
      newChat: 'New Chat',
      upgrade: 'Upgrade',
      settings: 'Settings',
      logout: 'Logout',
      typeMessage: 'Type your message here...',
      send: 'Send',
      typing: 'Typing...',
      copy: 'Copy',
      copied: 'Copied!',
      like: 'Like',
      dislike: 'Dislike',
      today: 'Today',
      yesterday: 'Yesterday',
      thisWeek: 'This Week',
      older: 'Older',
      darkMode: 'Dark Mode',
      lightMode: 'Light Mode',
      language: 'Language',
      arabic: 'العربية',
      english: 'English',
      profile: 'Profile',
      editProfile: 'Edit Profile',
      privacy: 'Privacy Policy',
      terms: 'Terms of Use',
      support: 'Support',
      welcomeMessage: 'Hello! How can I help you today?'
    }
  };

  const t = translations[language];
  const isRTL = language === 'ar';

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Mock authentication functions
  const handleAuth = (type, data) => {
    const mockUser = {
      id: '1',
      name: data?.name || 'Guest User',
      email: data?.email || 'guest@example.com',
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(data?.name || 'Guest')}&background=6366f1&color=fff`
    };
    setCurrentUser(mockUser);
    setIsLoggedIn(true);
    setShowAuthModal(false);
    setShowLandingPage(false);
  };

  const handleGoogleAuth = () => handleAuth('google', { name: 'Google User', email: 'user@gmail.com' });
  const handleFacebookAuth = () => handleAuth('facebook', { name: 'Facebook User', email: 'user@facebook.com' });
  const handleGuestLogin = () => handleAuth('guest');

  const handleLogout = () => {
    setCurrentUser(null);
    setIsLoggedIn(false);
    setShowLandingPage(true);
    setMessages([]);
    setConversations([]);
  };

  // Message handling
  const simulateAIResponse = async (userMessage) => {
    setIsTyping(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const responses = {
      ar: [
        'شكراً لك على رسالتك! أنا مساعد ذكي جاهز لمساعدتك في أي موضوع تريده.',
        'هذا سؤال ممتاز! دعني أفكر في أفضل إجابة لك.',
        'أفهم ما تقصده. يمكنني مساعدتك في هذا الأمر بعدة طرق.',
        'رائع! هذا موضوع شيق ويمكنني تقديم معلومات مفيدة حوله.'
      ],
      en: [
        'Thank you for your message! I\'m an AI assistant ready to help you with any topic you need.',
        'That\'s an excellent question! Let me think about the best answer for you.',
        'I understand what you mean. I can help you with this matter in several ways.',
        'Great! This is an interesting topic and I can provide useful information about it.'
      ]
    };
    
    const randomResponse = responses[language][Math.floor(Math.random() * responses[language].length)];
    
    setIsTyping(false);
    return randomResponse;
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');

    const aiResponse = await simulateAIResponse(inputMessage);
    const aiMessage = {
      id: Date.now() + 1,
      text: aiResponse,
      sender: 'ai',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, aiMessage]);
  };

  const handleNewChat = () => {
    setMessages([]);
    setCurrentConversationId(null);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  // Landing Page Component
  const LandingPage = () => (
    <div className={`min-h-screen flex flex-col ${theme === 'dark' ? 'bg-gray-900' : 'bg-gradient-to-br from-indigo-50 via-white to-purple-50'} ${isRTL ? 'rtl' : 'ltr'} font-['Inter']`}>
      {/* Header */}
      <header className={`p-4 ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white/80 backdrop-blur-sm border-gray-200'} border-b`}>
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg ${theme === 'dark' ? 'bg-green-500' : 'bg-indigo-600'} flex items-center justify-center`}>
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
            <h1 className={`text-2xl font-bold ${theme === 'dark' ? 'text-green-400' : 'text-indigo-600'}`}>
              {t.appName}
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <button
              onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
              className={`p-2 rounded-lg ${theme === 'dark' ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'} transition-colors`}
            >
              <Globe className="w-5 h-5" />
            </button>
            <button
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              className={`p-2 rounded-lg ${theme === 'dark' ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'} transition-colors`}
            >
              {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>
            <button
              onClick={() => setShowAuthModal(true)}
              className={`px-4 py-2 rounded-lg ${theme === 'dark' ? 'bg-green-500 hover:bg-green-600 text-black' : 'bg-indigo-600 hover:bg-indigo-700 text-white'} transition-colors font-medium`}
            >
              {t.login}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className={`w-20 h-20 mx-auto mb-8 rounded-2xl ${theme === 'dark' ? 'bg-green-500' : 'bg-indigo-600'} flex items-center justify-center`}>
            <MessageSquare className="w-10 h-10 text-white" />
          </div>
          
          <h1 className={`text-5xl font-bold mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            {t.appName}
          </h1>
          
          <p className={`text-xl mb-12 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} max-w-2xl mx-auto leading-relaxed`}>
            {t.slogan}
          </p>
          
          <div className="space-y-4">
            <button
              onClick={() => setShowAuthModal(true)}
              className={`w-full max-w-md mx-auto block px-8 py-4 rounded-xl ${theme === 'dark' ? 'bg-green-500 hover:bg-green-600 text-black' : 'bg-indigo-600 hover:bg-indigo-700 text-white'} font-semibold text-lg transition-all duration-200 transform hover:scale-105 shadow-lg`}
            >
              {t.startChat}
            </button>
            
            <button
              onClick={handleGuestLogin}
              className={`block mx-auto px-6 py-2 ${theme === 'dark' ? 'text-green-400 hover:text-green-300' : 'text-indigo-600 hover:text-indigo-700'} font-medium transition-colors`}
            >
              {t.continueAsGuest}
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className={`p-6 ${theme === 'dark' ? 'bg-gray-800 border-gray-700 text-gray-400' : 'bg-white border-gray-200 text-gray-600'} border-t`}>
        <div className="max-w-6xl mx-auto flex justify-center gap-8 text-sm">
          <a href="#" className="hover:text-indigo-600 transition-colors">{t.privacy}</a>
          <a href="#" className="hover:text-indigo-600 transition-colors">{t.terms}</a>
          <a href="#" className="hover:text-indigo-600 transition-colors">{t.support}</a>
        </div>
      </footer>
    </div>
  );

  // Auth Modal Component
  const AuthModal = () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className={`w-full max-w-md ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-6 shadow-2xl`}>
        <h2 className={`text-2xl font-bold mb-6 text-center ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          {authMode === 'login' ? t.login : t.register}
        </h2>
        
        <div className="space-y-4">
          <button
            onClick={handleGoogleAuth}
            className={`w-full p-3 border-2 ${theme === 'dark' ? 'border-gray-600 hover:border-gray-500 text-white' : 'border-gray-300 hover:border-gray-400 text-gray-700'} rounded-lg font-medium transition-colors`}
          >
            {t.loginWithGoogle}
          </button>
          
          <button
            onClick={handleFacebookAuth}
            className={`w-full p-3 border-2 ${theme === 'dark' ? 'border-gray-600 hover:border-gray-500 text-white' : 'border-gray-300 hover:border-gray-400 text-gray-700'} rounded-lg font-medium transition-colors`}
          >
            {t.loginWithFacebook}
          </button>
          
          <div className={`text-center text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>أو</div>
          
          {authMode === 'register' && (
            <input
              type="text"
              placeholder={t.name}
              className={`w-full p-3 border-2 ${theme === 'dark' ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-gray-900'} rounded-lg focus:border-indigo-500 outline-none transition-colors`}
            />
          )}
          
          <input
            type="email"
            placeholder={t.email}
            className={`w-full p-3 border-2 ${theme === 'dark' ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-gray-900'} rounded-lg focus:border-indigo-500 outline-none transition-colors`}
          />
          
          <input
            type="password"
            placeholder={t.password}
            className={`w-full p-3 border-2 ${theme === 'dark' ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-gray-900'} rounded-lg focus:border-indigo-500 outline-none transition-colors`}
          />
          
          {authMode === 'register' && (
            <input
              type="password"
              placeholder={t.confirmPassword}
              className={`w-full p-3 border-2 ${theme === 'dark' ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-gray-900'} rounded-lg focus:border-indigo-500 outline-none transition-colors`}
            />
          )}
          
          <button
            onClick={() => handleAuth('email')}
            className={`w-full p-3 ${theme === 'dark' ? 'bg-green-500 hover:bg-green-600 text-black' : 'bg-indigo-600 hover:bg-indigo-700 text-white'} rounded-lg font-medium transition-colors`}
          >
            {authMode === 'login' ? t.login : t.register}
          </button>
          
          <div className="text-center">
            <button
              onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
              className={`text-sm ${theme === 'dark' ? 'text-green-400 hover:text-green-300' : 'text-indigo-600 hover:text-indigo-700'} transition-colors`}
            >
              {authMode === 'login' ? t.register : t.login}
            </button>
          </div>
        </div>
        
        <button
          onClick={() => setShowAuthModal(false)}
          className={`absolute top-4 ${isRTL ? 'left-4' : 'right-4'} ${theme === 'dark' ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'} text-2xl`}
        >
          ×
        </button>
      </div>
    </div>
  );

  // Main Chat Interface
  const ChatInterface = () => (
    <div className={`flex h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'} ${isRTL ? 'rtl' : 'ltr'} font-['Inter']`}>
      {/* Sidebar */}
      <div className={`${sidebarCollapsed ? 'w-16' : 'w-80'} ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'} border-r transition-all duration-200 flex flex-col`}>
        {/* Sidebar Header */}
        <div className="p-4 border-b border-inherit">
          <div className="flex items-center justify-between">
            {!sidebarCollapsed && (
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg ${theme === 'dark' ? 'bg-green-500' : 'bg-indigo-600'} flex items-center justify-center`}>
                  <MessageSquare className="w-5 h-5 text-white" />
                </div>
                <h1 className={`text-lg font-bold ${theme === 'dark' ? 'text-green-400' : 'text-indigo-600'}`}>
                  {t.appName}
                </h1>
              </div>
            )}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className={`p-2 rounded-lg ${theme === 'dark' ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-200 text-gray-600'} transition-colors`}
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* New Chat Button */}
        <div className="p-4">
          <button
            onClick={handleNewChat}
            className={`w-full p-3 ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-white hover:bg-gray-100 text-gray-900 border border-gray-300'} rounded-lg transition-colors flex items-center gap-3 justify-center`}
          >
            <Plus className="w-5 h-5" />
            {!sidebarCollapsed && <span className="font-medium">{t.newChat}</span>}
          </button>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {!sidebarCollapsed && conversations.length === 0 && (
            <div className={`text-center text-sm ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'} py-8`}>
              لا توجد محادثات محفوظة
            </div>
          )}
        </div>

        {/* Sidebar Footer */}
        <div className={`p-4 border-t border-inherit space-y-2`}>
          {!sidebarCollapsed && (
            <>
              <button className={`w-full p-3 ${theme === 'dark' ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-200 text-gray-600'} rounded-lg transition-colors flex items-center gap-3`}>
                <Zap className="w-5 h-5" />
                {t.upgrade}
              </button>
              <button className={`w-full p-3 ${theme === 'dark' ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-200 text-gray-600'} rounded-lg transition-colors flex items-center gap-3`}>
                <Settings className="w-5 h-5" />
                {t.settings}
              </button>
            </>
          )}
          
          {/* User Profile */}
          {currentUser && (
            <div className={`p-3 ${theme === 'dark' ? 'bg-gray-700' : 'bg-white border border-gray-300'} rounded-lg`}>
              <div className="flex items-center gap-3">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-8 h-8 rounded-full"
                />
                {!sidebarCollapsed && (
                  <div className="flex-1 min-w-0">
                    <div className={`font-medium text-sm ${theme === 'dark' ? 'text-white' : 'text-gray-900'} truncate`}>
                      {currentUser.name}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <button
                        onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
                        className={`text-xs ${theme === 'dark' ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'} transition-colors`}
                      >
                        <Globe className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                        className={`text-xs ${theme === 'dark' ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'} transition-colors`}
                      >
                        {theme === 'light' ? <Moon className="w-3 h-3" /> : <Sun className="w-3 h-3" />}
                      </button>
                      <button
                        onClick={handleLogout}
                        className={`text-xs ${theme === 'dark' ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'} transition-colors`}
                      >
                        <LogOut className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className={`p-4 ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b flex items-center justify-between`}>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full ${theme === 'dark' ? 'bg-green-500' : 'bg-indigo-600'} flex items-center justify-center`}>
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {t.appName}
              </h2>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                مساعد ذكي
              </p>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {messages.length === 0 && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center max-w-md">
                <div className={`w-16 h-16 mx-auto mb-4 rounded-full ${theme === 'dark' ? 'bg-green-500' : 'bg-indigo-600'} flex items-center justify-center`}>
                  <MessageSquare className="w-8 h-8 text-white" />
                </div>
                <h3 className={`text-xl font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {t.welcomeMessage}
                </h3>
                <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  ابدأ محادثة جديدة واسأل عن أي شيء تريده
                </p>
              </div>
            </div>
          )}

          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-4 ${message.sender === 'user' ? (isRTL ? 'flex-row' : 'flex-row-reverse') : (isRTL ? 'flex-row-reverse' : 'flex-row')}`}
            >
              <div className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center ${
                message.sender === 'user' 
                  ? (theme === 'dark' ? 'bg-blue-600' : 'bg-blue-500')
                  : (theme === 'dark' ? 'bg-green-500' : 'bg-indigo-600')
              }`}>
                {message.sender === 'user' ? (
                  <User className="w-6 h-6 text-white" />
                ) : (
                  <MessageSquare className="w-6 h-6 text-white" />
                )}
              </div>
              
              <div className={`flex-1 ${message.sender === 'user' ? (isRTL ? 'text-right' : 'text-left') : (isRTL ? 'text-left' : 'text-right')}`}>
                <div className={`inline-block p-4 rounded-2xl max-w-3xl ${
                  message.sender === 'user'
                    ? (theme === 'dark' ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white')
                    : (theme === 'dark' ? 'bg-gray-700 text-gray-100' : 'bg-gray-100 text-gray-900')
                } ${message.sender === 'user' ? 'rounded-tr-md' : 'rounded-tl-md'}`}>
                  <p className="whitespace-pre-wrap leading-relaxed">{message.text}</p>
                </div>
                
                {message.sender === 'ai' && (
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => copyToClipboard(message.text)}
                      className={`p-1 rounded ${theme === 'dark' ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-200 text-gray-600'} transition-colors`}
                      title={t.copy}
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      className={`p-1 rounded ${theme === 'dark' ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-200 text-gray-600'} transition-colors`}
                      title={t.like}
                    >
                      <ThumbsUp className="w-4 h-4" />
                    </button>
                    <button
                      className={`p-1 rounded ${theme === 'dark' ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-200 text-gray-600'} transition-colors`}
                      title={t.dislike}
                    >
                      <ThumbsDown className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className={`flex gap-4 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center ${theme === 'dark' ? 'bg-green-500' : 'bg-indigo-600'}`}>
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              <div className={`flex-1 ${isRTL ? 'text-left' : 'text-right'}`}>
                <div className={`inline-block p-4 rounded-2xl rounded-tl-md ${theme === 'dark' ? 'bg-gray-700 text-gray-100' : 'bg-gray-100 text-gray-900'}`}>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 ${theme === 'dark' ? 'bg-green-400' : 'bg-indigo-600'} rounded-full animate-pulse`}></div>
                    <div className={`w-2 h-2 ${theme === 'dark' ? 'bg-green-400' : 'bg-indigo-600'} rounded-full animate-pulse`} style={{animationDelay: '0.2s'}}></div>
                    <div className={`w-2 h-2 ${theme === 'dark' ? 'bg-green-400' : 'bg-indigo-600'} rounded-full animate-pulse`} style={{animationDelay: '0.4s'}}></div>
                    <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} ml-2`}>{t.typing}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className={`p-4 ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-t`}>
          <div className="max-w-4xl mx-auto">
            <div className={`flex gap-4 p-4 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'} rounded-2xl`}>
              <input
                ref={inputRef}
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                placeholder={t.typeMessage}
                className={`flex-1 bg-transparent outline-none ${theme === 'dark' ? 'text-white placeholder-gray-400' : 'text-gray-900 placeholder-gray-500'} text-lg`}
                disabled={isTyping}
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isTyping}
                className={`p-3 rounded-xl transition-all duration-200 ${
                  inputMessage.trim() && !isTyping
                    ? (theme === 'dark' ? 'bg-green-500 hover:bg-green-600 text-black' : 'bg-indigo-600 hover:bg-indigo-700 text-white')
                    : (theme === 'dark' ? 'bg-gray-600 text-gray-400' : 'bg-gray-300 text-gray-500')
                } disabled:cursor-not-allowed`}
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Main render
  if (showLandingPage) {
    return (
      <>
        <LandingPage />
        {showAuthModal && <AuthModal />}
      </>
    );
  }

  return <ChatInterface />;
};

export default NateqAI;
                
