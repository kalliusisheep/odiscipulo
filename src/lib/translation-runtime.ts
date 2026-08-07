import type { AppLanguage } from "@/lib/i18n";

type TranslationEntry = readonly [string, string, string];

const ENTRIES: TranslationEntry[] = [
  ["Inicial", "Home", "Inicio"],
  ["Estudos", "Studies", "Estudios"],
  ["Bíblia", "Bible", "Biblia"],
  ["Feed", "Feed", "Feed"],
  ["Você", "You", "Tú"],
  ["Perfil", "Profile", "Perfil"],
  ["Comunidade", "Community", "Comunidad"],
  ["Mural", "Wall", "Mural"],
  ["Jogos", "Games", "Juegos"],
  ["Minha caminhada", "My journey", "Mi camino"],
  ["Meu perfil", "My profile", "Mi perfil"],
  ["Voltar", "Back", "Volver"],
  ["Fechar", "Close", "Cerrar"],
  ["Cancelar", "Cancel", "Cancelar"],
  ["Salvar", "Save", "Guardar"],
  ["Editar", "Edit", "Editar"],
  ["Excluir", "Delete", "Eliminar"],
  ["Apagar", "Delete", "Borrar"],
  ["Buscar", "Search", "Buscar"],
  ["Pesquisar", "Search", "Buscar"],
  ["Limpar", "Clear", "Limpiar"],
  ["Tentar novamente", "Try again", "Intentar de nuevo"],
  ["Recarregar", "Reload", "Recargar"],
  ["Continuar", "Continue", "Continuar"],
  ["Abrir", "Open", "Abrir"],
  ["Concluído", "Completed", "Completado"],
  ["Confirmar", "Confirm", "Confirmar"],
  ["Enviar", "Send", "Enviar"],
  ["Compartilhar", "Share", "Compartir"],
  ["Copiar", "Copy", "Copiar"],
  ["Copiado", "Copied", "Copiado"],
  ["Aceitar", "Accept", "Aceptar"],
  ["Recusar", "Decline", "Rechazar"],
  ["Convidar", "Invite", "Invitar"],
  ["Criar sala", "Create room", "Crear sala"],
  ["Iniciar partida", "Start game", "Iniciar partida"],
  ["Pronto", "Ready", "Listo"],
  ["Online", "Online", "En línea"],
  ["Offline", "Offline", "Desconectado"],
  ["Carregando…", "Loading…", "Cargando…"],
  ["Carregando comentários…", "Loading comments…", "Cargando comentarios…"],
  ["Nenhum resultado encontrado", "No results found", "No se encontraron resultados"],
  ["Nenhum amigo encontrado.", "No friends found.", "No se encontraron amigos."],
  ["Não foi possível carregar", "Could not load", "No se pudo cargar"],
  ["Não foi possível carregar a comparação", "Could not load the comparison", "No se pudo cargar la comparación"],
  ["Não foi possível criar a sala.", "Could not create the room.", "No se pudo crear la sala."],
  ["Esta página não carregou", "This page did not load", "Esta página no se cargó"],
  ["Algo inesperado aconteceu.", "Something unexpected happened.", "Ocurrió algo inesperado."],
  ["Page not found", "Page not found", "Página no encontrada"],
  ["The page you're looking for doesn't exist or has been moved.", "The page you're looking for doesn't exist or has been moved.", "La página que buscas no existe o se ha movido."],
  ["Voltar ao início", "Back to home", "Volver al inicio"],
  ["Preferências", "Preferences", "Preferencias"],
  ["Idioma", "Language", "Idioma"],
  ["Tema", "Theme", "Tema"],
  ["Português (Brasil)", "Portuguese (Brazil)", "Portugués (Brasil)"],
  ["Português", "Portuguese", "Portugués"],
  ["English", "English", "Inglés"],
  ["Espanhol", "Spanish", "Español"],
  ["Español", "Spanish", "Español"],
  ["Idioma do aplicativo", "App language", "Idioma de la aplicación"],
  ["Escolha o idioma dos menus e da leitura bíblica.", "Choose the language for menus and Bible reading.", "Elige el idioma de los menús y de la lectura bíblica."],
  ["Tema do aplicativo", "App theme", "Tema de la aplicación"],
  ["Escolha uma paleta confortável para toda a experiência.", "Choose a comfortable palette for the whole experience.", "Elige una paleta cómoda para toda la experiencia."],
  ["Branco", "White", "Blanco"],
  ["Cinza", "Gray", "Gris"],
  ["Preto", "Black", "Negro"],
  ["Rosa", "Pink", "Rosa"],
  ["Claro e arejado", "Light and airy", "Claro y aireado"],
  ["Neutro e confortável", "Neutral and comfortable", "Neutro y cómodo"],
  ["Escuro e imersivo", "Dark and immersive", "Oscuro e inmersivo"],
  ["Acolhedor e vibrante", "Warm and vibrant", "Acogedor y vibrante"],
  ["Versão da Bíblia", "Bible version", "Versión de la Biblia"],
  ["Minha Igreja", "My Church", "Mi Iglesia"],
  ["Lembrete de Devocional", "Devotional reminder", "Recordatorio devocional"],
  ["Conta protegida", "Protected account", "Cuenta protegida"],
  ["Sair da conta", "Sign out", "Cerrar sesión"],
  ["Escolher avatar", "Choose avatar", "Elegir avatar"],
  ["Selecionar avatar", "Select avatar", "Seleccionar avatar"],
  ["Trocar foto", "Change photo", "Cambiar foto"],
  ["Salvar ID", "Save ID", "Guardar ID"],
  ["Copiar ID", "Copy ID", "Copiar ID"],
  ["Editar ID", "Edit ID", "Editar ID"],
  ["Minhas Notas", "My Notes", "Mis notas"],
  ["Sobre mim", "About me", "Sobre mí"],
  ["Salvo automaticamente ao sair do campo", "Saved automatically when you leave the field", "Se guarda automáticamente al salir del campo"],
  ["Atalhos pessoais", "Personal shortcuts", "Atajos personales"],
  ["Desafie seus irmãos com personagens e histórias da Bíblia.", "Challenge your brothers and sisters with biblical characters and stories.", "Desafía a tus hermanos con personajes e historias de la Biblia."],
  ["Ranking da comunidade", "Community leaderboard", "Clasificación de la comunidad"],
  ["Veja pessoas próximas, convide amigos e acompanhe a caminhada juntos.", "See people nearby, invite friends and walk together.", "Mira a personas cercanas, invita amigos y caminen juntos."],
  ["Meus Irmãos", "My Brothers and Sisters", "Mis hermanos"],
  ["Encontre seus irmãos e continue a conversa.", "Find your brothers and sisters and keep the conversation going.", "Encuentra a tus hermanos y continúa la conversación."],
  ["Conte um pouco sobre sua caminhada com Cristo…", "Tell us a little about your walk with Christ…", "Cuéntanos un poco sobre tu camino con Cristo…"],
  ["Bíblia de Estudos", "Study Bible", "Biblia de estudio"],
  ["Leia, marque e aprofunde cada passagem", "Read, save, and explore every passage", "Lee, guarda y profundiza en cada pasaje"],
  ["Pesquisar em toda a Bíblia", "Search the whole Bible", "Buscar en toda la Biblia"],
  ["Busque livro, referência ou frase", "Search for a book, reference, or phrase", "Busca un libro, referencia o frase"],
  ["Busque um livro, palavra ou frase", "Search for a book, word, or phrase", "Busca un libro, palabra o frase"],
  ["Tradução", "Translation", "Traducción"],
  ["Antigo Testamento", "Old Testament", "Antiguo Testamento"],
  ["Novo Testamento", "New Testament", "Nuevo Testamento"],
  ["Todos os livros", "All books", "Todos los libros"],
  ["Escolha um livro para ver seus capítulos", "Choose a book to see its chapters", "Elige un libro para ver sus capítulos"],
  ["Escolha o capítulo", "Choose a chapter", "Elige el capítulo"],
  ["Capítulo", "Chapter", "Capítulo"],
  ["Capítulos", "Chapters", "Capítulos"],
  ["Versículo", "Verse", "Versículo"],
  ["Versículos", "Verses", "Versículos"],
  ["Livro", "Book", "Libro"],
  ["Livros", "Books", "Libros"],
  ["Lido", "Read", "Leído"],
  ["Não lido", "Unread", "No leído"],
  ["Meus marcadores", "My bookmarks", "Mis marcadores"],
  ["Continuar de onde parou", "Continue where you left off", "Continúa donde lo dejaste"],
  ["Comece sua leitura hoje", "Start your reading today", "Comienza tu lectura hoy"],
  ["Escolha um livro abaixo e marque seu primeiro capítulo.", "Choose a book below and mark your first chapter.", "Elige un libro abajo y marca tu primer capítulo."],
  ["Progresso completo", "Complete progress", "Progreso completo"],
  ["Toda leitura conta", "Every reading counts", "Cada lectura cuenta"],
  ["Resultados da busca", "Search results", "Resultados de búsqueda"],
  ["Limpar busca", "Clear search", "Limpiar búsqueda"],
  ["Tente outra palavra, referência ou expressão.", "Try another word, reference, or phrase.", "Prueba otra palabra, referencia o expresión."],
  ["Comparar versões", "Compare versions", "Comparar versiones"],
  ["Estudo comparativo", "Comparative study", "Estudio comparativo"],
  ["Versões selecionadas", "Selected versions", "Versiones seleccionadas"],
  ["Você pode comparar até três versões. Mantenha pelo menos duas selecionadas.", "You can compare up to three versions. Keep at least two selected.", "Puedes comparar hasta tres versiones. Mantén al menos dos seleccionadas."],
  ["Carregando versões…", "Loading versions…", "Cargando versiones…"],
  ["Nenhum texto disponível para comparar neste capítulo.", "No text is available to compare in this chapter.", "No hay texto disponible para comparar en este capítulo."],
  ["Análise da palavra", "Word analysis", "Análisis de la palabra"],
  ["Sentidos possíveis", "Possible meanings", "Posibles sentidos"],
  ["Sentido", "Meaning", "Sentido"],
  ["Uso nas Escrituras", "Use in Scripture", "Uso en las Escrituras"],
  ["Ocorrências", "Occurrences", "Ocurrencias"],
  ["Ver ocorrências", "View occurrences", "Ver ocurrencias"],
  ["Referências encontradas", "References found", "Referencias encontradas"],
  ["Primeira ocorrência", "First occurrence", "Primera ocurrencia"],
  ["Última ocorrência", "Last occurrence", "Última ocurrencia"],
  ["Primeira vez", "First time", "Primera vez"],
  ["Última vez", "Last time", "Última vez"],
  ["Fechar seletor de capítulos", "Close chapter picker", "Cerrar selector de capítulos"],
  ["Abrir esta passagem no modo de estudo", "Open this passage in study mode", "Abrir este pasaje en modo de estudio"],
  ["Conexão", "Connection", "Conexión"],
  ["Palavras relacionadas", "Related words", "Palabras relacionadas"],
  ["Transliteração indisponível", "Transliteration unavailable", "Transliteración no disponible"],
  ["Pronúncia aproximada", "Approximate pronunciation", "Pronunciación aproximada"],
  ["Ouvir pronúncia", "Listen to pronunciation", "Escuchar pronunciación"],
  ["Nenhum verbete disponível", "No entry available", "No hay entrada disponible"],
  ["Nenhuma referência encontrada", "No reference found", "No se encontraron referencias"],
  ["Planos", "Plans", "Planes"],
  ["Bíblicos", "Bible studies", "Bíblicos"],
  ["Meditação IA", "AI meditation", "Meditación IA"],
  ["Planos de leitura", "Reading plans", "Planes de lectura"],
  ["Começar plano", "Start plan", "Comenzar plan"],
  ["Continuar plano", "Continue plan", "Continuar plan"],
  ["Leitura do dia", "Today's reading", "Lectura del día"],
  ["Passagem", "Passage", "Pasaje"],
  ["Contexto", "Context", "Contexto"],
  ["Reflexão devocional", "Devotional reflection", "Reflexión devocional"],
  ["Aplicação prática", "Practical application", "Aplicación práctica"],
  ["Oração", "Prayer", "Oración"],
  ["Marcar como concluído", "Mark as completed", "Marcar como completado"],
  ["passagem", "passage", "pasaje"],
  ["passagens", "passages", "pasajes"],
  ["Carregando passagem…", "Loading passage…", "Cargando pasaje…"],
  ["Sua caminhada", "Your journey", "Tu camino"],
  ["Nova anotação", "New note", "Nueva anotación"],
  ["Anotações pessoais", "Personal notes", "Notas personales"],
  ["Guarde insights, orações e aprendizados da sua caminhada.", "Save insights, prayers, and lessons from your journey.", "Guarda ideas, oraciones y aprendizajes de tu camino."],
  ["Criar primeira nota", "Create first note", "Crear la primera nota"],
  ["Nota pessoal", "Personal note", "Nota personal"],
  ["Buscar nas suas notas…", "Search your notes…", "Busca en tus notas…"],
  ["Buscar por título ou conteúdo…", "Search by title or content…", "Buscar por título o contenido…"],
  ["Sem título", "Untitled", "Sin título"],
  ["Salvar às", "Saved at", "Guardado a las"],
  ["Escreva uma anotação…", "Write a note…", "Escribe una nota…"],
  ["Compartilhe sua caminhada", "Share your journey", "Comparte tu camino"],
  ["Uma reflexão, conquista ou motivo de gratidão", "A reflection, achievement, or reason for gratitude", "Una reflexión, logro o motivo de gratitud"],
  ["Adicione uma reação", "Add a reaction", "Añade una reacción"],
  ["Publicar", "Post", "Publicar"],
  ["Agora na comunidade", "Now in the community", "Ahora en la comunidad"],
  ["Últimas atividades", "Latest activity", "Últimas actividades"],
  ["Compartilhe seu clamor", "Share your prayer request", "Comparte tu petición de oración"],
  ["A comunidade pode orar com você", "The community can pray with you", "La comunidad puede orar contigo"],
  ["ou envie por voz", "or send by voice", "o envía por voz"],
  ["Pedir oração", "Ask for prayer", "Pedir oración"],
  ["Ore com alguém", "Pray with someone", "Ora con alguien"],
  ["Pedidos da comunidade", "Community prayer requests", "Peticiones de la comunidad"],
  ["Respondido", "Answered", "Respondido"],
  ["Seu caderno de caminhada", "Your journey journal", "Tu cuaderno de camino"],
  ["Um espaço pessoal para rever aprendizados e perceber seu crescimento.", "A personal space to revisit lessons and notice your growth.", "Un espacio personal para revisar aprendizajes y notar tu crecimiento."],
  ["Sua história", "Your story", "Tu historia"],
  ["Reflexões salvas", "Saved reflections", "Reflexiones guardadas"],
  ["Abrir comentários", "Open comments", "Abrir comentarios"],
  ["Remover GIF", "Remove GIF", "Eliminar GIF"],
  ["Enviar comentário", "Send comment", "Enviar comentario"],
  ["Texto da publicação", "Post text", "Texto de la publicación"],
  ["Pedido de oração", "Prayer request", "Petición de oración"],
  ["Editar resposta", "Edit reply", "Editar respuesta"],
  ["Apagar resposta", "Delete reply", "Borrar respuesta"],
  ["Sua comunidade está começando", "Your community is just beginning", "Tu comunidad está comenzando"],
  ["Nenhum pedido por aqui ainda", "No requests here yet", "Todavía no hay peticiones aquí"],
  ["Seu diário está aguardando", "Your journal is waiting", "Tu diario está esperando"],
  ["Mensagens", "Messages", "Mensajes"],
  ["Nova mensagem", "New message", "Nuevo mensaje"],
  ["Nenhuma conversa ainda", "No conversations yet", "Aún no hay conversaciones"],
  ["Adicione um irmão(ã) pelo ID e comece a trocar palavras de fé, oração e desafio.", "Add a brother or sister by ID and start sharing words of faith, prayer, and challenge.", "Añade a un hermano por ID y empieza a compartir palabras de fe, oración y desafío."],
  ["Adicionar irmão(ã)", "Add brother or sister", "Añadir hermano"],
  ["Buscar irmão(ã)…", "Search brother or sister…", "Buscar hermano…"],
  ["Iniciar conversa", "Start conversation", "Iniciar conversación"],
  ["Novo contato", "New contact", "Nuevo contacto"],
  ["Buscar pelo ID do seu irmão(ã)…", "Search by your brother's or sister's ID…", "Busca por el ID de tu hermano…"],
  ["Você ainda não tem contatos", "You don't have contacts yet", "Aún no tienes contactos"],
  ["Como encontrar o ID", "How to find the ID", "Cómo encontrar el ID"],
  ["Conversa", "Conversation", "Conversación"],
  ["Escreva uma mensagem…", "Write a message…", "Escribe un mensaje…"],
  ["Toque para ver o perfil", "Tap to view profile", "Toca para ver el perfil"],
  ["Último acesso indisponível", "Last seen unavailable", "Último acceso no disponible"],
  ["Juntos na fé", "Together in faith", "Juntos en la fe"],
  ["Mentor IA", "AI Mentor", "Mentor IA"],
  ["Histórico salvo · não substitui o cuidado pastoral", "History saved · does not replace pastoral care", "Historial guardado · no sustituye el cuidado pastoral"],
  ["refletindo…", "thinking…", "reflexionando…"],
  ["Você pode escrever ou enviar uma mensagem de voz para Barnabéé.", "You can type or send a voice message to Barnabéé.", "Puedes escribir o enviar un mensaje de voz a Barnabéé."],
  ["Pergunte sobre um versículo, dúvida ou tema…", "Ask about a verse, question, or topic…", "Pregunta sobre un versículo, duda o tema…"],
  ["Abrir Barnabéé, Mentor IA (arraste para mover)", "Open Barnabéé, AI Mentor (drag to move)", "Abrir Barnabéé, Mentor IA (arrastra para mover)"],
  ["Enviar mensagem", "Send message", "Enviar mensaje"],
  ["Convite", "Invitation", "Invitación"],
  ["Uma partida está começando", "A game is starting", "Está comenzando una partida"],
  ["Entre na sala, confirme que está pronto e dispute um desafio bíblico em tempo real.", "Join the room, mark yourself ready, and compete in a real-time Bible challenge.", "Entra en la sala, confirma que estás listo y compite en un desafío bíblico en tiempo real."],
  ["Sala com até quatro jogadores", "Room with up to four players", "Sala de hasta cuatro jugadores"],
  ["Aprenda, relembre e desafie seus irmãos com experiências baseadas na Bíblia.", "Learn, remember, and challenge your brothers and sisters with Bible-based experiences.", "Aprende, recuerda y desafía a tus hermanos con experiencias basadas en la Biblia."],
  ["Escolha um desafio", "Choose a challenge", "Elige un desafío"],
  ["Conteúdo revisado com referências bíblicas.", "Content reviewed with Bible references.", "Contenido revisado con referencias bíblicas."],
  ["Quem é o personagem?", "Who is the character?", "¿Quién es el personaje?"],
  ["Qual é o versículo?", "Which verse is it?", "¿Cuál es el versículo?"],
  ["Palavras cruzadas", "Crossword", "Crucigrama"],
  ["Quiz do milhão", "Bible challenge", "Desafío bíblico"],
  ["Uma pausa que edifica", "A pause that builds you up", "Una pausa que edifica"],
  ["Single Player", "Single Player", "Un jugador"],
  ["Multiplayer", "Multiplayer", "Multijugador"],
  ["Escolha como jogar", "Choose how to play", "Elige cómo jugar"],
  ["Dificuldade", "Difficulty", "Dificultad"],
  ["Rodadas", "Rounds", "Rondas"],
  ["Fácil", "Easy", "Fácil"],
  ["Médio", "Medium", "Medio"],
  ["Difícil", "Hard", "Difícil"],
  ["Bereano Supremo", "Supreme Berean", "Bereano Supremo"],
  ["Começar desafio", "Start challenge", "Comenzar desafío"],
  ["Entrar na arena", "Enter the arena", "Entrar en la arena"],
  ["Descubra pela pista :)", "Guess from the clue :)", "Descubre por la pista :)"],
  ["Pista inicial", "Starting clue", "Pista inicial"],
  ["Desbloqueie mais pistas", "Unlock more clues", "Desbloquea más pistas"],
  ["Revelar", "Reveal", "Revelar"],
  ["Sua resposta", "Your answer", "Tu respuesta"],
  ["Digite o nome do personagem", "Type the character's name", "Escribe el nombre del personaje"],
  ["Digite e confirme.", "Type and confirm.", "Escribe y confirma."],
  ["Pontos", "Points", "Puntos"],
  ["Pontuação", "Score", "Puntuación"],
  ["Rodada", "Round", "Ronda"],
  ["Erros", "Mistakes", "Errores"],
  ["Dicas usadas", "Hints used", "Pistas usadas"],
  ["Tempo", "Time", "Tiempo"],
  ["Combo", "Streak", "Racha"],
  ["Acertou!", "Correct!", "¡Correcto!"],
  ["Você acertou!", "You got it right!", "¡Acertaste!"],
  ["Resposta correta", "Correct answer", "Respuesta correcta"],
  ["Fim de jogo", "Game over", "Fin del juego"],
  ["Resultado final", "Final result", "Resultado final"],
  ["Jogar novamente", "Play again", "Jugar de nuevo"],
  ["Voltar aos jogos", "Back to games", "Volver a los juegos"],
  ["Sala de desafio", "Challenge room", "Sala de desafío"],
  ["Limite da sala", "Room limit", "Límite de la sala"],
  ["jogadores", "players", "jugadores"],
  ["Jogo selecionado", "Selected game", "Juego seleccionado"],
  ["Lobby sincronizado", "Synchronized lobby", "Sala sincronizada"],
  ["Jogadores:", "Players:", "Jugadores:"],
  ["Compartilhar convite", "Share invitation", "Compartir invitación"],
  ["Convite pendente", "Invitation pending", "Invitación pendiente"],
  ["Convidar amigos", "Invite friends", "Invitar amigos"],
  ["vagas", "spots", "plazas"],
  ["Buscar amigo", "Search friend", "Buscar amigo"],
  ["Enviado", "Sent", "Enviado"],
  ["Confirmar pronto", "Mark ready", "Confirmar que estás listo"],
  ["Você está pronto", "You are ready", "Estás listo"],
  ["Todos os jogadores presentes precisam confirmar que estão prontos.", "All present players must confirm that they are ready.", "Todos los jugadores presentes deben confirmar que están listos."],
  ["O host pode iniciar com no mínimo dois jogadores.", "The host can start with at least two players.", "El anfitrión puede iniciar con al menos dos jugadores."],
  ["Ranking", "Leaderboard", "Clasificación"],
  ["Ranking dos jogos", "Game leaderboard", "Clasificación de juegos"],
  ["Todos os jogadores do app, com ou sem amizade.", "All app players, friends or not.", "Todos los jugadores de la app, sean amigos o no."],
  ["Milhão", "Challenge", "Desafío"],
  ["Personagem", "Character", "Personaje"],
  ["Versículo", "Verse", "Versículo"],
  ["Cruzadas", "Crossword", "Crucigrama"],
  ["Ainda não há partidas registradas neste jogo.", "No games have been recorded for this game yet.", "Todavía no hay partidas registradas en este juego."],
  ["Compartilhar resultado", "Share result", "Compartir resultado"],
  ["Adicionar irmão", "Add brother or sister", "Añadir hermano"],
  ["de", "of", "de"],
  ["e", "and", "y"],
  ["ou", "or", "o"],
  ["para", "for", "para"],
  ["Lições", "Lessons", "Lecciones"],
  ["Nível atual", "Current level", "Nivel actual"],
  ["Sequência", "Streak", "Racha"],
  ["Tempo de estudo", "Study time", "Tiempo de estudio"],
  ["Experiência total", "Total experience", "Experiencia total"],
  ["Aprofundar", "Go deeper", "Profundizar"],
  ["Fixar", "Pin", "Fijar"],
  ["Aplicar", "Apply", "Aplicar"],
  ["Ocultar", "Hide", "Ocultar"],
  ["Mostrar", "Show", "Mostrar"],
  ["Próximo", "Next", "Siguiente"],
  ["Anterior", "Previous", "Anterior"],
  ["Voltar ao perfil", "Back to profile", "Volver al perfil"],
  ["Liderança", "Leadership", "Liderazgo"],
  ["Modo Líder", "Leader Mode", "Modo líder"],
  ["Painel da igreja", "Church dashboard", "Panel de la iglesia"],
  ["Adicionar discípulo", "Add disciple", "Añadir discípulo"],
  ["Novo grupo", "New group", "Nuevo grupo"],
  ["Mensagem", "Message", "Mensaje"],
  ["Encontro", "Meeting", "Encuentro"],
  ["Árvore de Discipulado", "Discipleship tree", "Árbol de discipulado"],
  ["Seus discípulos", "Your disciples", "Tus discípulos"],
  ["Grupos de Discipulado", "Discipleship groups", "Grupos de discipulado"],
];

