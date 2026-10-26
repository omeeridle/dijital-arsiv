"use client";

import React, { useState, useEffect, use, useRef } from 'react';
import { motion, useScroll, useSpring, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { getEserler, Eser } from '../../data';

export default function EserDetay({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [isMounted, setIsMounted] = useState(false);
  const [currentEser, setCurrentEser] = useState<Eser | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [nextId, setNextId] = useState('/');
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMetaOpen, setIsMetaOpen] = useState(false);
  
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });
  
  useEffect(() => { 
    setIsMounted(true); 
    window.scrollTo(0, 0);

    const allEserler = getEserler();
    setTotalCount(allEserler.length);

    const foundIndex = allEserler.findIndex(e => e.id === resolvedParams.id);
    if (foundIndex !== -1) {
      setCurrentEser(allEserler[foundIndex]);
      setCurrentIndex(foundIndex);

      const nextItem = allEserler[(foundIndex + 1) % allEserler.length];
      setNextId(nextItem.id);
    }
  }, [resolvedParams.id]);

  const scrollGallery = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 350;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  if (!isMounted) return null;
  if (!currentEser) return <div className="min-h-screen flex items-center justify-center text-[9px] tracking-[0.3em] uppercase text-gray-400">Kayıt bulunamadı.</div>;

  const mediaList = currentEser.media && currentEser.media.length > 0 
    ? currentEser.media 
    : [{ type: 'image' as const, url: currentEser.coverImage }];

  const fullContentText = currentEser.content.join(' ');
  const characterLimit = 350;
  const isLongText = fullContentText.length > characterLimit;

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 right-0 h-[1px] bg-gray-900 origin-left z-50"
        style={{ scaleX }}
      />

      <div className="min-h-screen bg-[#FDFDFD] text-[#111] font-sans selection:bg-gray-200 pt-16 md:pt-24 pb-20 md:pb-24">
        <main className="max-w-[900px] mx-auto px-6">
          
          <nav className="mb-12 md:mb-20 flex justify-between items-center">
            <Link href="/">
              <span className="text-[8px] uppercase tracking-[0.3em] text-gray-400 hover:text-gray-900 transition-colors">
                ← arşive dön
              </span>
            </Link>
            <span className="text-[8px] uppercase tracking-[0.3em] text-gray-400">
              kayıt 0{currentIndex + 1} / 0{totalCount}
            </span>
          </nav>

          <div className="flex flex-col md:flex-row gap-12 md:gap-24 items-start">
            
            <div className="w-full md:w-1/3 md:sticky md:top-32 space-y-3">
              <h1 className="text-2xl md:text-3xl font-serif tracking-wide text-gray-900 leading-tight">
                {currentEser.title}
              </h1>

              <div>
                <button
                  onClick={() => setIsMetaOpen(!isMetaOpen)}
                  className="text-[7px] uppercase tracking-[0.3em] text-gray-400 hover:text-gray-900 transition-colors inline-flex items-center gap-1.5 underline underline-offset-4"
                >
                  <span>{isMetaOpen ? 'detayları gizle' : 'detayları incele'}</span>
                  <span>{isMetaOpen ? '↑' : '↓'}</span>
                </button>

                <AnimatePresence>
                  {isMetaOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden space-y-2.5 pt-3 border-t border-gray-100 mt-3"
                    >
                      <div className="space-y-1">
                        <p className="text-[7px] tracking-[0.4em] text-gray-400 uppercase">
                          {currentEser.classification}
                        </p>
                        <p className="text-[8px] tracking-[0.25em] text-gray-500 uppercase">
                          {currentEser.coordinates}
                        </p>
                      </div>

                      <div className="space-y-1 pt-1">
                        <p className="text-[8px] text-gray-400 tracking-[0.2em] uppercase">
                          konum: {currentEser.location}
                        </p>
                        <p className="text-[8px] text-gray-400 tracking-[0.2em] uppercase">
                          tarih: {currentEser.date}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <div className="w-full md:w-2/3 flex flex-col space-y-8">
              
              <div className="relative group">
                {mediaList.length > 1 && (
                  <button
                    onClick={() => scrollGallery('left')}
                    className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white text-zinc-900 w-8 h-8 rounded-full flex items-center justify-center shadow-md backdrop-blur-sm transition-all opacity-70 hover:opacity-100 hidden md:flex"
                    aria-label="Önceki görsel"
                  >
                    ←
                  </button>
                )}

                {mediaList.length > 1 && (
                  <button
                    onClick={() => scrollGallery('right')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white text-zinc-900 w-8 h-8 rounded-full flex items-center justify-center shadow-md backdrop-blur-sm transition-all opacity-70 hover:opacity-100 hidden md:flex"
                    aria-label="Sonraki görsel"
                  >
                    →
                  </button>
                )}

                <div 
                  ref={scrollContainerRef}
                  className="w-full flex overflow-x-auto gap-4 md:gap-6 pb-2 snap-x snap-mandatory scroll-smooth touch-pan-x [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
                >
                  {mediaList.map((media, idx) => (
                    <div key={idx} className="w-full shrink-0 snap-center aspect-[4/3] bg-gray-100 overflow-hidden p-2 border border-gray-100">
                      {media.type === 'video' ? (
                        <video src={media.url} autoPlay loop muted playsInline className="w-full h-full object-cover" />
                      ) : (
                        <img src={media.url} alt={`${currentEser.title} - ${idx + 1}`} className="w-full h-full object-cover" />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {mediaList.length > 1 && (
                <p className="text-[7px] tracking-[0.3em] uppercase text-gray-400 text-center">
                  {mediaList.length} görselden biri görüntüleniyor (kaydırabilirsiniz)
                </p>
              )}

              <div className="space-y-6 md:space-y-8 w-full">
                {isExpanded || !isLongText ? (
                  currentEser.content.map((paragraph: string, idx: number) => (
                    <p
                      key={idx}
                      className="text-[11px] md:text-[12px] leading-[2.6] tracking-[0.03em] text-gray-600 font-light"
                    >
                      {paragraph}
                    </p>
                  ))
                ) : (
                  <p className="text-[11px] md:text-[12px] leading-[2.6] tracking-[0.03em] text-gray-600 font-light">
                    {fullContentText.slice(0, characterLimit)}...
                  </p>
                )}

                {isLongText && (
                  <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="text-[9px] uppercase tracking-[0.2em] font-medium text-gray-900 border-b border-gray-300 pb-1 hover:border-gray-900 transition-colors mt-2 block"
                  >
                    {isExpanded ? 'daralt ↑' : 'devamını oku ↓'}
                  </button>
                )}
              </div>

              {currentEser.quote && (
                <blockquote className="w-full py-4 md:py-5 border-l border-gray-200 pl-5 my-2">
                  <p className="font-serif text-base md:text-lg text-gray-900 italic leading-relaxed">
                    "{currentEser.quote}"
                  </p>
                </blockquote>
              )}

            </div>
          </div>

          <div className="w-full mt-20 md:mt-28 pt-12 border-t border-gray-100 flex justify-end">
            <Link href={`/eser/${nextId}`} className="group text-right">
              <h2 className="text-lg md:text-xl font-serif text-gray-900 group-hover:opacity-50 transition-opacity flex items-center gap-3">
                <span>sonraki eser</span>
                <span>→</span>
              </h2>
            </Link>
          </div>

        </main>
      </div>
    </>
  );
}