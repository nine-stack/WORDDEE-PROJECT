"use client";
import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';

interface Feedback {
  score: number;
  level: string;
  suggestion: string;
  corrected_sentence: string;
}

export default function Home() {
  const [word, setWord] = useState("Loading...");
  const [sentence, setSentence] = useState("");
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [loading, setLoading] = useState(false);

  // ดึงคำศัพท์จาก Backend เมื่อเข้าเว็บ
  useEffect(() => {
    axios.get('http://localhost:8000/api/word')
      .then(res => setWord(res.data.word))
      .catch(err => console.error("Error fetching word:", err));
  }, []);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // ส่งข้อมูลไปตรวจที่ Backend
      const res = await axios.post('http://localhost:8000/api/validate-sentence', {
        word,
        sentence
      });
      setFeedback(res.data);
    } catch (error) {
      console.error("Error validating:", error);
      alert("ไม่สามารถเชื่อมต่อกับ Server ได้");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center py-10 px-4">

      {/* Header & Nav */}
      <div className="w-full max-w-2xl flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Worddee.ai</h1>
        <Link href="/dashboard" className="text-blue-600 hover:underline font-medium">
          View Dashboard →
        </Link>
      </div>

      {/* Main Card */}
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-2xl border border-slate-100">
        <p className="text-sm uppercase tracking-wide text-slate-400 font-semibold mb-2">Word of the Day</p>
        <h2 className="text-5xl font-black text-indigo-600 mb-8">{word}</h2>

        <label className="block text-slate-700 font-medium mb-2">Compose a sentence:</label>
        <textarea 
          className="w-full border-2 border-slate-200 rounded-xl p-4 text-lg focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all resize-none text-black"
          rows={3}
          placeholder={`Try using "${word}" in a sentence...`}
          value={sentence}
          onChange={(e) => setSentence(e.target.value)}
        />

        <button 
          onClick={handleSubmit}
          disabled={loading}
          className="mt-6 w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3.5 rounded-xl font-bold text-lg shadow-lg shadow-indigo-200 transition-all active:scale-95 disabled:opacity-70"
        >
          {loading ? "Analyzing with AI..." : "Check My Grammar ✨"}
        </button>
      </div>

      {/* Feedback Result */}
      {feedback && (
        <div className="mt-6 bg-white p-6 rounded-2xl shadow-lg w-full max-w-2xl border-l-8 border-green-500 animate-in fade-in slide-in-from-bottom-4">
          <div className="flex justify-between items-start mb-4">
            <div>
                <p className="text-sm text-slate-500">Overall Score</p>
                <p className="text-4xl font-bold text-slate-800">{feedback.score}<span className="text-xl text-slate-400">/10</span></p>
            </div>
            <span className="px-4 py-1.5 bg-green-100 text-green-700 rounded-full text-sm font-bold border border-green-200">
              {feedback.level}
            </span>
          </div>

          <div className="space-y-3">
            <div className="p-3 bg-slate-50 rounded-lg">
                <p className="font-semibold text-slate-700 text-sm">💡 Suggestion:</p>
                <p className="text-slate-600">{feedback.suggestion}</p>
            </div>
            <div className="p-3 bg-indigo-50 rounded-lg">
                <p className="font-semibold text-indigo-700 text-sm">✍️ Correction:</p>
                <p className="text-indigo-600 italic">"{feedback.corrected_sentence}"</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}