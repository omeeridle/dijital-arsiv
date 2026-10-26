'use client';

import { useState, useEffect } from 'react';
import { getEserler, Eser } from '@/app/data';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  
  const [eserlerListesi, setEserlerListesi] = useState<Eser[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [form, setForm] = useState({
    id: '',
    title: '',
    location: '',
    coordinates: '',
    date: '',
    classification: '',
    bgColor: '#FFFFFF',
    shortDescription: '',
    content: '',
    quote: '',
  });

  const [mediaList, setMediaList] = useState<string[]>(['']);

  useEffect(() => {
    const auth = localStorage.getItem('admin_auth');
    if (auth === 'true') {
      setIsAuthenticated(true);
    }
    setEserlerListesi(getEserler());
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === 'admin123') {
      localStorage.setItem('admin_auth', 'true');
      setIsAuthenticated(true);
    } else {
      alert('Hatalı şifre!');
      setPasswordInput('');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_auth');
    setIsAuthenticated(false);
  };

  const handleAddMediaInput = () => {
    setMediaList([...mediaList, '']);
  };

  const handleMediaChange = (index: number, value: string) => {
    const updated = [...mediaList];
    updated[index] = value;
    setMediaList(updated);
  };

  const handleRemoveMediaInput = (index: number) => {
    const updated = mediaList.filter((_, i) => i !== index);
    setMediaList(updated.length > 0 ? updated : ['']);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const customEserler = JSON.parse(localStorage.getItem('custom_eserler') || '[]');

    const formattedContent = typeof form.content === 'string' 
      ? form.content.split('\n').filter(Boolean) 
      : form.content;

    const formattedMedia = mediaList
      .filter(url => url.trim() !== '')
      .map(url => ({ type: 'image' as const, url }));

    const coverImage = formattedMedia[0]?.url || '';

    const yeniEserData = {
      ...form,
      id: editingId || form.title.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      coverImage,
      content: formattedContent,
      media: formattedMedia,
    };

    if (editingId) {
      const existsInCustom = customEserler.some((item: Eser) => item.id === editingId);
      let newCustomEserler;
      if (existsInCustom) {
        newCustomEserler = customEserler.map((item: Eser) => item.id === editingId ? yeniEserData : item);
      } else {
        newCustomEserler = [...customEserler, yeniEserData];
      }
      localStorage.setItem('custom_eserler', JSON.stringify(newCustomEserler));
      alert('Eser başarıyla güncellendi!');
    } else {
      localStorage.setItem('custom_eserler', JSON.stringify([...customEserler, yeniEserData]));
      alert('Yeni eser arşive eklendi!');
    }

    setEserlerListesi(getEserler());
    resetForm();
  };

  const handleEdit = (eser: Eser) => {
    setEditingId(eser.id);
    setForm({
      id: eser.id,
      title: eser.title,
      location: eser.location,
      coordinates: eser.coordinates,
      date: eser.date,
      classification: eser.classification,
      bgColor: eser.bgColor || '#FFFFFF',
      shortDescription: eser.shortDescription,
      content: Array.isArray(eser.content) ? eser.content.join('\n') : '',
      quote: eser.quote || '',
    });

    const urls = eser.media && eser.media.length > 0 
      ? eser.media.map(m => m.url) 
      : [eser.coverImage];
    setMediaList(urls.length > 0 ? urls : ['']);

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id: string) => {
    if (confirm('Bu eseri silmek istediğinize emin misiniz?')) {
      const customEserler = JSON.parse(localStorage.getItem('custom_eserler') || '[]');
      const filtered = customEserler.filter((item: Eser) => item.id !== id);
      localStorage.setItem('custom_eserler', JSON.stringify(filtered));
      setEserlerListesi(getEserler());
      alert('Eser silindi.');
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setForm({
      id: '',
      title: '',
      location: '',
      coordinates: '',
      date: '',
      classification: '',
      bgColor: '#FFFFFF',
      shortDescription: '',
      content: '',
      quote: '',
    });
    setMediaList(['']);
  };

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-[#FAFAFA] text-zinc-900 flex items-center justify-center p-6 font-sans">
        <div className="max-w-md w-full bg-white border border-zinc-200 shadow-sm rounded-xl p-8">
          <h1 className="text-lg font-semibold tracking-tight text-zinc-900 mb-2">Yönetici Girişi</h1>
          <p className="text-zinc-500 text-xs mb-6">Arşivi yönetmek için şifrenizi girin.</p>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              required
              className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-4 py-3 text-zinc-900 focus:outline-none focus:border-zinc-400 text-sm"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              placeholder="Yönetici şifresi..."
            />
            <button
              type="submit"
              className="w-full bg-zinc-900 text-white font-medium py-3 rounded-lg hover:bg-zinc-800 transition-colors text-sm shadow-sm"
            >
              Giriş Yap
            </button>
          </form>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#FAFAFA] text-zinc-900 p-8 md:p-16 font-sans">
      <div className="max-w-2xl mx-auto flex justify-between items-center mb-8">
        <span className="text-xs uppercase tracking-[0.3em] text-zinc-400">Yönetici Paneli</span>
        <button 
          onClick={handleLogout}
          className="text-xs bg-red-50 text-red-600 hover:bg-red-100 px-3 py-1.5 rounded transition-colors font-medium"
        >
          Çıkış Yap
        </button>
      </div>

      <div className="max-w-2xl mx-auto bg-white border border-zinc-200 shadow-sm rounded-xl p-8 md:p-12 mb-12">
        
        <div className="mb-8 border-b border-zinc-100 pb-6 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-zinc-900">
              {editingId ? 'Eseri Düzenle' : 'Eser Yükleme Paneli'}
            </h1>
            <p className="text-zinc-500 text-sm mt-1">
              {editingId ? 'Mevcut eser detaylarını güncelleyin.' : 'Arşive yeni bir parça ekleyin.'}
            </p>
          </div>
          {editingId && (
            <button onClick={resetForm} className="text-xs text-zinc-400 hover:text-zinc-900 underline">
              İptal Et
            </button>
          )}
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          <div>
            <label className="block text-xs font-medium uppercase tracking-wider text-zinc-500 mb-2">Eser Adı / Başlık</label>
            <input
              type="text"
              required
              className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-4 py-3 text-zinc-900 focus:outline-none focus:border-zinc-400 text-sm"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Örn: Sessiz Vadi"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-zinc-500 mb-2">Konum</label>
              <input
                type="text"
                required
                className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-4 py-3 text-zinc-900 focus:outline-none focus:border-zinc-400 text-sm"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                placeholder="Örn: İzlanda"
              />
            </div>
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-zinc-500 mb-2">Tarih / Dönem</label>
              <input
                type="text"
                required
                className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-4 py-3 text-zinc-900 focus:outline-none focus:border-zinc-400 text-sm"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                placeholder="Örn: Sonbahar, 2026"
              />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="block text-xs font-medium uppercase tracking-wider text-zinc-500">Görseller (Yana Kaydırmalı Galeri)</label>
              <button
                type="button"
                onClick={handleAddMediaInput}
                className="text-xs bg-zinc-100 hover:bg-zinc-200 text-zinc-800 px-3 py-1.5 rounded transition-colors font-medium"
              >
                + Yeni Görsel Ekle
              </button>
            </div>

            {mediaList.map((url, index) => (
              <div key={index} className="flex gap-2 items-center">
                <input
                  type="url"
                  required
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-4 py-2.5 text-zinc-900 focus:outline-none focus:border-zinc-400 text-sm"
                  value={url}
                  onChange={(e) => handleMediaChange(index, e.target.value)}
                  placeholder={`Görsel URL #${index + 1} (https://...)`}
                />
                {mediaList.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveMediaInput(index)}
                    className="text-red-500 hover:text-red-700 text-xs px-2 py-2 font-medium"
                  >
                    Sil
                  </button>
                )}
              </div>
            ))}
          </div>

          <div>
            <label className="block text-xs font-medium uppercase tracking-wider text-zinc-500 mb-2">Kısa Açıklama</label>
            <textarea
              rows={2}
              className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-4 py-3 text-zinc-900 focus:outline-none focus:border-zinc-400 text-sm resize-none"
              value={form.shortDescription}
              onChange={(e) => setForm({ ...form, shortDescription: e.target.value })}
              placeholder="Kısa özet..."
            />
          </div>

          <div>
            <label className="block text-xs font-medium uppercase tracking-wider text-zinc-500 mb-2">Detay Yazısı (Her satır yeni paragraf)</label>
            <textarea
              rows={5}
              className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-4 py-3 text-zinc-900 focus:outline-none focus:border-zinc-400 text-sm"
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              placeholder="Paragraflar..."
            />
          </div>

          <div>
            <label className="block text-xs font-medium uppercase tracking-wider text-zinc-500 mb-2">Alıntı / Not</label>
            <input
              type="text"
              className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-4 py-3 text-zinc-900 focus:outline-none focus:border-zinc-400 text-sm"
              value={form.quote}
              onChange={(e) => setForm({ ...form, quote: e.target.value })}
              placeholder="Vurucu bir söz..."
            />
          </div>

          <button
            type="submit"
            className="w-full bg-zinc-900 text-white font-medium py-3.5 rounded-lg hover:bg-zinc-800 transition-colors text-sm shadow-sm"
          >
            {editingId ? 'Değişiklikleri Kaydet' : 'Eseri Arşive Ekle'}
          </button>
        </form>
      </div>

      <div className="max-w-2xl mx-auto bg-white border border-zinc-200 shadow-sm rounded-xl p-8">
        <h2 className="text-lg font-medium text-zinc-900 mb-4">Mevcut Eserler ({eserlerListesi.length})</h2>
        <div className="space-y-3">
          {eserlerListesi.map((eser) => (
            <div key={eser.id} className="flex items-center justify-between p-3 bg-zinc-50 border border-zinc-100 rounded-lg">
              <span className="text-sm font-medium text-zinc-800">{eser.title}</span>
              <div className="space-x-3 text-xs">
                <button 
                  onClick={() => handleEdit(eser)} 
                  className="text-blue-600 hover:underline"
                >
                  Düzenle
                </button>
                <button 
                  onClick={() => handleDelete(eser.id)} 
                  className="text-red-500 hover:underline"
                >
                  Sil
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}