const aliases: Record<string, TranslationEntry> = {};
for (const entry of ENTRIES) {
  aliases[entry[0]] = entry;
  aliases[entry[1]] = entry;
  aliases[entry[2]] = entry;
}

const dynamicPatterns: Array<{
  pattern: RegExp;
  render: (match: RegExpMatchArray, language: AppLanguage) => string;
}> = [
  {
    pattern: /^Jogadores:\s*(\d+)\s*de\s*(\d+)$/,
    render: (match, language) =>
      language === "en"
        ? "Players: " + match[1] + " of " + match[2]
        : language === "es"
          ? "Jugadores: " + match[1] + " de " + match[2]
          : match[0],
  },
  {
    pattern: /^(\d+)\s+vagas$/,
    render: (match, language) =>
      language === "en" ? match[1] + " spots" : language === "es" ? match[1] + " plazas" : match[0],
  },
  {
    pattern: /^Rodada\s+(\d+)\/(\d+)$/,
    render: (match, language) =>
      language === "en" ? "Round " + match[1] + "/" + match[2] : language === "es" ? "Ronda " + match[1] + "/" + match[2] : match[0],
  },
  {
    pattern: /^Dia\s+(\d+)$/,
    render: (match, language) =>
      language === "en" ? "Day " + match[1] : language === "es" ? "Día " + match[1] : match[0],
  },
  {
    pattern: /^Nível\s+(\d+)$/,
    render: (match, language) =>
      language === "en" ? "Level " + match[1] : language === "es" ? "Nivel " + match[1] : match[0],
  },
  {
    pattern: /^(\d+)\s+dias$/,
    render: (match, language) =>
      language === "en" ? match[1] + " days" : language === "es" ? match[1] + " días" : match[0],
  },
  {
    pattern: /^há cerca de\s+(.+)$/,
    render: (match, language) =>
      language === "en" ? "about " + match[1] + " ago" : language === "es" ? "hace aproximadamente " + match[1] : match[0],
  },
  {
    pattern: /^(.+)\s+convidou você para uma partida bíblica\.$/,
    render: (match, language) =>
      language === "en" ? match[1] + " invited you to a Bible game." : language === "es" ? match[1] + " te invitó a una partida bíblica." : match[0],
  },
  {
    pattern: /^(\d+)\s+de\s+(\d+)\s+capítulos$/,
    render: (match, language) =>
      language === "en" ? match[1] + " of " + match[2] + " chapters" : language === "es" ? match[1] + " de " + match[2] + " capítulos" : match[0],
  },
];

