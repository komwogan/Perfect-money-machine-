import React from 'react';
import { motion } from 'motion/react';
import { Mail, Star, TrendingUp, CheckCircle2 } from 'lucide-react';
import { cn } from '../lib/utils';

export function ContactPage() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-32 pb-24 px-6 max-w-4xl mx-auto">
      <div className="bg-[#151B2B] rounded-[48px] p-12 border border-white/5">
        <h1 className="text-5xl font-display mb-8">Contact <span className="text-[#00FF87]">Us</span></h1>
        
        <div className="grid md:grid-cols-2 gap-12 mb-12">
          <div>
            <h2 className="text-xl font-bold mb-4 text-[#00FF87]">Get In Touch</h2>
            <p className="text-gray-400 mb-8 leading-relaxed">
              Have questions about our plans or need personal betting advice? Reach out to the owner directly.
            </p>
            <div className="space-y-6">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#00FF87]/10 rounded-2xl flex items-center justify-center text-[#00FF87]">
                     <Star size={24} aria-hidden="true" />
                  </div>
                  <div>
                     <div className="text-xs text-gray-400 font-bold uppercase tracking-widest">Owner</div>
                     <div className="font-bold text-lg text-white">Komurubuga wogan</div>
                  </div>
               </div>
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#00FF87]/10 rounded-2xl flex items-center justify-center text-[#00FF87]">
                     <Mail size={24} aria-hidden="true" />
                  </div>
                  <div>
                     <div className="text-xs text-gray-400 font-bold uppercase tracking-widest">Email Contact</div>
                     <div className="font-bold text-lg text-white">komwogan@gmail.com</div>
                  </div>
               </div>
            </div>
          </div>

          <form className="space-y-4">
             <div>
                <label htmlFor="contact-name" className="sr-only">Your Name</label>
                <input id="contact-name" type="text" placeholder="Your Name" className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 focus:ring-1 focus:ring-[#00FF87] outline-none" />
             </div>
             <div>
                <label htmlFor="contact-email" className="sr-only">Your Email</label>
                <input id="contact-email" type="email" placeholder="Your Email" className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 focus:ring-1 focus:ring-[#00FF87] outline-none" />
             </div>
             <div>
                <label htmlFor="contact-message" className="sr-only">Your Message</label>
                <textarea id="contact-message" rows={4} placeholder="Your Message" className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 focus:ring-1 focus:ring-[#00FF87] outline-none resize-none"></textarea>
             </div>
             <button className="w-full bg-[#00FF87] text-black py-4 rounded-xl font-bold hover:shadow-[0_0_20px_rgba(0,255,135,0.3)] transition-all">
                Send Message
             </button>
          </form>
        </div>
      </div>
    </motion.div>
  );
}

export function PricingPage({ billingCycle, setBillingCycle }: { billingCycle: 'monthly' | 'annual', setBillingCycle: (val: 'monthly' | 'annual') => void }) {
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
              <span className={cn("text-sm font-bold", billingCycle === 'monthly' ? "text-white" : "text-gray-400")}>Monthly</span>
              <button 
                onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'annual' : 'monthly')}
                aria-label="Toggle billing cycle"
                className="w-14 h-8 bg-white/10 rounded-full p-1"
              >
                <div className={cn(
                  "w-6 h-6 bg-[#00FF87] rounded-full transition-transform",
                  billingCycle === 'annual' ? "translate-x-6" : "translate-x-0"
                )} />
              </button>
              <span className={cn("text-sm font-bold", billingCycle === 'annual' ? "text-white" : "text-gray-400")}>Annual (-20%)</span>
          </div>
       </div>

       <div className="grid md:grid-cols-3 gap-8">
          {plans.map((p, i) => (
             <div key={i} className="bg-[#151B2B] p-10 rounded-[48px] border border-white/5 flex flex-col items-center text-center">
                <h2 className="text-2xl font-bold mb-4">{p.name}</h2>
                <div className="text-5xl font-black mb-8">€{p.price}<span className="text-sm font-normal text-white/50">/{billingCycle === 'monthly' ? 'mo' : 'yr'}</span></div>
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
                  className="w-full bg-[#00FF87] text-black py-4 rounded-2xl font-bold hover:scale-105 transition-transform flex items-center justify-center"
                  aria-label={`Subscribe to ${p.name} plan for €${p.price}`}
                >
                   {p.price === "0" ? "Sign Up Free" : `Pay with PayPal`}
                </a>
             </div>
          ))}
       </div>
    </motion.div>
  );
}

