"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import { eserler } from './data';

function ArchiveItem({ eser, index, setActiveBg }: { eser: any, index: number, setActiveBg: (color: string) => void }) {
  const isEven = index % 2 === 0;
  const ref = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start center", "end center"]
  });

  useEffect(() => {
    return scrollYProgress.onChange((latest) => {
      if (latest > 0.1 && latest < 0.9) {
        setActiveBg(eser.bgColor);
      }
    });
  }, [scrollYProgress, eser.bgColor, setActiveBg]);
  
  const imageY = useTransform(scrollYProgress, [0, 1], ["-15%", "15%"]);

  return (
    <article className={`flex flex-col md:flex-row items-center justify-center gap-16 w-full ${isEven ? '' : 'md:flex-row-reverse'}`} ref={ref}>
      
      {/* Resim ve Altındaki Gözlemi İncele Butonu */}
      <div className="flex flex-col items-center w-full max-w-[260px] shrink-0 group">
        <Link href={`/eser/${eser.id}`} className="w-full">
          <div className="aspect-[3/4] overflow-hidden bg-white/50 cursor-pointer border border-black/5 p-2 relative shadow-sm">
            <motion.div
              style={{ y: imageY, scale: 1.15 }}
              className="w-full h-full absolute inset-0"
            >
              <img 
                src={eser.coverImage} 
                alt={eser.title} 
                className="w-full h-full object-cover grayscale transition-all duration-[2000ms] group-hover:grayscale-0" 
              />
            </motion.div>
          </div>
        </Link>

        {/* Gözlemi İncele Yazısı ve Tarih - Resmin Tam Altında */}
        <div className="w-full flex justify-between items-center pt-4 px-1">
          <span className="text-[7px] text-gray-400 tracking-[0.3em] uppercase">
            {eser.date}
          </span>
          <Link href={`/eser/${eser.id}`}>
            <span className="inline-block uppercase text-[8px] font-medium tracking-[0.2em] border-b border-gray-300 pb-1 hover:border-gray-900 transition-colors text-gray-900">
              gözlemi incele
            </span>
          </Link>
        </div>
      </div>
      
      {/* Sağ Taraf: Sadece Başlık, Koordinat ve Sınıflandırma (Kısa açıklama silindi) */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-10%" }}
        transition={{ duration: 1.2, delay: 0.2 }}
        className="flex flex-col justify-center space-y-4 max-w-[320px] text-center md:text-left"
      >
        <div className="flex flex-col space-y-1">
          <p className="text-[7px] tracking-[0.4em] text-gray-400 uppercase">
            ref 0{index + 1} // {eser.classification}
          </p>
          <p className="text-[8px] tracking-[0.25em] text-gray-500 uppercase">
            {eser.coordinates}
          </p>
        </div>
        
        <Link href={`/eser/${eser.id}`}>
          <h2 className="text-xl font-serif text-gray-900 tracking-wide hover:opacity-50 transition-opacity pt-2">
            {eser.title}
          </h2>
        </Link>
      </motion.div>
    </article>
  );
}

export default function PremiumGallery() {
  const [isLoading, setIsLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const [crypticText, setCrypticText] = useState("sys.init...");
  const [activeBg, setActiveBg] = useState("#FDFDFD");

  useEffect(() => { 
    setIsMounted(true);
    
    let iteration = 0;
    const interval = setInterval(() => {
      if (iteration < 15) {
        const randomLat = (Math.random() * 90).toFixed(4);
        const randomLng = (Math.random() * 180).toFixed(4);
        setCrypticText(`loc: ${randomLat} n — ${randomLng} w`);
      } else if (iteration < 30) {
        const hz = (Math.random() * 1000).toFixed(2);
        setCrypticText(`freq_analyze: ${hz} hz`);
      } else if (iteration < 45) {
        const randomHex = Math.floor(Math.random()*16777215).toString(16).toLowerCase();
        setCrypticText(`decrypt_key: 0x${randomHex}`);
      } else if (iteration < 55) {
        setCrypticText("veriler eşleştiriliyor...");
      } else {
        setCrypticText("bearth");
        clearInterval(interval);
      }
      iteration++;
    }, 40);

    const timer = setTimeout(() => { setIsLoading(false); }, 2600);
    
    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, []);

  if (!isMounted) return null;

  return (
    <>
      <AnimatePresence>
        {isLoading && (
          <motion.div
            key="preloader"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="fixed inset-0 z-[9999] bg-[#FDFDFD] flex items-center justify-center"
          >
            <p className="text-[10px] tracking-[0.4em] uppercase text-gray-500 font-mono lowercase">
              {crypticText}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div 
        animate={{ backgroundColor: activeBg }}
        transition={{ duration: 1.8, ease: "easeInOut" }}
        className="min-h-screen text-[#111] font-sans selection:bg-gray-200 transition-colors"
      >
        <main className="max-w-[900px] mx-auto px-6 py-32 flex flex-col items-center">
          
          {/* Üstteki 'Evrensel Gözlem Kayıtları' yazısı tamamen silindi, sadece ana başlık kaldı */}
          <header className="mb-40 text-center flex flex-col items-center">
            <motion.h1 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: isLoading ? 2.8 : 0.2 }}
              className="text-2xl md:text-3xl font-serif tracking-wide text-gray-900 leading-tight lowercase"
            >
              dünyanın ve evrenin <br /> eşsiz detayları.
            </motion.h1>
          </header>

          <div className="w-full flex flex-col items-center space-y-40 pb-24">
            {eserler.map((eser, index) => (
              <ArchiveItem key={eser.id} eser={eser} index={index} setActiveBg={setActiveBg} />
            ))}
          </div>
        </main>
      </motion.div>
    </>
  );
}