function targetFor(entry: TranslationEntry, language: AppLanguage): string {
  if (language === "en") return entry[1];
  if (language === "es") return entry[2];
  return entry[0];
}

function translateValue(value: string, language: AppLanguage): { source: string; value: string } | null {
  const normalized = value.replace(/\s+/g, " ").trim();
  if (!normalized) return null;
  const entry = aliases[normalized];
  if (entry) return { source: entry[0], value: targetFor(entry, language) };
  for (const item of dynamicPatterns) {
    const match = normalized.match(item.pattern);
    if (match) return { source: normalized, value: item.render(match, language) };
  }
  return null;
}

const sourceByNode = new WeakMap<Text, string>();
const renderedByNode = new WeakMap<Text, string>();
const sourceByAttribute = new WeakMap<Element, Map<string, { source: string; rendered: string }>>();

function preserveWhitespace(original: string, translated: string): string {
  const leading = original.match(/^\s*/)?.[0] ?? "";
  const trailing = original.match(/\s*$/)?.[0] ?? "";
  return leading + translated + trailing;
}

function translateTextNode(node: Text, language: AppLanguage) {
  const raw = node.nodeValue ?? "";
  const normalized = raw.replace(/\s+/g, " ").trim();
  if (!normalized || normalized.length > 180) return;
  const lastRendered = renderedByNode.get(node);
  const source = lastRendered && normalized === lastRendered ? sourceByNode.get(node) ?? normalized : normalized;
  const translated = translateValue(source, language);
  if (!translated) return;
  const next = preserveWhitespace(raw, translated.value);
  if (next !== raw) node.nodeValue = next;
  sourceByNode.set(node, translated.source);
  renderedByNode.set(node, translated.value);
}

