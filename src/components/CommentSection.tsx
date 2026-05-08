import React, { useState, useEffect } from 'react';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, limit } from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { MessageSquare, Send, User, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

interface Comment {
  id: string;
  name: string;
  text: string;
  createdAt: any;
  email: string;
}

export function CommentSection() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [text, setText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const q = query(
      collection(db, 'comments'),
      orderBy('createdAt', 'desc'),
      limit(20)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newComments = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Comment[];
      setComments(newComments);
    }, (err) => {
      handleFirestoreError(err, OperationType.LIST, 'comments');
    });

    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !text) return;

    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      await addDoc(collection(db, 'comments'), {
        name,
        email,
        text,
        createdAt: serverTimestamp(),
      });
      
      setName('');
      setEmail('');
      setText('');
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError("Failed to post comment. Please try again.");
      handleFirestoreError(err, OperationType.CREATE, 'comments');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-24 px-6 bg-[#0A0E1A]">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-12">
          <div className="w-12 h-12 bg-[#00FF87]/10 rounded-2xl flex items-center justify-center">
            <MessageSquare className="text-[#00FF87] w-6 h-6" />
          </div>
          <div>
            <h2 className="text-3xl font-display">Community <span className="text-[#00FF87]">Talk</span></h2>
            <p className="text-gray-500 text-sm">Join the discussion with other Wogan members.</p>
          </div>
        </div>

        <div className="grid md:grid-cols-5 gap-12">
          {/* Post Form */}
          <div className="md:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white/5 border border-white/10 rounded-[32px] p-8 sticky top-24">
              <h3 className="text-xl font-bold mb-6">Leave a Comment</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] uppercase font-bold text-gray-500 mb-2 block">Name</label>
                  <input 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:ring-1 focus:ring-[#00FF87] outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-gray-500 mb-2 block">Email</label>
                  <input 
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@example.com"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:ring-1 focus:ring-[#00FF87] outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-gray-500 mb-2 block">Message</label>
                  <textarea 
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="What's your strategy today?"
                    rows={4}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:ring-1 focus:ring-[#00FF87] outline-none resize-none"
                    required
                  />
                </div>
              </div>

              {error && <p className="text-red-500 text-xs mt-4">{error}</p>}
              {success && <p className="text-[#00FF87] text-xs mt-4">Comment posted successfully!</p>}

              <button 
                type="submit"
                disabled={isSubmitting}
                className={cn(
                  "w-full mt-8 py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all",
                  isSubmitting ? "bg-gray-700 cursor-not-allowed" : "bg-[#00FF87] text-black hover:scale-105 active:scale-95 shadow-lg shadow-[#00FF87]/20"
                )}
              >
                {isSubmitting ? "Posting..." : <>Post Comment <Send className="w-4 h-4" /></>}
              </button>
              
              <p className="mt-4 text-[10px] text-gray-500 text-center uppercase tracking-widest font-bold">
                Comments are monitored by Wogan
              </p>
            </form>
          </div>

          {/* Comments List */}
          <div className="md:col-span-3 space-y-6">
            <AnimatePresence mode="popLayout">
              {comments.length === 0 ? (
                <div className="py-20 text-center bg-white/5 rounded-[32px] border border-white/5 border-dashed">
                  <MessageSquare className="w-12 h-12 text-gray-700 mx-auto mb-4" />
                  <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">No comments yet. Be the first!</p>
                </div>
              ) : (
                comments.map((comment, index) => (
                  <motion.div 
                    key={comment.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-white/5 border border-white/10 rounded-3xl p-6 relative overflow-hidden"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-[#00FF87]/10 rounded-full flex items-center justify-center">
                        <User className="text-[#00FF87] w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-bold text-white leading-tight">{comment.name}</div>
                        <div className="flex items-center gap-1.5 text-[10px] text-gray-500 font-bold uppercase tracking-tight">
                          <Calendar className="w-3 h-3" />
                          {comment.createdAt?.toDate ? comment.createdAt.toDate().toLocaleDateString() : 'Just now'}
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-300 leading-relaxed text-sm">
                      {comment.text}
                    </p>
                    {/* Decorative element */}
                    <div className="absolute top-0 right-0 p-4 opacity-5">
                       <MessageSquare className="w-12 h-12 rotate-12" />
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
