import React, { useState, useRef, useEffect } from 'react';
type CSSProperties = React.CSSProperties;

interface Message {
  sender: 'user' | 'bot';
  text: string;
}

interface Keyword {
  keywords: string[]; 
  response: string;
}

const styles = {
  container: {
    fontFamily: 'Arial, sans-serif',
    margin: 0,
    padding: 0,
    backgroundColor: '#121212',
    color: '#e0e0e0',
    height: '100vh',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  chatWindow: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '90%',
    maxWidth: '500px',
    height: '65vh',
    maxHeight: '600px',
    backgroundColor: '#1e1e1e',
    borderRadius: '10px',
    boxShadow: '0 0 20px rgba(0,0,0,0.5)',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    fontSize: '12px'
  },
  header: {
    padding: '12px',
    backgroundColor: '#4a5568',
    color: 'white',
    fontWeight: '500',
    textAlign: 'center' as const
  },
  messagesContainer: {
    flex: 1,
    padding: '15px',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    scrollbarWidth: 'none',
    msOverflowStyle: 'none',
    '&::-webkit-scrollbar': {
      display: 'none'
    }
  },
  messageRow: {
    marginBottom: '15px',
    display: 'flex'
  },
  userMessageRow: {
    justifyContent: 'flex-end'
  },
  botMessageRow: {
    justifyContent: 'flex-start'
  },
  messageBubble: {
    padding: '8px 15px',
    borderRadius: '18px',
    maxWidth: '70%',
    wordWrap: 'break-word' as const
  },
  userMessage: {
    backgroundColor: '#2979ff',
    width: '300px',
    color: 'white',
    marginLeft: 'auto',
    borderBottomRightRadius: '5px'
  },
  botMessage: {
    backgroundColor: '#333333',
    color: '#e0e0e0',
    marginRight: 'auto',
    borderBottomLeftRadius: '5px'
  },
  inputArea: {
    display: 'flex',
    padding: '10px',
    backgroundColor: '#252525',
    borderTop: '1px solid #444'
  },
  input: {
    flex: 1,
    padding: '10px',
    border: '1px solid #444',
    borderRadius: '20px',
    outline: 'none',
    backgroundColor: '#333',
    color: '#e0e0e0'
  },
  sendButton: {
    backgroundColor: '#2979ff',
    color: 'white',
    border: 'none',
    borderRadius: '20px',
    padding: '10px 20px',
    marginLeft: '10px',
    cursor: 'pointer',
    ':hover': {
      backgroundColor: '#2962ff'
    }
  },
  typingIndicator: {
    display: 'flex',
    justifyContent: 'center',
    gap: '4px'
  },
  typingDot: {
    width: '8px',
    height: '8px',
    backgroundColor: '#a0aec0',
    borderRadius: '50%',
    animation: 'bounce 1.4s infinite ease-in-out'
  }
} as const;

export default function Chatbot() {
  const keywords: Keyword[] = [
    { 
      keywords: ['hola', 'pelaopro', 'saludos'], 
      response: '¡Hola! ¿En qué puedo ayudarte?' 
    },
  ];

  const [messages, setMessages] = useState<Message[]>([
    { sender: 'bot', text: '¡Hola! Soy el asistente virtual de Pelao\'Pro. ¿En qué puedo ayudarte hoy?' }
  ]);
  
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSend = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (input.trim() === '') return;
    
    const currentInput = input.trim().toLowerCase();
    const userMessage: Message = { sender: 'user', text: input.trim() };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);
    
    setTimeout(() => {
      const keywordMatch = keywords.find(k => 
        k.keywords.some(keyword => currentInput.includes(keyword.toLowerCase()))
      );
      
      const botMessage: Message = {
        sender: 'bot',
        text: keywordMatch 
          ? keywordMatch.response 
          : 'Lo siento, no entendí tu mensaje. ¿Podrías reformularlo?'
      };
      
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 700);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const getTypingDotStyle = (delay: number): CSSProperties => ({
    ...styles.typingDot,
    animationDelay: `${delay}s`
  });

  return (
    <div style={styles.container}>
      <div style={styles.chatWindow}>
        
        <div style={styles.messagesContainer}>
          {messages.map((msg, index) => (
            <div 
              key={index} 
              style={{
                ...styles.messageRow,
                ...(msg.sender === 'user' ? styles.userMessageRow : styles.botMessageRow)
              }}
            >
              <div 
                style={{
                  ...styles.messageBubble,
                  ...(msg.sender === 'user' ? styles.userMessage : styles.botMessage)
                }}
              >
                {msg.text}
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div style={styles.botMessageRow}>
              <div style={{...styles.messageBubble, ...styles.botMessage}}>
                <div style={styles.typingIndicator}>
                  <div style={getTypingDotStyle(0)}></div>
                  <div style={getTypingDotStyle(0.2)}></div>
                  <div style={getTypingDotStyle(0.4)}></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
        
        <form onSubmit={handleSend} style={styles.inputArea}>
          <input 
            type="text" 
            value={input} 
            onChange={(e) => setInput(e.target.value)} 
            onKeyDown={handleKeyDown}
            placeholder="Escribe tu mensaje aquí..." 
            style={styles.input}
          />
          <button 
            type="submit"
            style={styles.sendButton}
          >
            Enviar
          </button>
        </form>
      </div>
      
      <style>
        {`
          @keyframes bounce {
            0%, 80%, 100% { 
              transform: translateY(0);
            }
            40% { 
              transform: translateY(-5px);
            }
          }
        `}
      </style>
    </div>
  );
}