function translateAttribute(element: Element, attribute: string, language: AppLanguage) {
  const current = element.getAttribute(attribute);
  if (!current) return;
  let state = sourceByAttribute.get(element);
  if (!state) {
    state = new Map();
    sourceByAttribute.set(element, state);
  }
  const previous = state.get(attribute);
  const source = previous && current === previous.rendered ? previous.source : current;
  const translated = translateValue(source, language);
  if (!translated) return;
  if (current !== translated.value) element.setAttribute(attribute, translated.value);
  state.set(attribute, { source: translated.source, rendered: translated.value });
}

function walkAndTranslate(language: AppLanguage) {
  if (typeof document === "undefined" || !document.body) return;
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let node: Node | null = walker.nextNode();
  while (node) {
    const textNode = node as Text;
    const parent = textNode.parentElement;
    if (parent && !["SCRIPT", "STYLE", "NOSCRIPT"].includes(parent.tagName)) {
      translateTextNode(textNode, language);
    }
    node = walker.nextNode();
  }
  document.body.querySelectorAll<HTMLElement>("[placeholder], [aria-label], [title], [alt]").forEach((element) => {
    translateAttribute(element, "placeholder", language);
    translateAttribute(element, "aria-label", language);
    translateAttribute(element, "title", language);
    translateAttribute(element, "alt", language);
  });
}

export function startTranslationRuntime(language: AppLanguage): () => void {
  if (typeof window === "undefined" || typeof document === "undefined") return () => undefined;
  let scheduled = false;
  let translating = false;
  const run = () => {
    if (translating) return;
    translating = true;
    walkAndTranslate(language);
    translating = false;
  };
  const observer = new MutationObserver(() => {
    if (scheduled) return;
    scheduled = true;
    window.queueMicrotask(() => {
      scheduled = false;
      run();
    });
  });
  run();
  observer.observe(document.body, {
    childList: true,
    subtree: true,
    characterData: true,
    attributes: true,
    attributeFilter: ["placeholder", "aria-label", "title"],
  });
  return () => observer.disconnect();
}
