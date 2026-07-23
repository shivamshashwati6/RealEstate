import { create } from 'zustand';
import type { ChatMessage, UserProfile, Property } from '../types';
import { StorageEngine } from '../services/storage';

interface ChatState {
  isChatOpen: boolean;
  activeConversationId: string | null;
  activePartner: UserProfile | null;
  activeProperty: Property | null;
  messages: ChatMessage[];
  unreadCount: number;
  
  openChatWithSeller: (seller: UserProfile, property?: Property | null) => void;
  closeChat: () => void;
  loadConversation: (conversationId: string) => void;
  sendMessage: (senderId: string, receiverId: string, text: string, imageUrl?: string) => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  isChatOpen: false,
  activeConversationId: null,
  activePartner: null,
  activeProperty: null,
  messages: [],
  unreadCount: 1,

  openChatWithSeller: (seller, property = null) => {
    const currentUserId = 'usr_buyer_1';
    const conversationId = `conv_${currentUserId}_${seller.id}_${property ? property.id : 'general'}`;
    const msgs = StorageEngine.getMessages(conversationId);

    set({
      isChatOpen: true,
      activeConversationId: conversationId,
      activePartner: seller,
      activeProperty: property,
      messages: msgs,
    });
  },

  closeChat: () => {
    set({ isChatOpen: false });
  },

  loadConversation: (conversationId) => {
    set({
      activeConversationId: conversationId,
      messages: StorageEngine.getMessages(conversationId),
    });
  },

  sendMessage: (senderId, receiverId, text, imageUrl) => {
    const { activeConversationId, activeProperty } = get();
    if (!activeConversationId) return;

    const newMsg = StorageEngine.sendMessage({
      conversationId: activeConversationId,
      senderId,
      receiverId,
      propertyId: activeProperty?.id,
      message: text,
      imageUrl,
    });

    set((state) => ({
      messages: [...state.messages, newMsg],
    }));

    if (receiverId === 'usr_seller_1' || receiverId === 'usr_seller_2') {
      setTimeout(() => {
        const reply = StorageEngine.sendMessage({
          conversationId: activeConversationId,
          senderId: receiverId,
          receiverId: senderId,
          propertyId: activeProperty?.id,
          message: `Thank you for your message! I've received your request regarding ${activeProperty?.title || 'the property'}. Let me know if you would like to arrange a site visit or view additional disclosures.`,
        });

        if (get().activeConversationId === activeConversationId) {
          set((state) => ({
            messages: [...state.messages, reply],
          }));
        }
      }, 1500);
    }
  },
}));
