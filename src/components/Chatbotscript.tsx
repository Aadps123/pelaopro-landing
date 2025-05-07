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
    maxWidth: '700px',
    height: '65vh',
    maxHeight: '600px',
    backgroundColor: '#1e1e1e',
    borderRadius: '10px',
    boxShadow: '0 0 20px rgba(0,0,0,0.5)',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    fontSize: '16px'
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
      keywords: ['hola', 'como estas', 'saludos'],
      response: '¡Hola! ¿En qué puedo ayudarte?'
    },
    {
      keywords: ["Pelao'Pro", 'pelaopro', 'pelao pro', 'pelapro', 'pela pro', 'PelaoPro'],
      response: "Pelao'Pro es un proyecto piloto del Laboratorio Latinoamericano de Acción Ciudadana (LLAC) que busca facilitar la orientación académica y laboral a jóvenes en situaciones de riesgo social. Este programa fue creado por 10 jóvenes del LLAC con el objetivo de guiar a otros jóvenes en su desarrollo personal y profesional."
    },
    {
      keywords: [
        'becas', 'becas en panamá', 'concursos en panamá', 'cómo aplicar a los concursos',
        'universidades', 'becas para universidades',
        'programas de estudio UTP', 'programas de estudio UP', 'programas de estudio UNACHI',
        'preparación examen UTP', 'admisión UP', 'admisión UNACHI'
      ],
      response: `Aquí tienes información separada por tema:
  
  Universidades: Puedes prepararte para ingresar a universidades como la UTP, UP y UNACHI mediante programas de estudio, guías y simulacros. Puedo darte más detalles de cada una si me lo pides.
  
  Becas: En Panamá existen becas ofrecidas por entidades como IFARHU, SENACYT y algunas fundaciones privadas. Hay becas por mérito, necesidad económica, deportes y más.
  
  Concursos: Hay concursos académicos que ofrecen becas como premio. También hay concursos del IFARHU y otras instituciones. Si quieres, puedo darte ejemplos específicos.
  
  Solo dime sobre qué quieres saber más: universidades, becas o concursos.`
    },
    // UNIVERSIDADES
    {
      keywords: ['utp', 'universidad tecnológica de panamá'],
      response: 'La Universidad Tecnológica de Panamá (UTP) ofrece una prueba de admisión con enfoque en matemáticas, español y lógica. Puedes prepararte con guías oficiales, simulacros y cursos de repaso. ¿Quieres que te muestre dónde encontrarlos?'
    },
    {
      keywords: ['up', 'universidad de panamá'],
      response: 'La Universidad de Panamá (UP) también tiene una prueba de admisión general. Puedes conseguir guías, temarios y videos en línea. ¿Te gustaría que te comparta un sitio confiable para estudiar?'
    },
    {
      keywords: ['unachi', 'universidad autónoma de chiriquí'],
      response: 'La UNACHI ofrece admisión mediante pruebas y entrevistas. El contenido varía por facultad. Hay cursos previos y guías disponibles. ¿Te interesa alguna carrera específica en la UNACHI?'
    },
    {
      keywords: ['guías UTP', 'preparación UTP', 'simulacros UTP'],
      response: 'Puedes prepararte para el examen de admisión de la UTP con las guías oficiales disponibles aquí: https://admision.utp.ac.pa. También puedes revisar simulacros y videos en YouTube buscando "Simulacro UTP Panamá".'
    },
    {
      keywords: ['guías UP', 'preparación UP', 'simulacros UP'],
      response: 'La Universidad de Panamá publica información sobre su prueba de admisión aquí: https://up.ac.pa/admisiones. Puedes buscar simulacros en YouTube o usar plataformas como Aprendo+ de Meduca.'
    },
    {
      keywords: ['guías UNACHI', 'preparación UNACHI', 'simulacros UNACHI'],
      response: 'UNACHI publica información sobre su admisión en este sitio: https://unachi.ac.pa. También puedes solicitar las guías directamente en sus redes sociales o la oficina de admisión.'
    },
    // BECAS
    {
      keywords: ['becas ifarhu', 'becas en panamá ifarhu'],
      response: 'El IFARHU ofrece becas por concurso, por necesidad económica, para estudios universitarios, deportivos y para el extranjero. Debes registrarte en línea y cumplir con los requisitos según el tipo de beca. ¿Quieres saber cómo aplicar?'
    },
    {
      keywords: ['postular beca IFARHU', 'requisitos IFARHU'],
      response: 'Para postularte a una beca del IFARHU, visita https://www.ifarhu.gob.pa/becas/ y selecciona el tipo de beca que te interesa. Debes registrarte, subir tus documentos y esperar las fechas de convocatoria.'
    },
    {
      keywords: ['senacyt', 'becas senacyt'],
      response: 'SENACYT da becas principalmente en áreas científicas y tecnológicas, incluyendo maestrías y doctorados en el extranjero. También apoya estudios técnicos y universitarios. ¿Quieres saber si hay convocatorias abiertas?'
    },
    {
      keywords: ['convocatoria SENACYT', 'becas SENACYT abiertas'],
      response: 'Puedes ver todas las convocatorias activas de SENACYT en este enlace: https://www.senacyt.gob.pa/convocatorias. Están enfocadas en ciencia, tecnología e innovación.'
    },
    {
      keywords: ['fundaciones becas', 'becas privadas'],
      response: 'Algunas fundaciones como Fundación Piero (https://www.fundacionpiero.org) y Fundación Casco Antiguo apoyan a jóvenes con becas educativas. Puedes seguirlas en redes sociales o visitar sus webs para aplicar.'
    },
    // CONCURSOS
    {
      keywords: ['concursos', 'concursos para becas', 'concursos educativos'],
      response: 'Hay concursos organizados por IFARHU, MEDUCA, SENACYT y fundaciones privadas donde puedes ganar becas o apoyos económicos. También existen olimpiadas académicas que premian con oportunidades. ¿Quieres que te dé un ejemplo actual?'
    },
    {
      keywords: ['concurso ifarhu 2025', 'beca por concurso ifarhu'],
      response: 'El Concurso General de IFARHU es una beca basada en mérito académico. Las convocatorias se publican en https://www.ifarhu.gob.pa y en sus redes sociales. Generalmente abren a inicios de cada año escolar.'
    },
    {
      keywords: ['olimpiadas académicas', 'concursos de ciencia panamá'],
      response: 'En Panamá se realizan olimpiadas de matemáticas, ciencias y tecnología a través del MEDUCA y SENACYT. Algunas dan becas o reconocimientos. Consulta https://www.educapanama.edu.pa o https://www.senacyt.gob.pa.'
    }
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