export function StatsPage() {
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
                        <span className="text-gray-400">Odds: {row.o}</span>
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

export const BLOG_POSTS = [
  {
    id: "wogan-2026-strategy",
    category: "Strategy",
    title: "How Wogan is changing football betting in 2026",
    excerpt: "Numerical analysis and deep learning models are now outperforming traditional bookmaker odds by a significant margin. Discover the science behind our picks.",
    content: `
      <p>Football betting has evolved beyond simple intuition. In 2026, the landscape is dominated by data science. Our proprietary Wogan algorithms analyze over 5,000 data points per match, from player fatigue levels to micro-climatic conditions at the stadium.</p>
      <h3>The Data Advantage</h3>
      <p>Traditional bookmakers rely on historical averages. We look at real-time variance. When a key playmaker's pass-completion rate drops by 5% in training, our models adjust the win-probability by 12% before the odds even move.</p>
      <p>This "Alpha" is what allows our Elite VIP members to consistently beat the closing line. It's not magic—it's math.</p>
    `,
    date: "May 5, 2026"
  },
  {
    id: "bankroll-management",
    category: "Advice",
    title: "The 3% Rule: Mastering your Bankroll",
    excerpt: "Most bettors fail not because of bad picks, but because of bad management. Learn why the 3% stake rule is the holy grail of professional gambling.",
    content: `
      <p>Discipline is the difference between a gambler and a professional. Even with an 80% win rate, poor staking can lead to ruin. The 3% rule dictates that no single wager should ever exceed 3% of your total bankroll.</p>
      <h3>Why 3%?</h3>
      <p>Mathematically, staying within this limit protects you from the inevitable "variance runs"—periods where even the best analysis meets bad luck. By keeping stakes consistent, you allow the law of large numbers to work in your favor.</p>
      <p>Our Pro and Elite plans include specific unit-sizing advice for every single pick we release.</p>
    `,
    date: "May 1, 2026"
  },
  {
    id: "uefa-champions-league-trends",
    category: "Analysis",
    title: "Champions League Quarter-Final Trends",
    excerpt: "Away goals are a distant memory. How the tactical shifts in European football have created new value spots for 'Both Teams to Score' markets.",
    content: `
      <p>The removal of the away goals rule has fundamentally changed the first-leg dynamic of European knockout ties. Teams are no longer afraid to concede at home, leading to much more open, attacking play in the opening 90 minutes.</p>
      <h3>Value in BTTS</h3>
      <p>Our data shows a 15% increase in 'Both Teams to Score' success rates since the rule change. Specifically, games involving high-pressing teams like Leverkusen or Man City have shown incredible value when playing against defensive blocks in late-stage tournaments.</p>
    `,
    date: "April 28, 2026"
  }
];

export function BlogPage({ onNavigate }: { onNavigate: (page: string, params?: any) => void }) {
   return (
      <div className="pt-32 pb-24 px-6 max-w-7xl mx-auto">
         <h1 className="text-6xl font-display mb-12">Betting <span className="text-[#00FF87]">Insights</span></h1>
         <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {BLOG_POSTS.map(post => (
               <div key={post.id} className="bg-[#151B2B] p-8 rounded-3xl border border-white/5 flex flex-col hover:border-[#00FF87]/30 transition-colors">
                  <div className="bg-[#00FF87]/10 text-[#00FF87] px-3 py-1 rounded-full text-[10px] font-black uppercase mb-4 inline-block w-fit">{post.category}</div>
                  <h2 className="text-2xl font-bold mb-4">{post.title}</h2>
                  <p className="text-gray-400 mb-8 line-clamp-3 flex-1">{post.excerpt}</p>
                  <button 
                    onClick={() => onNavigate(`BlogPost:${post.id}`)}
                    className="text-[#00FF87] font-bold hover:underline flex items-center gap-2"
                    aria-label={`Read full article: ${post.title}`}
                  >
                    Read Full Article →
                  </button>
               </div>
            ))}
         </div>
      </div>
   );
}

export function BlogPost({ postId, onNavigate }: { postId: string, onNavigate: (page: string) => void }) {
  const post = BLOG_POSTS.find(p => p.id === postId);
  
  if (!post) {
    return (
      <div className="pt-32 pb-24 px-6 text-center">
        <h1 className="text-4xl font-display mb-4">Post Not Found</h1>
        <button onClick={() => onNavigate('Blog')} className="text-[#00FF87] font-bold">Back to Blog</button>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="pt-32 pb-24 px-6 max-w-3xl mx-auto">
      <button 
        onClick={() => onNavigate('Blog')} 
        className="text-gray-400 hover:text-white mb-8 font-bold flex items-center gap-2 transition-colors"
        aria-label="Back to blog list"
      >
        ← Back to Insights
      </button>

      <div className="mb-12">
        <div className="bg-[#00FF87]/10 text-[#00FF87] px-4 py-1 rounded-full text-xs font-black uppercase mb-6 inline-block">
          {post.category}
        </div>
        <h1 className="text-5xl font-display mb-6 leading-tight">{post.title}</h1>
        <div className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Published on {post.date}</div>
      </div>

      <div 
        className="prose prose-invert max-w-none text-gray-300 leading-relaxed space-y-6 text-lg"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      <div className="mt-16 pt-16 border-t border-white/5">
         <h2 className="text-2xl font-bold mb-8">Related Articles</h2>
         <div className="grid sm:grid-cols-2 gap-6">
            {BLOG_POSTS.filter(p => p.id !== postId).slice(0, 2).map(p => (
               <button 
                  key={p.id}
                  onClick={() => onNavigate(`BlogPost:${p.id}`)}
                  className="bg-white/5 p-6 rounded-2xl border border-white/5 text-left hover:border-[#00FF87]/30 transition-colors"
                  aria-label={`Read related article: ${p.title}`}
               >
                  <div className="text-[10px] font-black uppercase text-[#00FF87] mb-2">{p.category}</div>
                  <div className="font-bold text-white">{p.title}</div>
               </button>
            ))}
         </div>
      </div>
    </motion.div>
  );
}
