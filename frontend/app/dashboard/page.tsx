"use client";
import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function Dashboard() {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8000/api/summary')
         .then(res => setData(res.data));
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 p-8 flex flex-col items-center">
      <div className="w-full max-w-4xl">
        <Link href="/" className="text-slate-500 hover:text-slate-800 mb-6 inline-block">← Back to Challenge</Link>

        <h1 className="text-3xl font-bold text-slate-800 mb-6">Learning Analytics 📊</h1>

        <div className="bg-white p-8 rounded-2xl shadow-lg h-96">
            <h3 className="text-lg font-semibold text-slate-600 mb-4">Weekly Performance</h3>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="day" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip cursor={{fill: '#f1f5f9'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                <Bar dataKey="score" fill="#4F46E5" radius={[6, 6, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}