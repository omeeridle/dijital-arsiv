"use client";

import React, { useState, useEffect, use } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import Link from 'next/link';
import { eserler } from '@/data';

export default function EserDetay({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [isMounted, setIsMounted] = useState(false);
  
  // Üstteki ince okuma çizgisi
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });
  
  useEffect(() => { 
    setIsMounted(true); 
    window.scrollTo(0, 0);
  }, [resolvedParams.id]);
  
  const currentIndex = eserler.findIndex(e => e.id === resolvedParams.id);
  const eser = eserler[currentIndex];
  const nextEser = eserler[(currentIndex + 1) % eserler.length];

  if (!isMounted) return null;
  if (!eser) return <div className="min-h-screen flex items-center justify-center text-[9px] tracking-[0.3em] uppercase text-gray-400">Kayıt bulunamadı.</div>;

  return (
    <>
      {/* 1px Okuma İlerleme Çizgisi */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[1px] bg-gray-900 origin-left z-50"
        style={{ scaleX }}
      />

      <div className="min-h-screen bg-[#FDFDFD] text-[#111] font-sans selection:bg-gray-200 pt-24 pb-32">
        <main className="max-w-[900px] mx-auto px-6">
          
          {/* Üst Navigasyon */}
          <nav className="mb-20 flex justify-between items-center">
            <Link href="/">
              <span className="text-[8px] uppercase tracking-[0.3em] text-gray-400 hover:text-gray-900 transition-colors">
                ← arşive dön
              </span>
            </Link>
            <span className="text-[8px] uppercase tracking-[0.3em] text-gray-400">
              kayıt 0{currentIndex + 1} / 0{eserler.length}
            </span>
          </nav>

          {/* İki Sütunlu Tertipli Düzen */}
          <div className="flex flex-col md:flex-row gap-16 md:gap-24 items-start">
            
            {/* SOL SÜTUN: Sabit Başlık ve Bilgiler */}
            <div className="w-full md:w-1/3 md:sticky md:top-32 space-y-6">
              <div className="space-y-2">
                <p className="text-[7px] tracking-[0.4em] text-gray-400 uppercase">
                  {eser.classification}
                </p>
                <p className="text-[8px] tracking-[0.25em] text-gray-500 uppercase">
                  {eser.coordinates}
                </p>
              </div>

              <h1 className="text-2xl md:text-3xl font-serif tracking-wide text-gray-900 leading-tight">
                {eser.title}
              </h1>

              <div className="pt-6 border-t border-gray-100 space-y-3">
                <p className="text-[8px] text-gray-400 tracking-[0.2em] uppercase">
                  konum: {eser.location}
                </p>
                <p className="text-[8px] text-gray-400 tracking-[0.2em] uppercase">
                  tarih: {eser.date}
                </p>
              </div>
            </div>

            {/* SAĞ SÜTUN: Medya ve Metin Akışı (Kolay Okunur Alan) */}
            <div className="w-full md:w-2/3 flex flex-col space-y-16">
              
              {/* Ana Medya */}
              {eser.media[0] && (
                <div className="w-full aspect-[4/3] bg-gray-100 overflow-hidden p-2 border border-gray-100">
                  {eser.media[0].type === 'video' ? (
                    <video src={eser.media[0].url} autoPlay loop muted playsInline className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000" />
                  ) : (
                    <img src={eser.media[0].url} alt={eser.title} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000" />
                  )}
                </div>
              )}

              {/* Paragraflar (Göz yormayan genişlik ve satır aralığı) */}
              <div className="space-y-8 max-w-[500px]">
                {eser.content.map((paragraph: string, idx: number) => (
                  <p
                    key={idx}
                    className="text-[11px] md:text-[12px] leading-[2.6] tracking-[0.03em] text-gray-600 font-light"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>

              {/* Felsefi Alıntı */}
              {eser.quote && (
                <blockquote className="max-w-[500px] py-8 border-l border-gray-200 pl-6 my-4">
                  <p className="font-serif text-xl text-gray-900 italic leading-relaxed">
                    "{eser.quote}"
                  </p>
                </blockquote>
              )}

              {/* İkinci Medya (Eğer varsa) */}
              {eser.media[1] && (
                <div className="w-full aspect-[4/3] bg-gray-100 overflow-hidden p-2 border border-gray-100">
                  {eser.media[1].type === 'video' ? (
                    <video src={eser.media[1].url} autoPlay loop muted playsInline className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000" />
                  ) : (
                    <img src={eser.media[1].url} alt="Ek Medya" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000" />
                  )}
                </div>
              )}

            </div>
          </div>

          {/* Sonraki Kayıt Geçişi (Alt Kısım) */}
          <div className="w-full mt-40 pt-16 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center">
            <p className="text-[8px] tracking-[0.3em] uppercase text-gray-400 mb-4 md:mb-0">
              arşivi okumaya devam et
            </p>
            <Link href={`/eser/${nextEser.id}`} className="group text-center md:text-right">
              <p className="text-[8px] tracking-[0.3em] uppercase text-gray-400 mb-2 group-hover:text-gray-900 transition-colors">
                sonraki kayıt
              </p>
              <h2 className="text-xl font-serif text-gray-900 group-hover:opacity-50 transition-opacity">
                {nextEser.title}
              </h2>
            </Link>
          </div>

        </main>
      </div>
    </>
  );
}