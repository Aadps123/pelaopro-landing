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

interface Category {
  [key: string]: Keyword[] | SubCategory;
}

interface SubCategory {
  [key: string]: Keyword[] | NestedSubCategory;
}

interface NestedSubCategory {
  [key: string]: Keyword[];
}

const responses = {
  // Categoría principal: Saludos
  saludos: [
    {
      keywords: ['hola', 'como estas', 'buenas'],
      response: '¡Hola!😀 ¿En qué puedo ayudarte hoy?'
    }
  ],
  
  // Categoría principal: Información general de Pelao'Pro
  informacionGeneral: [
    {
      keywords: ['pelaopro', "pelao'pro", 'pelao pro', "pela'pro"],
      response: 'Bueno, Pelao\'Pro es proyecto nacido en la sexta edición del Laboratorio Latinoamericano de Acción Ciudadana. Este fue creado por 10 jóvenes de diferentes partes del país con el próposito de mejorar la competitividad en jóvenes de edades entre 16 a 18 años, brindando orientación educacional e laboral y desarrollo de habilidades blandas.'
    }
  ],
  
  // Categoría principal: Becas
  becas: {
    // Información general sobre becas
    general: [
      {
        keywords: ['becas general', 'tipos de becas', 'becas panama', 'beca' ],
        response: 'En Panamá, existen diversos tipos de becas, como las de excelencia académica, deportiva, cultural, apoyo económico y oportunidades internacionales. Organismos como IFARHU, SENACYT, embajadas y organizaciones internacionales ofrecen estas becas para estudios tanto en el país como en el extranjero, apoyando a estudiantes con distintos perfiles y necesidades.'
      }
    ],
    
    // Subcategoría: IFARHU
    ifarhu: {
      general: [
        {
          keywords: ['becas ifarhu', 'becas del ifarhu', 'ifarhu general', 'ifarhu', 'ifaru'],
          response: '🎓 El IFARHU ofrece becas como: Excelencia Académica 🏅, Concurso General 📋, Cultura 🎭, Deporte 🏃‍♂️, y Necesidad Económica 💰. También da préstamos para estudios universitarios en Panamá o el extranjero. Ejemplo: Beca de Excelencia para estudiantes con promedio de 4.5 o más.'
        }
      ],
      programas: [
        {
          keywords: ['beca excelencia ifarhu', 'excelencia académica ifarhu', 'excelencia ifarhu','excelencia académica','excelencia', 'beca excelencia','becas excelencia', 'becas exelencia académica'],
          response: '🏅 La Beca de Excelencia Académica del IFARHU se otorga a estudiantes con promedio de 4.5 o más. Ejemplo: Si sacas 4.6 en secundaria, puedes aplicar. Se necesita: boletas, cédula, matrícula y llenar formulario en línea. ¡Aplica cuando se abra la convocatoria anual! 📅'
        },
        {
          keywords: ['beca concurso ifarhu', 'concurso general ifarhu','beca por concurso', 'concurso'],
          response: '📝 La Beca por Concurso General del IFARHU es para estudiantes con buen rendimiento (4.5 o más). Participas en una competencia por puntaje académico. Requiere: boletas, cédula y aplicar en la plataforma cuando el concurso esté abierto. Ejemplo: estudiantes de 12° con buen historial escolar. 🎓'
        },
        {
          keywords: ['beca deportiva ifarhu', 'deporte ifarhu','deportes ifarhu', 'beca deportes', 'deportes'],
          response: '🏃‍♀️ El IFARHU da becas deportivas a jóvenes que compiten en deportes nacionales o internacionales. Requiere promedio mínimo (3.5 en secundaria, 1.0 en universidad) y certificados deportivos. Ejemplo: Un atleta que compite en natación y mantiene buen promedio. 🏊‍♂️'
        },
        {
          keywords: ['beca cultural ifarhu', 'cultura ifarhu', 'arte ifarhu', 'cultura'],
          response: '🎭 Si participas en teatro, danza, música u otra expresión artística, puedes aplicar a la Beca Cultural del IFARHU. Requiere participación activa, promedio aceptable y evidencias (fotos, certificados, etc.). Ejemplo: estudiante que baila folclore en eventos nacionales. 💃'
        },
        {
          keywords: ['beca necesidad económica ifarhu', 'beca por pobreza', 'necesidad económica ifarhu', 'necesidad'],
          response: '💰 IFARHU apoya a familias con bajos recursos. Solo necesitas demostrar la situación económica (comprobantes de ingresos), tener un promedio aceptable y estar matriculado. Ejemplo: estudiante con promedio de 4.2 y padres con salario mínimo. 🤝'
        },
        {
          keywords: ['becas internacionales ifarhu', 'becas fuera de panamá ifarhu'],
          response: '✈️ IFARHU también ofrece becas internacionales junto a SENACYT o embajadas. Ejemplo: Maestría en Japón 🇯🇵 (Beca MEXT) o Fulbright en EE.UU 🇺🇸. Debes tener título, buen promedio y dominio del idioma. 🗣️'
        }
      ],
      aplicacion: [
        {
          keywords: ['aplicar beca excelencia ifarhu', 'cómo aplicar beca excelencia ifarhu'],
          response: '🏅 Para aplicar a la Beca de Excelencia Académica del IFARHU debes:\n1️⃣ Tener promedio de 4.5 o más\n2️⃣ Subir boleta, matrícula y copia de cédula\n3️⃣ Llenar el formulario en línea en 👉 www.ifarhu.gob.pa (sección Convocatorias)\n📅 La convocatoria suele abrir entre febrero y marzo.'
        },
        {
          keywords: ['aplicar beca concurso ifarhu', 'cómo aplicar beca por concurso ifarhu'],
          response: '📝 Para aplicar a la Beca por Concurso del IFARHU:\n1️⃣ Tener promedio de 4.5 o más\n2️⃣ Subir boleta y matrícula\n3️⃣ Participar en el proceso del concurso cuando lo anuncien\n🔗 Entra a www.ifarhu.gob.pa y revisa la sección de Convocatorias.'
        },
        {
          keywords: ['aplicar beca deportiva ifarhu', 'cómo aplicar beca deportes ifarhu'],
          response: '🏃‍♂️ Para la Beca Deportiva del IFARHU necesitas:\n1️⃣ Promedio mínimo (3.5 secundaria / 1.0 universidad)\n2️⃣ Certificados de competencias deportivas\n3️⃣ Matrícula y cédula\n📩 Aplica en línea cuando se abra la convocatoria en www.ifarhu.gob.pa'
        },
        {
          keywords: ['aplicar beca cultural ifarhu', 'cómo aplicar beca cultura ifarhu'],
          response: '🎭 ¿Eres artista? Aplica así a la Beca Cultural IFARHU:\n1️⃣ Participar en música, danza, teatro, etc.\n2️⃣ Subir evidencia (fotos, certificados)\n3️⃣ Tener buen promedio\n🔗 Aplica en www.ifarhu.gob.pa cuando se abran las becas.'
        },
        {
          keywords: ['aplicar beca necesidad ifarhu', 'cómo aplicar beca por necesidad ifarhu'],
          response: '💰 Para la Beca por Necesidad Económica del IFARHU:\n1️⃣ Tener buen promedio (mínimo 3.5)\n2️⃣ Presentar comprobantes de ingresos bajos\n3️⃣ Subir cédula, matrícula y boleta\n📄 Postúlate en línea cuando la convocatoria esté activa en www.ifarhu.gob.pa'
        }
      ]
    },
    
    // Subcategoría: SENACYT
    senacyt: {
      general: [
        {
          keywords: ['becas senacyt general', 'senacyt general', 'becas de ciencia', 'becas tecnología', 'senacyt', 'becas senacyt'],
          response: '🔬 SENACYT ofrece becas en áreas STEM (Ciencia, Tecnología, Ingeniería y Matemáticas). Ejemplos: Beca de Maestría en Inteligencia Artificial en España 🤖, Beca de Doctorado en Biotecnología 🌱.'
        }
      ],
      programas: [
        {
          keywords: ['beca senacyt maestría inteligencia artificial', 'beca maestría ia senacyt', 'maestría ia senacyt', 'maestría inteligencia artificial','maestría senacyt','maestria','maestría'],
          response: '🤖 Para aplicar a la Beca de Maestría en Inteligencia Artificial de SENACYT:\n1️⃣ Tener título universitario relacionado (Ingeniería, Ciencias, etc.)\n2️⃣ Buen índice académico\n3️⃣ Carta de aceptación de la universidad en España\n4️⃣ Postular en la convocatoria oficial de SENACYT en www.senacyt.gob.pa\n📅 Las convocatorias suelen abrir anualmente.'
        },
        {
          keywords: ['beca doctorado biotecnología senacyt', 'beca doctorado biotecnología', 'doctorado biotecnología senacyt','doctorado','doctorado senacyt','beca doctorados','becas doctorado','becas de doctorado', 'beca de doctorado'],
          response: '🌱 Para la Beca de Doctorado en Biotecnología SENACYT:\n1️⃣ Título de maestría en área relacionada\n2️⃣ Buen índice académico y experiencia investigativa\n3️⃣ Carta de aceptación de la universidad\n4️⃣ Aplicar en la convocatoria oficial en www.senacyt.gob.pa\n📅 Convocatorias abiertas periódicamente.'
        }
      ]
    },
    
    // Subcategoría: MEDUCA
    meduca: {
      general: [
        {
          keywords: ['becas meduca general', 'meduca general', 'meduca'],
          response: '📚 MEDUCA ofrece becas para estudiantes de primaria y secundaria en varias categorías incluyendo excelencia académica, deportes, cultura y necesidad económica. Las aplicaciones se realizan generalmente al inicio del año escolar a través del centro educativo.'
        }
      ],
      programas: [
        {
          keywords: ['beca meduca excelencia', 'excelencia académica meduca','excelencia meduca'],
          response: '🏅 Beca de Excelencia Académica MEDUCA:\n1️⃣ Promedio alto en primaria o secundaria\n2️⃣ Presentar boletas y matrícula\n3️⃣ Postular a través del centro educativo\n📅 Convocatorias al inicio del año escolar.'
        },
        {
          keywords: ['beca meduca necesidad', 'beca por necesidad meduca', 'necesidad'],
          response: '💰 Beca por Necesidad Económica MEDUCA:\n1️⃣ Situación económica vulnerable\n2️⃣ Presentar comprobantes de ingresos y boletas\n3️⃣ Solicitar en la escuela o centro educativo\n📅 Proceso al inicio del año escolar.'
        },
        {
          keywords: ['beca meduca deportiva', 'beca deportes meduca'],
          response: '🏃‍♀️ Beca Deportiva MEDUCA:\n1️⃣ Buen rendimiento académico y participación deportiva\n2️⃣ Presentar certificaciones deportivas y boletas\n3️⃣ Postular en la escuela\n📅 Al inicio del ciclo escolar.'
        },
        {
          keywords: ['beca meduca cultural', 'beca arte meduca','cultura meduca'],
          response: '🎨 Beca Cultural MEDUCA:\n1️⃣ Participación en actividades artísticas o culturales\n2️⃣ Presentar evidencia y buen rendimiento académico\n3️⃣ Solicitar en el centro educativo\n📅 Convocatoria anual al inicio del curso.'
        }
      ],
      aplicacion: [
        {
          keywords: ['aplicar beca meduca', 'cómo aplicar becas meduca'],
          response: '📚 Para aplicar a las becas de MEDUCA:\n1️⃣ Estar matriculado en primaria o secundaria\n2️⃣ Tener buen rendimiento académico o estar en situación vulnerable\n3️⃣ Presentar boletas de notas, matrícula y constancia de ingresos familiares\n4️⃣ Postular en la escuela o centro educativo donde estudias\n📅 El proceso se maneja principalmente a través del centro educativo al inicio del año escolar.'
        }
      ]
    },
    
    // Subcategoría: Embajadas
    embajadas: {
      general: [
        {
          keywords: ['becas embajadas general', 'becas internacionales general', 'becas por países general', 'becas emabajadas', 'embajadas'],
          response: '🌍 Las embajadas ofrecen becas completas para estudios en sus países. Ejemplo: Beca MEXT de Japón 🇯🇵, Fulbright de EE.UU 🇺🇸, Beca Eiffel de Francia 🇫🇷. Requiere buen promedio y dominio del idioma. ¡Infórmate en la embajada correspondiente! 📜'
        }
      ],
      paises: [
        {
          keywords: ['beca embajada japon', 'aplicar beca japon', 'becas japon', 'embajada japonesa', 'becas japonesas','becas de la embajada de japon'],
          response: '🎌 Para aplicar a becas de la Embajada de Japón:\n1️⃣ Revisa los programas de becas en la página oficial de la Embajada de Japón en Panamá\n2️⃣ Generalmente piden buen rendimiento académico y carta de motivación\n3️⃣ Aplicar en las fechas que indiquen en la convocatoria\n🔗 Más info en: https://www.pa.emb-japan.go.jp'
        },
        {
          keywords: ['beca embajada españa', 'aplicar beca españa', 'becas españa', 'embajada española', 'becas españolas','becas de la embajada de españa'], 
          response: '🇪🇸 Para becas de la Embajada de España:\n1️⃣ Consulta el programa "Becas MAEC-AECID" para estudios en España\n2️⃣ Requisitos incluyen buen promedio y carta de aceptación\n3️⃣ Postula en la web oficial de la AECID\n🔗 https://www.aecid.gob.es'
        },
        {
          keywords: ['beca embajada francia', 'aplicar beca francia', 'becas francia', 'embajada francesa', 'becas francesas','becas de la embajada de francia'],
          response: '🇫🇷 Becas de la Embajada de Francia:\n1️⃣ Programa "Becas Eiffel" para maestrías y doctorados\n2️⃣ Buen rendimiento académico y admisión en universidad francesa\n3️⃣ Postulaciones en el sitio oficial Campus France\n🔗 https://www.campusfrance.org'
        },
        {
          keywords: ['beca embajada canada', 'aplicar beca canada', 'becas canada', 'embajada canadiense', 'becas canadienses','becas de la embajada de canada'],
          response: '🍁 Becas de la Embajada de Canadá:\n1️⃣ Programa "Vanier Canada Graduate Scholarships" para posgrado\n2️⃣ Buen expediente académico y proyecto de investigación\n3️⃣ Aplicar en la página oficial del programa\n🔗 https://vanier.gc.ca'
        },
        {
          keywords: ['beca embajada estados unidos', 'aplicar beca eeuu', 'becas estados unidos', 'embajada estadounidense', 'becas estadounidenses','becas de la embajada de eeuu', "becas embajada de estados unidos"],
          response: '🇺🇸 Becas de la Embajada de EE.UU.:\n1️⃣ Programas como Fulbright para estudios de posgrado\n2️⃣ Buen desempeño académico y experiencia extracurricular\n3️⃣ Aplicar en la página oficial de la Embajada o Fulbright\n🔗 https://pa.usembassy.gov/es/education-culture-es/'
        },
        {
          keywords: ['beca embajada uk', 'aplicar beca reino unido', 'becas uk', 'embajada reino unido', 'becas británicas','becas de la embajada del reino unido'],  
          response: '🇬🇧 Becas de la Embajada del Reino Unido:\n1️⃣ Becas Chevening para maestrías\n2️⃣ Excelencia académica y liderazgo\n3️⃣ Postulación en la web oficial Chevening\n🔗 https://www.chevening.org'
        }
      ]
    },
    
    // Subcategoría: Universidades
    universidades: {
      general: [
        {
          keywords: ['becas universidades general', 'becas universitarias general', 'becas internas general'],
          response: '🏫 Las universidades como la UTP, USMA y la Universidad Latina ofrecen becas internas. Ejemplos: Beca Deportiva ⚽ en la USMA, Beca Académica 🎓 en la UTP para promedios sobresalientes.'
        }
      ],
      especificas: [
        {
          keywords: ['beca utp', 'becas utp', 'becas universidad tecnologica de panama', 'universidad tecnologica de panama', 'utp'],
          response: `🎓 Becas en la Universidad Tecnológica de Panamá (UTP):

1️⃣ Beca de Asistencia Económica:
- Requisitos: Necesidad económica comprobada y buen rendimiento académico.
- Cómo aplicar: Llenar formulario en línea y entregar documentos en la Dirección de Bienestar Estudiantil.

2️⃣ Beca por Excelencia Académica:
- Requisitos: Promedio mínimo 2.5 y estar matriculado.
- Cómo aplicar: Postularse en convocatorias abiertas por la UTP.

3️⃣ Beca de Mérito Cultural, Deportivo y Científico:
- Requisitos: Participación destacada en actividades extracurriculares representando a la UTP.
- Cómo aplicar: Presentar evidencias y cumplir con los requisitos específicos.

🔗 Más info: https://utp.ac.pa/asistencia-economica`
        },
        {
          keywords: ['beca unachi', 'becas unachi', 'beca universidad autonoma de chiriqui', 'unachi', 'universidad autonoma de chiriqui', 'universidad chiriqui' ],
          response: `🎓 Becas en la Universidad Autónoma de Chiriquí (UNACHI):

      1️⃣ Beca por Mérito Académico:
      - Requisitos: Promedio mínimo 3.7, cumplir con requisitos de admisión.
      - Cómo aplicar: Entregar solicitud y expedientes en la Oficina de Becas.
        
      2️⃣ Beca Social:
      - Requisitos: Comprobante de necesidad económica.
      - Cómo aplicar: Presentar documentos en Secretaría de Bienestar Universitario.
        
      🔗 Más info: https://www.unachi.ac.pa/assets/descargas/catalogo/ReglamentodeBecas.pdf`
        },
        {
          keywords: ['beca upanama', 'becas upanama', 'beca universidad panama privada', 'upanama', 'universidad panamá privada'],
          response: `🎓 Becas en la Universidad Latina de Panamá (ULATINA):

      1️⃣ Beca de Excelencia Académica:
      - Requisitos: Promedio mínimo 3.8, inscripción vigente.
      - Cómo aplicar: Postular a través del portal estudiantil o en la oficina de Becas.

      2️⃣ Beca por Necesidad Económica:
      - Requisitos: Documentos que acrediten situación económica.
      - Cómo aplicar: Solicitar en la Oficina de Becas con documentación requerida.

      🔗 Más info: https://www.ulatina.edu.pa/tenemos-una-beca-especial-para-ti/`
        }
      ],
      internacional: [
        {
          keywords: ['beca universidad extranjera', 'becas internacionales universidad', 'beca estudiar fuera', 'becas internacionales' ,'extranjero' ,'becas extranjeras'],
          response: `🌍 Becas para estudiar en el extranjero:

      1️⃣ Becas Fulbright:
      - Requisitos: Título universitario, buen promedio, dominio de inglés.
      - Cómo aplicar: Postular a través de la Embajada de EE.UU. en Panamá. 
        
      2️⃣ Becas Chevening (Reino Unido):
      - Requisitos: Experiencia laboral, título universitario, inglés avanzado.
      - Cómo aplicar: En https://www.chevening.org/apply/

      3️⃣ Becas Erasmus+ (Unión Europea):
      - Requisitos: Estar matriculado en universidad participante, buen rendimiento académico.
      - Cómo aplicar: Consultar con la oficina de relaciones internacionales de tu universidad.

      🔗 Más info: https://ec.europa.eu/programmes/erasmus-plus`
        }
      ]
    }
  },
  
  // Categoría principal: Concursos
  concursos: {
    general: [
      {
        keywords: ['concursos panama', 'concursos escolares', 'concursos juveniles', 'concursos educativos', 'concurso general'],
        response: '🏆 En Panamá existen concursos educativos, científicos, culturales y de emprendimiento para estudiantes de primaria, secundaria y universidad. Ejemplos: Concurso Nacional de Oratoria, Olimpiadas de Matemáticas, Ferias Científicas, INNOVA-NATION y más. Estos eventos promueven el talento joven y la creatividad.'
      }
    ],
    tipos: [
      {
        keywords: ['concurso nacional de oratoria', 'oratoria panamá', 'concursos de oratoria', 'oratoria'],
        response: '🗣️ El Concurso Nacional de Oratoria es uno de los eventos más importantes para jóvenes en Panamá. Pueden participar estudiantes de secundaria con buen rendimiento. Los ganadores reciben becas, viajes y reconocimiento nacional. Tema y reglas cambian cada año. 🇵🇦'
      },
      {
        keywords: ['olimpiadas de matemáticas', 'concurso de matemáticas panamá'],
        response: '🧮 Las Olimpiadas de Matemáticas en Panamá reúnen a estudiantes de todo el país para resolver problemas matemáticos de alto nivel. Existen categorías por edad y nivel escolar. Ganadores pueden representar a Panamá en concursos internacionales. ✨'
      },
      {
        keywords: ['feria científica meduca', 'concurso de ciencia panamá', 'feria científica escolar'],
        response: '🔬 La Feria Científica Nacional organizada por MEDUCA y SENACYT permite a estudiantes presentar proyectos científicos o tecnológicos. Se compite por nivel (primaria, premedia, media) y por regiones. Ganadores reciben premios y visibilidad. 🚀'
      },
      {
        keywords: ['innova-nation', 'concurso innova nation', 'emprendimiento escolar', 'innovanation'],
        response: '💡 INNOVA-NATION es un concurso intercolegial que promueve el emprendimiento y la sostenibilidad en jóvenes. Estudiantes crean proyectos innovadores y los presentan ante jurados. Hay premios por categoría, como impacto social, innovación y viabilidad. 🌱'
      },
      {
        keywords: ['concurso robótica panamá', 'competencia de robótica'],
        response: '🤖 En Panamá se realizan concursos de robótica escolar y universitaria, como el Robotic Challenge de SENACYT. Estudiantes programan robots para cumplir misiones. Se premian la innovación, precisión y diseño. Requiere conocimientos en STEM. ⚙️'
      },
      {
        keywords: ['concursos de arte panamá', 'concurso dibujo panamá', 'concursos culturales escolares'],
        response: '🎨 Panamá también organiza concursos de arte y cultura para estudiantes. Incluyen dibujo, pintura, escritura y danza. Participan escuelas públicas y privadas. Premios incluyen medallas, becas y exposición de obras. 🖌️'
      }
    ],
    participacion: [
      {
        keywords: ['cómo participar concursos panamá', 'participar concurso estudiantil', 'inscripción concursos escolares'],
        response: '📋 Para participar en concursos escolares en Panamá:\n1️⃣ Revisa convocatorias en la web de MEDUCA, SENACYT o tu colegio\n2️⃣ Cumple con requisitos como promedio mínimo o proyecto inscrito\n3️⃣ Llena formularios y entrega documentos\n📅 Muchos concursos abren convocatorias entre febrero y julio.'
      }
    ]
  }
};

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

