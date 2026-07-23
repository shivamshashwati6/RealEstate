import React, { useState } from 'react';
import { useChatStore } from '../../store/useChatStore';
import { useAuthStore } from '../../store/useAuthStore';
import { X, Send, Image as ImageIcon, CheckCheck, Building2 } from 'lucide-react';

export const ChatDrawer: React.FC = () => {
  const { isChatOpen, activePartner, activeProperty, messages, closeChat, sendMessage } = useChatStore();
  const { currentUser } = useAuthStore();

  const [inputMessage, setInputMessage] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [showImageInput, setShowImageInput] = useState(false);

  if (!isChatOpen || !activePartner) return null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() && !imageUrl.trim()) return;

    sendMessage(
      currentUser.id,
      activePartner.id,
      inputMessage,
      imageUrl.trim() || undefined
    );

    setInputMessage('');
    setImageUrl('');
    setShowImageInput(false);
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 max-w-md w-full bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col animate-slideLeft">
      <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={activePartner.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80'}
              alt={activePartner.name}
              className="w-10 h-10 rounded-full object-cover border border-slate-700"
            />
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-slate-950 rounded-full" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white leading-tight">{activePartner.name}</h4>
            <span className="text-[10px] text-emerald-400 font-medium">Online • Verified Consultant</span>
          </div>
        </div>

        <button
          onClick={closeChat}
          className="p-2 rounded-xl text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {activeProperty && (
        <div className="bg-slate-950/80 px-4 py-2.5 border-b border-slate-800 flex items-center gap-3">
          <img
            src={activeProperty.images[0]}
            alt={activeProperty.title}
            className="w-10 h-10 rounded-lg object-cover"
          />
          <div className="flex-1 min-w-0">
            <span className="block text-[10px] text-slate-400 uppercase font-semibold">Inquiry Regarding</span>
            <h5 className="text-xs font-bold text-white truncate">{activeProperty.title}</h5>
            <span className="text-emerald-400 text-[11px] font-extrabold">${activeProperty.price.toLocaleString()}</span>
          </div>
        </div>
      )}

      <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-900/60">
        {messages.length === 0 ? (
          <div className="text-center py-12 space-y-2">
            <Building2 className="w-10 h-10 text-slate-700 mx-auto" />
            <p className="text-xs text-slate-400">No previous messages. Type below to start real-time chat with {activePartner.name}.</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.senderId === currentUser.id;
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[82%] p-3 rounded-2xl text-xs space-y-1.5 shadow-md ${
                    isMe
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-br-none'
                      : 'bg-slate-800 text-slate-200 rounded-bl-none border border-slate-700'
                  }`}
                >
                  {msg.imageUrl && (
                    <img
                      src={msg.imageUrl}
                      alt="Attachment"
                      className="w-full max-h-48 object-cover rounded-xl border border-white/20 mb-1"
                    />
                  )}
                  <p className="leading-relaxed">{msg.message}</p>
                </div>
                <div className="flex items-center gap-1 mt-1 text-[10px] text-slate-500">
                  <span>{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  {isMe && <CheckCheck className="w-3.5 h-3.5 text-emerald-400" />}
                </div>
              </div>
            );
          })
        )}
      </div>

      {showImageInput && (
        <div className="p-3 bg-slate-950 border-t border-slate-800 flex gap-2">
          <input
            type="url"
            placeholder="Paste image attachment URL..."
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="flex-1 bg-slate-900 text-xs text-white px-3 py-1.5 rounded-xl border border-slate-800"
          />
          <button
            type="button"
            onClick={() => setShowImageInput(false)}
            className="text-xs text-slate-400 hover:text-white px-2"
          >
            Cancel
          </button>
        </div>
      )}

      <form onSubmit={handleSend} className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2">
        <button
          type="button"
          onClick={() => setShowImageInput(!showImageInput)}
          className="p-2 rounded-xl text-slate-400 hover:text-emerald-400 hover:bg-slate-900 transition-colors"
          title="Attach Photo"
        >
          <ImageIcon className="w-5 h-5" />
        </button>

        <input
          type="text"
          placeholder={`Message ${activePartner.name.split(' ')[0]}...`}
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          className="flex-1 bg-slate-900 text-xs text-white px-3.5 py-2.5 rounded-xl border border-slate-800 focus:border-emerald-500 focus:outline-none"
        />

        <button
          type="submit"
          className="p-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold transition-all shadow-md"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
