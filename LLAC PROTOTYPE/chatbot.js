const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(express.static("public")); 

if (!fs.existsSync("public")) {
  fs.mkdirSync("public");
}
//Búsqueda de la Database
if (!fs.existsSync("data.json")) {
  const initialData = [
    {
      "keywords": ["hola", "saludos", "buenos días", "buenos dias", "buenas"],
      "response": "¡Hola! ¿En qué puedo ayudarte hoy?"
    },
    {
      "keywords": ["gracias", "agradecido", "te lo agradezco"],
      "response": "¡De nada! Estoy aquí para ayudar."
    },
    {
      "keywords": ["adios", "adiós", "hasta luego", "chao", "nos vemos"],
      "response": "¡Chao! Ha sido un placer ayudarte."
    },
    {
      "keywords": ["ayuda", "puedes hacer", "funciones"],
      "response": "Puedo responder preguntas simples basadas en palabras clave relacionado a Pelao'Pro y la educación en Panamá. ¡Prueba preguntándome algo!"
    },
    {
      "keywords": ["Pelao", "Qué es PelaoPro", "pelaopro" , "que es pelaopro", "PelaoPro","pelao´pro", "pela´o pro","pela´opro"],
      "response": "​Pelao'Pro es un proyecto piloto del Laboratorio Latinoamericano de Acción Ciudadana (LLAC) que busca facilitar la orientación académica y laboral a jóvenes en situaciones de riesgo social. Este programa fue creado por 10 jóvenes del LLAC con el objetivo de guiar a otros jóvenes en su desarrollo personal y profesional. "
    },
  
  ];
  fs.writeFileSync("data.json", JSON.stringify(initialData, null, 2), "utf8");
}

//Parser de la Database
const data = JSON.parse(fs.readFileSync("data.json", "utf8"));

const htmlContent = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Chatbot</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 0;
      background-color: #121212;
      color: #e0e0e0;
      height: 100vh;
      overflow: hidden;
    }
    .chat-container {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 90%;
      max-width: 700px;
      height: 80vh;
      max-height: 600px;
      background-color: #1e1e1e;
      border-radius: 10px;
      box-shadow: 0 0 20px rgba(0,0,0,0.5);
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }
    .chat-messages {
      flex: 1;
      padding: 20px;
      overflow-y: auto;
    }
    .message {
      margin-bottom: 15px;
      padding: 10px 15px;
      border-radius: 18px;
      max-width: 70%;
      word-wrap: break-word;
    }
    .user-message {
      background-color: #2979ff;
      color: white;
      margin-left: auto;
      border-bottom-right-radius: 5px;
    }
    .bot-message {
      background-color: #333333;
      color: #e0e0e0;
      margin-right: auto;
      border-bottom-left-radius: 5px;
    }
    .chat-input {
      display: flex;
      padding: 15px;
      background-color: #252525;
      border-top: 1px solid #444;
    }
    #message-input {
      flex: 1;
      padding: 10px;
      border: 1px solid #444;
      border-radius: 20px;
      outline: none;
      background-color: #333;
      color: #e0e0e0;
    }
    #send-button {
      background-color: #2979ff;
      color: white;
      border: none;
      border-radius: 20px;
      padding: 10px 20px;
      margin-left: 10px;
      cursor: pointer;
    }
    #send-button:hover {
      background-color: #2962ff;
    }
    ::placeholder {
      color: #888;
    }
  </style>
</head>
<body>
  <div class="chat-container">
    <div class="chat-messages" id="chat-messages">
      <div class="message bot-message">¡Hola! Soy el asistente virtual de Pelao'Pro. ¿En qué puedo ayudarte hoy?</div>
    </div>
    <div class="chat-input">
      <input type="text" id="message-input" placeholder="Escribe tu mensaje aquí...">
      <button id="send-button">Enviar</button>
    </div>
  </div>

  <script>
    const messageInput = document.getElementById('message-input');
    const sendButton = document.getElementById('send-button');
    const chatMessages = document.getElementById('chat-messages');

    function addMessage(message, isUser) {
      const messageElement = document.createElement('div');
      messageElement.classList.add('message');
      messageElement.classList.add(isUser ? 'user-message' : 'bot-message');
      messageElement.textContent = message;
      chatMessages.appendChild(messageElement);
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    async function sendMessage() {
      const message = messageInput.value.trim();
      if (message === '') return;

      addMessage(message, true);
      messageInput.value = '';

      try {
        const response = await fetch('/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ message })
        });

        if (!response.ok) {
          throw new Error('Error en la respuesta del servidor');
        }

        const data = await response.json();
        
        setTimeout(() => {
          addMessage(data.reply, false);
        }, 500); 
      } catch (error) {
        console.error('Error:', error);
        addMessage('Lo siento, ha ocurrido un error al procesar tu mensaje.', false);
      }
    }

    // Eventos
    sendButton.addEventListener('click', sendMessage);
    messageInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        sendMessage();
      }
    });
    
    // loading
    //red de voluntariado en escuelas, plan de estudio a cad clase, blandas, certificado por curso. linkedin learning
//issue población
//indicador de crecimiento
//registro de estudiantes
//segmetar test
//post test only for the late
    window.onload = function() {
      messageInput.focus();
    };
  </script>
</body>

</html>
`

fs.writeFileSync("public/index.html", htmlContent, "utf8");

app.post("/chat", (req, res) => {
  const { message } = req.body;
  const response = findResponse(message);
  res.json({ reply: response });
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

function findResponse(userInput) {
  userInput = userInput.toLowerCase().trim();

  for (let item of data) {
    for (let keyword of item.keywords) {
      const regex = new RegExp(`\\b${keyword}\\b`, "i"); 
      if (regex.test(userInput)) {
        return item.response;
      }
    }
  }

  return "Ups, no entiendo tu pregunta. ¿Podrías reformularla?";
}

app.listen(PORT, () => {
  console.log(`Woking http://localhost:${PORT}`);
});