function searchResponse(query: string): string {
  const lowerQuery = query.toLowerCase();
  
  // Check saludos
  for (const item of responses.saludos) {
    if (item.keywords.some(keyword => lowerQuery.includes(keyword))) {
      return item.response;
    }
  }
  
  // Check informacionGeneral
  for (const item of responses.informacionGeneral) {
    if (item.keywords.some(keyword => lowerQuery.includes(keyword))) {
      return item.response;
    }
  }
  
  // Check concursos
  if (['concurso', 'competencia', 'olimpiada', 'certamen'].some(word => lowerQuery.includes(word))) {
    for (const item of responses.concursos.general) {
      if (item.keywords.some(keyword => lowerQuery.includes(keyword))) {
        return item.response;
      }
    }
    
    for (const item of responses.concursos.tipos) {
      if (item.keywords.some(keyword => lowerQuery.includes(keyword))) {
        return item.response;
      }
    }
    
    for (const item of responses.concursos.participacion) {
      if (item.keywords.some(keyword => lowerQuery.includes(keyword))) {
        return item.response;
      }
    }
    
    return responses.concursos.general[0].response;
  }
  
  // Check becas - SECCIÓN MEJORADA
  if (['beca', 'becas', 'ifarhu', 'senacyt', 'meduca', 'embajada', 'universidad', 
       'utp', 'unachi', 'upanama', 'latina'].some(word => lowerQuery.includes(word))) {
    
    // 1. Becas de IFARHU - específicas primero
    if (lowerQuery.includes('ifarhu')) {
      // Primero intentamos encontrar una coincidencia en aplicación (más específico)
      for (const item of responses.becas.ifarhu.aplicacion) {
        if (item.keywords.some(keyword => lowerQuery.includes(keyword))) {
          return item.response;
        }
      }
      
      // Luego buscamos en programas (segundo más específico)
      for (const item of responses.becas.ifarhu.programas) {
        if (item.keywords.some(keyword => lowerQuery.includes(keyword))) {
          return item.response;
        }
      }
      
      // Finalmente, si no se encuentran coincidencias más específicas, usamos información general
      for (const item of responses.becas.ifarhu.general) {
        if (item.keywords.some(keyword => lowerQuery.includes(keyword))) {
          return item.response;
        }
      }
    }
    
    // 2. Becas de SENACYT - específicas primero
    if (lowerQuery.includes('senacyt')) {
      // Primero programas (más específico)
      for (const item of responses.becas.senacyt.programas) {
        if (item.keywords.some(keyword => lowerQuery.includes(keyword))) {
          return item.response;
        }
      }
      
      // Luego general
      for (const item of responses.becas.senacyt.general) {
        if (item.keywords.some(keyword => lowerQuery.includes(keyword))) {
          return item.response;
        }
      }
    }
    
    // 3. Becas de MEDUCA - específicas primero
    if (lowerQuery.includes('meduca')) {
      // Primero aplicación (más específico)
      for (const item of responses.becas.meduca.aplicacion) {
        if (item.keywords.some(keyword => lowerQuery.includes(keyword))) {
          return item.response;
        }
      }
      
      // Luego programas
      for (const item of responses.becas.meduca.programas) {
        if (item.keywords.some(keyword => lowerQuery.includes(keyword))) {
          return item.response;
        }
      }
      
      // Finalmente general
      for (const item of responses.becas.meduca.general) {
        if (item.keywords.some(keyword => lowerQuery.includes(keyword))) {
          return item.response;
        }
      }
    }
    
    // 4. Becas de Embajadas - específicas primero
    if (lowerQuery.includes('embajada') || lowerQuery.includes('becas') && (
        lowerQuery.includes('japon') || 
        lowerQuery.includes('españa') || 
        lowerQuery.includes('francia') || 
        lowerQuery.includes('canada') || 
        lowerQuery.includes('estados unidos') || 
        lowerQuery.includes('eeuu') ||
        lowerQuery.includes('uk') ||
        lowerQuery.includes('reino unido')
    )) {
      // Primero países específicos
      for (const item of responses.becas.embajadas.paises) {
        if (item.keywords.some(keyword => lowerQuery.includes(keyword))) {
          return item.response;
        }
      }
      
      // Luego general
      for (const item of responses.becas.embajadas.general) {
        if (item.keywords.some(keyword => lowerQuery.includes(keyword))) {
          return item.response;
        }
      }
    }
    
    // 5. Becas de Universidades - específicas primero
    if (lowerQuery.includes('universidad') || 
        lowerQuery.includes('utp') || 
        lowerQuery.includes('unachi') || 
        lowerQuery.includes('upanama') || 
        lowerQuery.includes('latina')) {
      
      // Primero universidades específicas
      for (const item of responses.becas.universidades.especificas) {
        if (item.keywords.some(keyword => lowerQuery.includes(keyword))) {
          return item.response;
        }
      }
      
      // Luego internacional
      for (const item of responses.becas.universidades.internacional) {
        if (item.keywords.some(keyword => lowerQuery.includes(keyword))) {
          return item.response;
        }
      }
      
      // Finalmente general
      for (const item of responses.becas.universidades.general) {
        if (item.keywords.some(keyword => lowerQuery.includes(keyword))) {
          return item.response;
        }
      }
    }
    
    // 6. CASO GENERAL - Solo después de verificar todas las opciones específicas
    for (const item of responses.becas.general) {
      if (item.keywords.some(keyword => lowerQuery.includes(keyword))) {
        return item.response;
      }
    }
  }
  
  return "Me podrías decir de cual tema en especifico quieres que te hable";
}

export default function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([
    { sender: 'bot', text: '¡Hola!👋 Soy el asistente virtual de Pelao\'Pro. Me especializo en brindarte información sobre becas y concursos' }
  ]);
  
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSend = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (input.trim() === '') return;
    
    const userMessage: Message = { sender: 'user', text: input.trim() };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);
    
    setTimeout(() => {
      const botResponse = searchResponse(input.trim());
      const botMessage: Message = {
        sender: 'bot',
        text: botResponse
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