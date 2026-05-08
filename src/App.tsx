import React, { useState, useEffect, useRef } from 'react';
import { 
  Trophy, 
  ChevronRight, 
  Menu, 
  X, 
  BarChart3, 
  Zap, 
  CheckCircle2, 
  Star, 
  Mail, 
  Clock, 
  ShieldCheck, 
  ArrowRight,
  TrendingUp,
  MessageSquare,
  Instagram,
  Youtube,
  Twitter,
  ChevronDown,
  Lock
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getDailyPredictions, type MatchPrediction } from './services/geminiService';
import { cn } from './lib/utils';

// --- Constants ---
const APP_NAME = "WoganPredicts";
const ACCENT_COLOR = "#00FF87"; // Electric Green
const BG_COLOR = "#0A0E1A"; // Deep Navy

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState('Home');
  const [predictions, setPredictions] = useState<MatchPrediction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [timeLeft, setTimeLeft] = useState({ hours: 23, minutes: 59, seconds: 59 });
  const [showExitModal, setShowExitModal] = useState(false);
  const [notifications, setNotifications] = useState<string[]>([]);
  const [currentNotification, setCurrentNotification] = useState<number | null>(null);

  // --- Daily Refresh Logic ---
  useEffect(() => {
    async function loadData() {
      const today = new Date().toDateString();
      const cached = localStorage.getItem('daily_predictions');
      const cachedDate = localStorage.getItem('prediction_date');

      if (cached && cachedDate === today) {
        try {
          setPredictions(JSON.parse(cached));
          setIsLoading(false);
          return;
        } catch (e) {
          console.error("Failed to parse cached predictions", e);
          localStorage.removeItem('daily_predictions');
        }
      } 
      
      const data = await getDailyPredictions();
      if (data && data.length > 0) {
        setPredictions(data);
        localStorage.setItem('daily_predictions', JSON.stringify(data));
        localStorage.setItem('prediction_date', today);
      }
      setIsLoading(false);
    }
    loadData();
  }, []);

  // --- Countdown Timer ---
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 23, minutes: 59, seconds: 59 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // --- Social Proof cycle ---
  useEffect(() => {
    const users = [
      "Ahmed from Dubai just joined Pro Plan",
      "Marcus from London unlocked VIP tips",
      "Elena from Madrid just won €1,200 using our Elite pick",
      "Satoshi from Tokyo joined the Annual Pro Plan"
    ];
    setNotifications(users);
    
    let index = 0;
    const interval = setInterval(() => {
      setCurrentNotification(index);
      setTimeout(() => setCurrentNotification(null), 4000);
      index = (index + 1) % users.length;
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  // --- Exit Intent ---
  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY < 0) setShowExitModal(true);
    };
    document.addEventListener('mouseleave', handleMouseLeave);
    return () => document.removeEventListener('mouseleave', handleMouseLeave);
  }, []);

  const navLinks = ['Home', 'Predictions', 'Stats', 'Pricing', 'Blog', 'Contact'];

  return (
    <div className="bg-[#0A0E1A] text-white font-['Inter'] selection:bg-[#00FF87] selection:text-black min-h-screen">
      {/* 1. NAVIGATION BAR */}
      <nav className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4",
        "bg-[#0A0E1A]/90 backdrop-blur-md border-b border-white/5"
      )}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setCurrentPage('Home')}>
            <Trophy className="text-[#00FF87] w-10 h-10 drop-shadow-[0_0_10px_rgba(0,255,135,0.5)]" />
            <span className="text-4xl font-black font-display tracking-tighter text-white drop-shadow-sm">{APP_NAME}</span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map(link => (
              <button 
                key={link} 
                className={cn(
                  "text-sm font-bold uppercase tracking-wider transition-colors hover:text-[#00FF87]",
                  currentPage === link ? "text-[#00FF87]" : "text-gray-400"
                )}
                onClick={() => setCurrentPage(link)}
              >
                {link}
              </button>
            ))}
            <button 
              onClick={() => setCurrentPage('Predictions')}
              className="bg-[#00FF87] text-black px-6 py-2.5 rounded-full font-bold text-sm transition-transform hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(0,255,135,0.3)]"
            >
              Get Free Picks →
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Nav */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-[#0A0E1A] border-t border-white/10 mt-4 overflow-hidden"
            >
              <div className="py-4 flex flex-col gap-4">
                {navLinks.map(link => (
                  <button 
                    key={link} 
                    className={cn(
                      "text-xl font-display text-left px-4 py-2",
                      currentPage === link ? "text-[#00FF87]" : "text-white"
                    )}
                    onClick={() => {
                      setCurrentPage(link);
                      setIsMenuOpen(false);
                    }}
                  >
                    {link}
                  </button>
                ))}
                <button 
                  onClick={() => {
                    setCurrentPage('Predictions');
                    setIsMenuOpen(false);
                  }}
                  className="bg-[#00FF87] text-black w-full py-3 rounded-lg font-bold"
                >
                  Get Free Picks →
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <main className="min-h-[calc(100vh-80px)]">
        {currentPage === 'Home' && <HomePage predictions={predictions} isLoading={isLoading} timeLeft={timeLeft} onNavigate={setCurrentPage} />}
        {currentPage === 'Predictions' && <PredictionsPage predictions={predictions} isLoading={isLoading} timeLeft={timeLeft} />}
        {currentPage === 'Stats' && <StatsPage />}
        {currentPage === 'Pricing' && <PricingPage billingCycle={billingCycle} setBillingCycle={setBillingCycle} />}
        {currentPage === 'Blog' && <BlogPage />}
        {currentPage === 'Contact' && <ContactPage />}
      </main>
      {/* 7. TESTIMONIALS */}
      <section className="py-24 px-6 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-['Bebas_Neue'] mb-4">What Our <span className="text-[#00FF87]">Members</span> Say</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: "Suresh P.", date: "Feb 2024", text: "Truly the best service I've used. The analysis is deep and the VIP picks have helped me double my bankroll in 3 months." },
              { name: "James T.", date: "Dec 2023", text: "I like that it's consistent. No hype, just data. The Telegram alerts for the Elite plan are lightning fast." },
              { name: "Marco L.", date: "Jan 2025", text: "Customer support is top-notch. I had issues with my referral and they fixed it in 10 minutes. Also the win rate is insane." }
            ].map((t, i) => (
              <div key={i} className="bg-[#151B2B] p-8 rounded-3xl border border-white/5 relative">
                <div className="flex gap-1 mb-6">
                  {[1,2,3,4,5].map(s => <Star key={s} className="w-4 h-4 fill-[#00FF87] text-[#00FF87]" />)}
                </div>
                <p className="text-gray-300 mb-8 italic leading-relaxed">"{t.text}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center font-bold text-[#00FF87]">{t.name[0]}</div>
                  <div>
                    <div className="font-bold">{t.name}</div>
                    <div className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Member since {t.date}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. PRICING */}
      <section id="pricing" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-['Bebas_Neue'] mb-6">Choose Your <span className="text-[#00FF87]">Plan</span></h2>
            
            {/* Toggle System */}
            <div className="flex items-center justify-center gap-4">
              <span className={cn("text-sm font-bold", billingCycle === 'monthly' ? "text-white" : "text-gray-500")}>Monthly</span>
              <button 
                onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'annual' : 'monthly')}
                className="w-14 h-8 bg-white/10 rounded-full p-1 transition-colors hover:bg-white/20"
              >
                <div className={cn(
                  "w-6 h-6 bg-[#00FF87] rounded-full transition-transform duration-300",
                  billingCycle === 'annual' ? "translate-x-6" : "translate-x-0"
                )} />
              </button>
              <div className="flex items-center gap-2">
                <span className={cn("text-sm font-bold", billingCycle === 'annual' ? "text-white" : "text-gray-500")}>Annual</span>
                <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-black px-2 py-0.5 rounded uppercase">Save 20%</span>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Free Plan */}
            <div className="bg-[#151B2B] p-8 rounded-[40px] border border-white/5 flex flex-col">
              <h3 className="text-2xl font-bold mb-2">Free</h3>
              <p className="text-gray-500 text-sm mb-8">Basic insights for casual bettors.</p>
              <div className="text-4xl font-black mb-8">€0<span className="text-sm font-normal text-gray-500"> /mo</span></div>
              <ul className="space-y-4 mb-10 flex-1">
                 <li className="flex items-center gap-3 text-sm text-gray-400"><CheckCircle2 className="w-5 h-5 text-[#00FF87]" /> 2-3 Free Tips / Day</li>
                 <li className="flex items-center gap-3 text-sm text-gray-400"><CheckCircle2 className="w-5 h-5 text-[#00FF87]" /> Basic Match Stats</li>
                 <li className="flex items-center gap-3 text-sm text-gray-400"><CheckCircle2 className="w-5 h-5 text-[#00FF87]" /> Email Newsletter</li>
                 <li className="flex items-center gap-3 text-sm text-gray-600"><X className="w-5 h-5" /> VIP Predictions</li>
              </ul>
              <button className="w-full py-4 border border-white/10 rounded-2xl font-bold hover:bg-white/5 transition-colors">
                Get Started
              </button>
            </div>

            {/* Pro Plan */}
            <div className="bg-[#151B2B] p-8 rounded-[40px] border-2 border-[#00FF87] relative shadow-[0_0_40px_rgba(0,255,135,0.1)] flex flex-col scale-105 z-10">
              <div className="absolute top-0 right-10 -translate-y-1/2 bg-[#00FF87] text-black px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                Most Popular
              </div>
              <h3 className="text-2xl font-bold mb-2">Pro</h3>
              <p className="text-gray-500 text-sm mb-8">Serious data for consistent growth.</p>
              <div className="text-4xl font-black mb-8">
                {billingCycle === 'monthly' ? '€19' : '€15'}<span className="text-sm font-normal text-gray-500"> /mo</span>
              </div>
              <ul className="space-y-4 mb-10 flex-1">
                 <li className="flex items-center gap-3 text-sm"><CheckCircle2 className="w-5 h-5 text-[#00FF87]" /> All Daily Tips (10+)</li>
                 <li className="flex items-center gap-3 text-sm"><CheckCircle2 className="w-5 h-5 text-[#00FF87]" /> Confidence Ratings</li>
                 <li className="flex items-center gap-3 text-sm"><CheckCircle2 className="w-5 h-5 text-[#00FF87]" /> Stats Dashboard Access</li>
                 <li className="flex items-center gap-3 text-sm"><CheckCircle2 className="w-5 h-5 text-[#00FF87]" /> Telegram Community</li>
              </ul>
              <a 
                href="https://www.paypal.com/cgi-bin/webscr?cmd=_xclick&business=datas2342@gmail.com&item_name=Pro%20Membership&amount=19&currency_code=EUR"
                target="_blank"
                className="w-full py-4 bg-[#00FF87] text-black rounded-2xl font-bold flex items-center justify-center gap-2 hover:shadow-[0_0_30px_rgba(0,255,135,0.5)] transition-all"
              >
                Join Now <ArrowRight className="w-4 h-4" />
              </a>
            </div>

            {/* Elite Plan */}
            <div className="bg-[#151B2B] p-8 rounded-[40px] border border-white/5 flex flex-col">
              <h3 className="text-3xl font-['Bebas_Neue'] tracking-wide mb-2">Elite</h3>
              <p className="text-gray-500 text-sm mb-8">High-stake signals & coaching.</p>
              <div className="text-4xl font-black mb-8">
                {billingCycle === 'monthly' ? '€49' : '€39'}<span className="text-sm font-normal text-gray-500"> /mo</span>
              </div>
              <ul className="space-y-4 mb-10 flex-1">
                 <li className="flex items-center gap-3 text-sm text-gray-400"><CheckCircle2 className="w-5 h-5 text-[#00FF87]" /> Everything in PRO</li>
                 <li className="flex items-center gap-3 text-sm text-gray-400"><CheckCircle2 className="w-5 h-5 text-[#00FF87]" /> WhatsApp Direct Alerts</li>
                 <li className="flex items-center gap-3 text-sm text-gray-400"><CheckCircle2 className="w-5 h-5 text-[#00FF87]" /> Personal Betting Advisor</li>
                 <li className="flex items-center gap-3 text-sm text-gray-400"><CheckCircle2 className="w-5 h-5 text-[#00FF87]" /> High-Stake VIP Tips</li>
              </ul>
              <a 
                href="https://www.paypal.com/cgi-bin/webscr?cmd=_xclick&business=datas2342@gmail.com&item_name=Elite%20Membership&amount=49&currency_code=EUR"
                target="_blank"
                className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl font-bold hover:bg-white/10 transition-colors flex items-center justify-center"
              >
                Become Elite
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 9. FAQ Section */}
      <section className="py-24 px-6 bg-white/[0.01]">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl font-['Bebas_Neue'] mb-12 text-center">Frequently Asked <span className="text-[#00FF87]">Questions</span></h2>
          <div className="space-y-4">
             {[
               { q: "How accurate are your predictions?", a: "Historically, our data-backed algorithms maintain a success rate between 72% and 89%, depending on the league and season timing." },
               { q: "How do I receive my tips?", a: "Tips are posted directly to your member dashboard. Pro and Elite members also receive instant alerts via Telegram and WhatsApp." },
               { q: "Can I cancel my subscription anytime?", a: "Yes, we handle all billing via PayPal. You can cancel by contacting us or via your PayPal dashboard." },
               { q: "Do you guarantee winnings?", a: "No. While our record is stellar, sports are unpredictable. We provide mathematical edges, but responsible bankroll management is key." },
               { q: "How many tips per day?", a: "Free users receive 6 fixtures. Pro members typically get 12+ analyzed matches, and Elite members get exclusive high-confidence 'locks'." }
             ].map((faq, i) => (
                <FaqItem key={i} question={faq.q} answer={faq.a} />
             ))}
          </div>
        </div>
      </section>

      {/* 10. EMAIL CAPTURE */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto bg-gradient-to-br from-[#00FF87] to-emerald-600 rounded-[48px] p-12 text-black text-center relative overflow-hidden">
           {/* Decorative circles */}
           <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2" />
           <div className="absolute bottom-0 right-0 w-48 h-48 bg-black/5 rounded-full translate-x-1/3 translate-y-1/3" />

           <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
             <h2 className="text-5xl font-['Bebas_Neue'] mb-4">Get Tomorrow's Top Pick — Free</h2>
             <p className="font-bold mb-10 max-w-sm mx-auto">Join 3,200+ members getting our #1 daily tip straight to their inbox.</p>
             
              <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto bg-black/10 p-2 rounded-2xl backdrop-blur-sm">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="flex-1 bg-transparent border-none focus:ring-0 placeholder:text-black/40 font-bold px-4"
                />
                <a href="mailto:komwogan@gmail.com" className="bg-black text-[#00FF87] px-8 py-4 rounded-xl font-bold hover:scale-105 active:scale-95 transition-transform flex items-center justify-center">
                   Send Me Your Email
                </a>
             </div>
             <p className="mt-4 text-[10px] uppercase font-black tracking-widest opacity-60">No spam. Unsubscribe anytime.</p>
           </motion.div>
        </div>
      </section>

      {/* 11. FOOTER */}
      <footer className="py-20 px-6 border-t border-white/5 bg-[#070B14]">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12 mb-20">
          <div className="col-span-2">
          <div className="flex items-center gap-2 mb-6 cursor-pointer" onClick={() => setCurrentPage('Home')}>
            <Trophy className="text-[#00FF87] w-8 h-8" />
            <span className="text-2xl font-display tracking-wider hover:text-[#00FF87] transition-colors">{APP_NAME}</span>
          </div>
            <p className="text-gray-500 max-w-sm leading-relaxed mb-8">
              The smartest football predictions platform. Every Match. Every Day. Using Wogan's expertise to beat the bookies.
            </p>
            <div className="flex gap-4">
              <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center hover:bg-[#00FF87] hover:text-black transition-all cursor-pointer"><Twitter className="w-5 h-5" /></div>
              <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center hover:bg-[#00FF87] hover:text-black transition-all cursor-pointer"><Instagram className="w-5 h-5" /></div>
              <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center hover:bg-[#00FF87] hover:text-black transition-all cursor-pointer"><Youtube className="w-5 h-5" /></div>
              <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center hover:bg-[#00FF87] hover:text-black transition-all cursor-pointer text-[#00FF87]"><MessageSquare className="w-5 h-5" /></div>
            </div>
          </div>
          <div>
            <h4 className="font-bold mb-6 text-[#00FF87]">Quick Links</h4>
            <ul className="space-y-4 text-sm text-gray-500">
              <li><button onClick={() => setCurrentPage('Home')} className="hover:text-white transition-colors">Home</button></li>
              <li><button onClick={() => setCurrentPage('Predictions')} className="hover:text-white transition-colors">Predictions</button></li>
              <li><button onClick={() => setCurrentPage('Stats')} className="hover:text-white transition-colors">Stats</button></li>
              <li><button onClick={() => setCurrentPage('Pricing')} className="hover:text-white transition-colors">Pricing</button></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-6 text-[#00FF87]">Contact</h4>
            <ul className="space-y-4 text-sm text-gray-500">
              <li className="flex items-center gap-2"><Mail className="w-4 h-4" /> komwogan@gmail.com</li>
              <li className="flex items-center gap-2"><MessageSquare className="w-4 h-4" /> Live Chat 24/7</li>
            </ul>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between gap-8 items-center text-xs text-gray-500">
           <p>© 2026 {APP_NAME}. All rights reserved.</p>
           <p className="text-center italic">18+. Gamble Responsibly. BeGambleAware.org</p>
        </div>
      </footer>

      {/* CONVERSION OVERLAYS */}

      {/* Social Proof Notification */}
      <AnimatePresence>
        {currentNotification !== null && (
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed bottom-6 left-6 z-[60] bg-white text-black p-4 rounded-xl shadow-2xl flex items-center gap-3 pr-8"
          >
            <div className="w-8 h-8 bg-[#00FF87] rounded-full flex items-center justify-center font-bold">W</div>
            <div>
              <div className="text-xs font-bold leading-tight">{notifications[currentNotification]}</div>
              <div className="text-[10px] text-gray-400">Just now</div>
            </div>
            <button className="absolute top-2 right-2 text-gray-300" onClick={() => setCurrentNotification(null)}><X size={12} /></button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Sticky CTA */}
      <div className="md:hidden fixed bottom-4 left-4 right-4 z-[55]">
         <button className="w-full bg-[#00FF87] text-black py-4 rounded-2xl font-bold shadow-2xl flex items-center justify-center gap-2 active:scale-95 transition-transform">
            See Today's Picks →
         </button>
      </div>

      {/* Exit Intent Modal */}
      <AnimatePresence>
        {showExitModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-6">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm" 
              onClick={() => setShowExitModal(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-[#151B2B] border border-white/10 p-10 rounded-[40px] max-w-lg w-full relative z-[101] text-center"
            >
              <button 
                onClick={() => setShowExitModal(false)}
                className="absolute top-6 right-6 text-gray-500 hover:text-white"
              >
                <X />
              </button>
              <div className="w-24 h-24 bg-[#00FF87]/10 rounded-full flex items-center justify-center text-[#00FF87] mx-auto mb-8">
                 <Zap size={48} />
              </div>
              <h2 className="text-4xl font-display mb-4">Wait! Don't Leave Without Your <span className="text-[#00FF87]">Free Gift</span></h2>
              <p className="text-gray-400 mb-8 max-w-sm mx-auto leading-relaxed">
                Download Wogan's "Secret Strategy Guide: How I turned €100 into €2,500 in 30 days" for FREE.
              </p>
              <div className="bg-white/5 p-2 rounded-2xl flex gap-2 mb-6">
                <input type="email" placeholder="email@example.com" className="bg-transparent border-none flex-1 px-4 text-sm focus:ring-0" />
                <button className="bg-[#00FF87] text-black px-6 py-3 rounded-xl font-bold text-sm">Get It Now</button>
              </div>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Limited time offer for new visitors</p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// --- Sub-components ---

function FaqItem({ question, answer }: { question: string, answer: string }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border border-white/5 bg-[#151B2B] rounded-2xl overflow-hidden text-left">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-6"
      >
        <span className="font-bold text-sm md:text-base pr-4">{question}</span>
        <ChevronDown className={cn("w-5 h-5 text-gray-500 transition-transform", isOpen && "rotate-180")} />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 text-sm text-gray-400 leading-relaxed border-t border-white/5 pt-4">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function HomePage({ predictions, isLoading, timeLeft, onNavigate }: { predictions: MatchPrediction[], isLoading: boolean, timeLeft: any, onNavigate: (page: string) => void }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      {/* HERO */}
      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#00FF87]/10 blur-[120px] rounded-full -mr-64 -mt-64" />
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center relative z-10">
          <div>
            <h1 className="text-6xl md:text-8xl font-display leading-[0.9] mb-6 drop-shadow-lg">
              Win More.<br />
              <span className="text-[#00FF87]">Predict Smarter.</span>
            </h1>
            <p className="text-xl text-gray-400 mb-10 max-w-lg leading-relaxed">
              Expert football predictions backed by data, Wogan's specialized algorithms, and 10+ years of match analysis.
            </p>
            <div className="flex flex-wrap gap-4">
              <button 
                onClick={() => onNavigate('Predictions')}
                className="bg-[#00FF87] text-black h-14 px-8 rounded-xl font-bold flex items-center gap-2 group transition-all hover:shadow-[0_0_30px_rgba(0,255,135,0.5)]"
              >
                See Today's Predictions <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button 
                onClick={() => onNavigate('Stats')}
                className="bg-white/5 border border-white/10 h-14 px-8 rounded-xl font-bold hover:bg-white/10 transition-colors"
              >
                View Our Record
              </button>
            </div>
          </div>

          <div className="relative">
            <div className="bg-[#151B2B] border border-white/10 p-8 rounded-[32px] shadow-2xl relative z-10">
              <div className="flex justify-between items-start mb-8 text-white">
                <div>
                  <span className="bg-[#00FF87]/20 text-[#00FF87] px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider mb-2 inline-block">Match of the Day</span>
                  <h3 className="text-2xl font-bold">Bundesliga</h3>
                </div>
                <TrendingUp className="text-[#00FF87] w-6 h-6" />
              </div>
              <div className="flex items-center justify-between gap-4 mb-8">
                <div className="text-center flex-1">
                  <div className="w-16 h-16 bg-[#FDE100] text-black rounded-full mx-auto mb-3 flex items-center justify-center font-bold text-2xl shadow-lg border-2 border-black">BVB</div>
                  <div className="font-bold">Dortmund</div>
                </div>
                <div className="text-2xl font-display text-gray-600">VS</div>
                <div className="text-center flex-1">
                  <div className="w-16 h-16 bg-red-600 rounded-full mx-auto mb-3 flex items-center justify-center font-bold text-2xl shadow-lg border-2 border-white/20">SGE</div>
                  <div className="font-bold">Frankfurt</div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between text-sm py-3 border-b border-white/5">
                  <span className="text-gray-400">Wogan's Recommendation</span>
                  <span className="font-bold text-[#00FF87]">Home Win (1)</span>
                </div>
                <div className="flex justify-between text-sm py-3">
                  <span className="text-gray-400">Wogan's Confidence</span>
                  <span className="font-bold text-[#00FF87]">94%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TICKER */}
      <div className="bg-[#00FF87] py-3 overflow-hidden whitespace-nowrap border-y border-black/10">
        <motion.div 
          animate={{ x: [0, -1000] }}
          transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
          className="flex gap-20 items-center text-black font-black uppercase text-sm tracking-tighter"
        >
          {[1,2,3,4].map(i => (
            <React.Fragment key={i}>
              <span>Win Rate: 72%</span>
              <span>This Month: 48W - 18L</span>
              <span>Streak: 7W</span>
              <span>Total ROI: +31%</span>
            </React.Fragment>
          ))}
        </motion.div>
      </div>

      {/* PREVIEW OF PICKS */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-display mb-12 text-center">Featured <span className="text-[#00FF87]">Predictions</span></h2>
          <div className="grid md:grid-cols-3 gap-6">
             {predictions.slice(0, 3).map((p, i) => (
                <div key={i} className="bg-[#151B2B] p-6 rounded-3xl border border-white/5">
                   <div className="flex justify-between mb-4">
                      <span className="text-xs uppercase font-bold text-gray-500">{p.league}</span>
                      <span className="text-[10px] font-black bg-white/10 px-2 py-0.5 rounded uppercase">Free</span>
                   </div>
                   <h4 className="font-bold text-lg mb-4">{p.match}</h4>
                   <div className="bg-black/20 p-4 rounded-xl flex justify-between items-center">
                      <span className="text-sm font-bold text-[#00FF87]">{p.tip}</span>
                      <span className="text-sm font-bold">{p.odds}</span>
                   </div>
                </div>
             ))}
          </div>
          <div className="mt-12 text-center">
             <button onClick={() => onNavigate('Predictions')} className="text-[#00FF87] font-bold underline underline-offset-8">
                View All {predictions.length} Daily Predictions →
             </button>
          </div>
        </div>
      </section>

      {/* HOW WOGAN WORKS */}
      <section className="py-24 px-6 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display mb-4">How <span className="text-[#00FF87]">Wogan</span> Picks Winners</h2>
            <p className="text-gray-400 max-w-lg mx-auto leading-relaxed">Wogan combines deep statistical analysis with years of football expertise to find the edge.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              { icon: BarChart3, title: "Data Analysis", desc: "Wogan analyses 50+ stats per match including team form, head-to-head records, and player injuries." },
              { icon: Zap, title: "Specialized Methods", desc: "Wogan's proprietary models process thousands of data points to find value bets that bookies often miss." },
              { icon: CheckCircle2, title: "Expert Review", desc: "Every pick is manually reviewed by Wogan to ensure qualitative factors like team morale are considered." }
            ].map((step, i) => (
              <div key={i} className="text-center flex flex-col items-center">
                <div className="w-20 h-20 bg-[#00FF87]/10 rounded-3xl flex items-center justify-center text-[#00FF87] mb-8 border border-[#00FF87]/20">
                   <step.icon className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold mb-4">{step.title}</h3>
                <p className="text-gray-400 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </motion.div>
  );
}

function PredictionsPage({ predictions, isLoading, timeLeft }: { predictions: MatchPrediction[], isLoading: boolean, timeLeft: any }) {
  const freeMatches = predictions.filter(p => !p.isVip).slice(0, 6);
  const vipMatches = predictions.filter(p => p.isVip).slice(0, 6);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="pt-32 pb-24 px-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
        <div>
           <h1 className="text-6xl font-display mb-4">Daily <span className="text-[#00FF87]">Predictions</span></h1>
           <p className="text-gray-400">12 High-confidence matches analyzed by Wogan daily.</p>
        </div>
        <div className="bg-[#151B2B] p-4 rounded-2xl flex items-center gap-4 border border-white/5">
           <Clock className="w-10 h-10 text-[#00FF87]" />
           <div>
              <div className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Next Wogan Refresh</div>
              <div className="text-2xl font-mono font-bold">{timeLeft.hours}:{timeLeft.minutes}:{timeLeft.seconds}</div>
           </div>
        </div>
      </div>

      <div className="space-y-16">
        <div>
          <h2 className="text-3xl font-display mb-8 flex items-center gap-4">
             <span className="text-white">Free Daily Picks</span>
             <div className="h-1 flex-1 bg-white/5 rounded-full" />
             <span className="text-sm font-bold text-gray-500">6 MATCHES</span>
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
             {freeMatches.map((p, idx) => (
                <PredictionCard key={idx} prediction={p} />
             ))}
          </div>
        </div>

        <div>
           <h2 className="text-3xl font-display mb-8 flex items-center gap-4">
             <span className="text-[#00FF87]">Elite VIP Picks</span>
             <div className="h-1 flex-1 bg-[#00FF87]/10 rounded-full" />
             <span className="text-sm font-bold text-[#00FF87]">6 MATCHES</span>
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
             {vipMatches.map((p, idx) => (
                <PredictionCard key={idx} prediction={p} isVipLocked />
             ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function PredictionCard({ prediction, isVipLocked }: { prediction: MatchPrediction, isVipLocked?: boolean }) {
   const renderStars = () => {
      const starCount = Math.round(prediction.confidence / 20);
      return (
         <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
               <Star 
                  key={i} 
                  size={10} 
                  className={cn(
                     i < starCount ? "text-[#00FF87] fill-[#00FF87]" : "text-gray-700"
                  )} 
               />
            ))}
         </div>
      );
   };

   return (
      <div className="bg-[#151B2B] rounded-3xl p-6 border border-white/5 relative group overflow-hidden">
         <div className="flex justify-between items-start mb-6">
            <span className="text-[10px] uppercase font-black text-gray-500 tracking-widest">{prediction.league}</span>
            <span className={cn(
               "text-[10px] font-black px-2 py-0.5 rounded",
               prediction.isVip ? "bg-[#00FF87] text-black" : "bg-white/10 text-white"
            )}>
               {prediction.isVip ? "VIP" : "FREE"}
            </span>
         </div>
         <h3 className="text-xl font-bold mb-4">{prediction.match}</h3>
         <div className="grid grid-cols-2 gap-4">
            <div className="bg-black/20 p-3 rounded-xl">
               <div className="text-[10px] text-gray-500 uppercase font-bold mb-1">Tip</div>
               <div className="font-bold text-[#00FF87]">{prediction.tip}</div>
            </div>
            <div className="bg-black/20 p-3 rounded-xl">
               <div className="text-[10px] text-gray-500 uppercase font-bold mb-1">Odds</div>
               <div className="font-bold">{prediction.odds}</div>
            </div>
         </div>
         
         <div className="mt-6">
            <div className="flex justify-between items-center mb-2">
               <div className="flex flex-col">
                  <span className="text-[10px] uppercase font-bold text-gray-500">Wogan's Confidence</span>
                  {renderStars()}
               </div>
               <span className="text-[#00FF87] font-mono text-sm">{prediction.confidence}%</span>
            </div>
            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden mb-4">
               <div className="h-full bg-[#00FF87]" style={{ width: `${prediction.confidence}%` }} />
            </div>
            
            <div className="bg-[#00FF87]/5 border border-[#00FF87]/10 p-3 rounded-xl">
               <div className="text-[10px] text-[#00FF87] uppercase font-black mb-1 flex items-center gap-1">
                  <Zap size={10} /> Wogan's Reasoning
               </div>
               <p className="text-[11px] text-gray-400 italic line-clamp-3 leading-relaxed">
                  {prediction.analysis}
               </p>
            </div>
         </div>

         {isVipLocked && (
            <div className="absolute inset-0 bg-[#0A0E1A]/90 backdrop-blur-md flex flex-col items-center justify-center p-8 text-center">
               <Lock className="w-12 h-12 text-[#00FF87] mb-4" />
               <h4 className="font-bold mb-2">VIP Access Only</h4>
               <p className="text-xs text-gray-400 mb-6">Upgrade to unlock Wogan's detailed analysis and prediction.</p>
               <a 
                 href="https://www.paypal.com/cgi-bin/webscr?cmd=_xclick&business=datas2342@gmail.com&item_name=Pro%20Upgrade&amount=19&currency_code=EUR"
                 target="_blank"
                 className="bg-[#00FF87] text-black w-full py-3 rounded-xl font-bold text-sm"
               >
                 Upgrade Now
               </a>
            </div>
         )}
      </div>
   );
}

function ContactPage() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-32 pb-24 px-6 max-w-4xl mx-auto">
      <div className="bg-[#151B2B] rounded-[48px] p-12 border border-white/5">
        <h1 className="text-5xl font-display mb-8">Contact <span className="text-[#00FF87]">Us</span></h1>
        
        <div className="grid md:grid-cols-2 gap-12 mb-12">
          <div>
            <h3 className="text-xl font-bold mb-4 text-[#00FF87]">Get In Touch</h3>
            <p className="text-gray-400 mb-8 leading-relaxed">
              Have questions about our plans or need personal betting advice? Reach out to the owner directly.
            </p>
            <div className="space-y-6">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#00FF87]/10 rounded-2xl flex items-center justify-center text-[#00FF87]">
                     <Star size={24} />
                  </div>
                  <div>
                     <div className="text-xs text-gray-500 font-bold uppercase tracking-widest">Owner</div>
                     <div className="font-bold text-lg">Komurubuga wogan</div>
                  </div>
               </div>
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#00FF87]/10 rounded-2xl flex items-center justify-center text-[#00FF87]">
                     <Mail size={24} />
                  </div>
                  <div>
                     <div className="text-xs text-gray-500 font-bold uppercase tracking-widest">Email Contact</div>
                     <div className="font-bold text-lg">komwogan@gmail.com</div>
                  </div>
               </div>
            </div>
          </div>

          <form className="space-y-4">
             <input type="text" placeholder="Your Name" className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 focus:ring-1 focus:ring-[#00FF87] outline-none" />
             <input type="email" placeholder="Your Email" className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 focus:ring-1 focus:ring-[#00FF87] outline-none" />
             <textarea rows={4} placeholder="Your Message" className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 focus:ring-1 focus:ring-[#00FF87] outline-none resize-none"></textarea>
             <button className="w-full bg-[#00FF87] text-black py-4 rounded-xl font-bold hover:shadow-[0_0_20px_rgba(0,255,135,0.3)] transition-all">
                Send Message
             </button>
          </form>
        </div>
      </div>
    </motion.div>
  );
}

function PricingPage({ billingCycle, setBillingCycle }: { billingCycle: 'monthly' | 'annual', setBillingCycle: (val: 'monthly' | 'annual') => void }) {
  const plans = [
    { name: "Free", price: "0", email: "komwogan@gmail.com" },
    { name: "Pro", price: billingCycle === 'monthly' ? "19" : "15", email: "datas2342@gmail.com" },
    { name: "Elite", price: billingCycle === 'monthly' ? "49" : "39", email: "datas2342@gmail.com" }
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-32 pb-24 px-6 max-w-7xl mx-auto">
       <div className="text-center mb-16">
          <h1 className="text-6xl font-display mb-6">Membership <span className="text-[#00FF87]">Plans</span></h1>
          <div className="flex items-center justify-center gap-4">
              <span className={cn("text-sm font-bold", billingCycle === 'monthly' ? "text-white" : "text-gray-500")}>Monthly</span>
              <button 
                onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'annual' : 'monthly')}
                className="w-14 h-8 bg-white/10 rounded-full p-1"
              >
                <div className={cn(
                  "w-6 h-6 bg-[#00FF87] rounded-full transition-transform",
                  billingCycle === 'annual' ? "translate-x-6" : "translate-x-0"
                )} />
              </button>
              <span className={cn("text-sm font-bold", billingCycle === 'annual' ? "text-white" : "text-gray-500")}>Annual (-20%)</span>
          </div>
       </div>

       <div className="grid md:grid-cols-3 gap-8">
          {plans.map((p, i) => (
             <div key={i} className="bg-[#151B2B] p-10 rounded-[48px] border border-white/5 flex flex-col items-center text-center">
                <h3 className="text-2xl font-bold mb-4">{p.name}</h3>
                <div className="text-5xl font-black mb-8">€{p.price}<span className="text-sm font-normal text-gray-500">/{billingCycle === 'monthly' ? 'mo' : 'yr'}</span></div>
                <ul className="space-y-4 mb-12 flex-1 text-gray-400 text-sm">
                   <li>Daily Match Predictions</li>
                   <li>Wogan's Confidence Ratings</li>
                   <li>24/7 Support Access</li>
                   {p.name !== 'Free' && <li>VIP Match Analysis</li>}
                   {p.name === 'Elite' && <li>WhatsApp Direct Signals</li>}
                </ul>
                <a 
                  href={p.price === "0" ? `mailto:${p.email}` : `https://www.paypal.com/cgi-bin/webscr?cmd=_xclick&business=${p.email}&item_name=${p.name}%20Subscription&amount=${p.price}&currency_code=EUR`}
                  target="_blank"
                  className="w-full bg-[#00FF87] text-black py-4 rounded-2xl font-bold hover:scale-105 transition-transform"
                >
                   {p.price === "0" ? "Sign Up Free" : `Pay with PayPal`}
                </a>
             </div>
          ))}
       </div>
    </motion.div>
  );
}

function StatsPage() {
   return (
      <div className="pt-32 pb-24 px-6 max-w-7xl mx-auto">
         <h1 className="text-6xl font-display mb-12 text-center">Our <span className="text-[#00FF87]">Record</span></h1>
         <div className="bg-[#151B2B] p-12 rounded-[48px] border border-white/5 mb-12">
            <h2 className="text-3xl font-bold mb-8">Recent History</h2>
            <div className="space-y-4">
               {[
                  { m: "Real Madrid vs Valencia", r: "WON", o: "1.45" },
                  { m: "Napoli vs AC Milan", r: "WON", o: "1.72" },
                  { m: "Leverkusen vs Roma", r: "WON", o: "1.80" },
                  { m: "Bayern vs Stuttgart", r: "LOST", o: "1.65" },
                  { m: "PSG vs Dortmund", r: "WON", o: "1.55" }
               ].map((row, i) => (
                  <div key={i} className="flex justify-between items-center p-6 bg-black/20 rounded-2xl">
                     <span className="font-bold">{row.m}</span>
                     <div className="flex gap-4 items-center">
                        <span className="text-gray-500">Odds: {row.o}</span>
                        <span className={cn(
                           "px-3 py-1 rounded text-[10px] font-black",
                           row.r === "WON" ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400"
                        )}>{row.r}</span>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </div>
   );
}

function BlogPage() {
   return (
      <div className="pt-32 pb-24 px-6 max-w-7xl mx-auto">
         <h1 className="text-6xl font-display mb-12">Betting <span className="text-[#00FF87]">Insights</span></h1>
         <div className="grid md:grid-cols-2 gap-8">
            {[1,2,3,4].map(i => (
               <div key={i} className="bg-[#151B2B] p-8 rounded-3xl border border-white/5">
                  <div className="bg-[#00FF87]/10 text-[#00FF87] px-3 py-1 rounded-full text-[10px] font-bold uppercase mb-4 inline-block">Strategy</div>
                  <h3 className="text-2xl font-bold mb-4">How Wogan is changing football betting in 2026</h3>
                  <p className="text-gray-400 mb-6 line-clamp-3">Numerical analysis and deep learning models are now outperforming traditional bookmaker odds by a significant margin...</p>
                  <button className="text-[#00FF87] font-bold">Read Full Article →</button>
               </div>
            ))}
         </div>
      </div>
   );
}
