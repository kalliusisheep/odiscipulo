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
  ["Você pode escrever ou enviar uma mensagem de voz para Barnabé.", "You can type or send a voice message to Barnabas.", "Puedes escribir o enviar un mensaje de voz a Bernabé."],
  ["Pergunte sobre um versículo, dúvida ou tema…", "Ask about a verse, question, or topic…", "Pregunta sobre un versículo, duda o tema…"],
  ["Abrir Barnabé, Mentor IA (arraste para mover)", "Open Barnabas, AI Mentor (drag to move)", "Abrir Bernabé, Mentor IA (arrastra para mover)"],
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
  ["Quiz do milhão", "Million quiz", "Quiz del millón"],
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
  ["Milhão", "Million", "Millón"],
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
  ["Gênesis", "Genesis", "Génesis"],
  ["Êxodo", "Exodus", "Éxodo"],
  ["Levítico", "Leviticus", "Levítico"],
  ["Números", "Numbers", "Números"],
  ["Deuteronômio", "Deuteronomy", "Deuteronomio"],
  ["Josué", "Joshua", "Josué"],
  ["Juízes", "Judges", "Jueces"],
  ["Rute", "Ruth", "Rut"],
  ["1 Samuel", "1 Samuel", "1 Samuel"],
  ["2 Samuel", "2 Samuel", "2 Samuel"],
  ["1 Reis", "1 Kings", "1 Reyes"],
  ["2 Reis", "2 Kings", "2 Reyes"],
  ["1 Crônicas", "1 Chronicles", "1 Crónicas"],
  ["2 Crônicas", "2 Chronicles", "2 Crónicas"],
  ["Esdras", "Ezra", "Esdras"],
  ["Neemias", "Nehemiah", "Nehemías"],
  ["Ester", "Esther", "Ester"],
  ["Jó", "Job", "Job"],
  ["Salmos", "Psalms", "Salmos"],
  ["Provérbios", "Proverbs", "Proverbios"],
  ["Eclesiastes", "Ecclesiastes", "Eclesiastés"],
  ["Cânticos", "Song of Songs", "Cantares"],
  ["Isaías", "Isaiah", "Isaías"],
  ["Jeremias", "Jeremiah", "Jeremías"],
  ["Lamentações", "Lamentations", "Lamentaciones"],
  ["Ezequiel", "Ezekiel", "Ezequiel"],
  ["Daniel", "Daniel", "Daniel"],
  ["Oseias", "Hosea", "Oseas"],
  ["Joel", "Joel", "Joel"],
  ["Amós", "Amos", "Amós"],
  ["Obadias", "Obadiah", "Abdías"],
  ["Jonas", "Jonah", "Jonás"],
  ["Miqueias", "Micah", "Miqueas"],
  ["Naum", "Nahum", "Nahúm"],
  ["Habacuque", "Habakkuk", "Habacuc"],
  ["Sofonias", "Zephaniah", "Sofonías"],
  ["Ageu", "Haggai", "Hageo"],
  ["Zacarias", "Zechariah", "Zacarías"],
  ["Malaquias", "Malachi", "Malaquías"],
  ["Mateus", "Matthew", "Mateo"],
  ["Marcos", "Mark", "Marcos"],
  ["Lucas", "Luke", "Lucas"],
  ["João", "John", "Juan"],
  ["Atos", "Acts", "Hechos"],
  ["Romanos", "Romans", "Romanos"],
  ["1 Coríntios", "1 Corinthians", "1 Corintios"],
  ["2 Coríntios", "2 Corinthians", "2 Corintios"],
  ["Gálatas", "Galatians", "Gálatas"],
  ["Efésios", "Ephesians", "Efesios"],
  ["Filipenses", "Philippians", "Filipenses"],
  ["Colossenses", "Colossians", "Colosenses"],
  ["1 Tessalonicenses", "1 Thessalonians", "1 Tesalonicenses"],
  ["2 Tessalonicenses", "2 Thessalonians", "2 Tesalonicenses"],
  ["1 Timóteo", "1 Timothy", "1 Timoteo"],
  ["2 Timóteo", "2 Timothy", "2 Timoteo"],
  ["Tito", "Titus", "Tito"],
  ["Filemom", "Philemon", "Filemón"],
  ["Hebreus", "Hebrews", "Hebreos"],
  ["Tiago", "James", "Santiago"],
  ["1 Pedro", "1 Peter", "1 Pedro"],
  ["2 Pedro", "2 Peter", "2 Pedro"],
  ["1 João", "1 John", "1 Juan"],
  ["2 João", "2 John", "2 Juan"],
  ["3 João", "3 John", "3 Juan"],
  ["Judas", "Jude", "Judas"],
  ["Apocalipse", "Revelation", "Apocalipsis"],
  ["Descubra personagens bíblicos usando quatro pistas da Palavra.", "Discover Bible characters using four clues from Scripture.", "Descubre personajes bíblicos usando cuatro pistas de la Palabra."],
  ["Reconheça o contexto e encontre a passagem certa.", "Recognize the context and find the right passage.", "Reconoce el contexto y encuentra el pasaje correcto."],
  ["Memória e contexto", "Memory and context", "Memoria y contexto"],
  ["Precisão e sequência", "Accuracy and streak", "Precisión y racha"],
  ["Meus marcadores bíblicos — Disciple", "My Bible bookmarks — Disciple", "Mis marcadores bíblicos — Disciple"],
  ["Seus destaques, anotações, favoritos e marcadores da Bíblia de Estudos.", "Your highlights, notes, favorites, and bookmarks from the Study Bible.", "Tus destacados, notas, favoritos y marcadores de la Biblia de Estudio."],
  ["Destaques, anotações, favoritos e marcadores reunidos.", "Highlights, notes, favorites, and bookmarks in one place.", "Destacados, notas, favoritos y marcadores reunidos."],
  ["Nenhuma anotação ainda", "No notes yet", "Aún no hay notas"],
  ["Suas reflexões salvas aparecerão nesta seção.", "Your saved reflections will appear here.", "Tus reflexiones guardadas aparecerán aquí."],
  ["Marque versículos importantes para encontrá-los rapidamente.", "Bookmark important verses to find them quickly.", "Marca versículos importantes para encontrarlos rápidamente."],
  ["Crie um marcador ao estudar um capítulo da Bíblia.", "Create a bookmark while studying a Bible chapter.", "Crea un marcador al estudiar un capítulo de la Biblia."],
  ["Não foi possível copiar.", "Could not copy.", "No se pudo copiar."],
  ["Máximo!", "Maximum!", "¡Máximo!"],
  ["Nível", "Level", "Nivel"],
  ["Posição", "Rank", "Posición"],
  ["ID inválido. Use letras, números, ponto ou underline (3-24 caracteres).", "Invalid ID. Use letters, numbers, dots, or underscores (3–24 characters).", "ID no válido. Usa letras, números, puntos o guiones bajos (3–24 caracteres)."],
  ["Esse ID já está em uso. Escolha outro.", "This ID is already in use. Choose another.", "Este ID ya está en uso. Elige otro."],
  ["Não foi possível adicionar este discípulo.", "Could not add this disciple.", "No se pudo añadir a este discípulo."],
  ["O grupo foi criado, mas não foi possível incluir todos os membros.", "The group was created, but not all members could be added.", "El grupo se creó, pero no fue posible añadir a todos los miembros."],
  ["Não foi possível criar o grupo.", "Could not create the group.", "No se pudo crear el grupo."],
  ["Informe o título e a data do encontro.", "Enter the meeting title and date.", "Indica el título y la fecha del encuentro."],
  ["Não foi possível agendar o encontro.", "Could not schedule the meeting.", "No se pudo programar el encuentro."],
  ["Voltar para a página inicial", "Back to the home page", "Volver a la página de inicio"],
  ["Você ainda não possui contatos adicionados.", "You do not have any contacts yet.", "Todavía no tienes contactos añadidos."],
  ["Ex.: Homens firmes na fé", "E.g. Men firm in faith", "Ej.: Hombres firmes en la fe"],
  ["Nenhum usuário encontrado com este ID.", "No user found with this ID.", "No se encontró ningún usuario con este ID."],
  ["seu líder", "your leader", "tu líder"],
  ["irmão", "brother", "hermano"],
  ["Você alcançou o nível máximo", "You reached the maximum level", "Has alcanzado el nivel máximo"],
  ["Escute o que Deus tem falado ao seu coração e escreva devagar…", "Listen to what God has been speaking to your heart and write slowly…", "Escucha lo que Dios ha estado hablando a tu corazón y escribe despacio…"],
  ["Como ser um líder", "How to be a leader", "Cómo ser un líder"],
  ["Uma formação inédita para liderar à maneira de Cristo.", "A new training path for leading like Christ.", "Una formación inédita para liderar a la manera de Cristo."],
  ["Não foi possível salvar seu progresso.", "Could not save your progress.", "No se pudo guardar tu progreso."],
  ["Conteúdo concluído e progresso atualizado.", "Content completed and progress updated.", "Contenido completado y progreso actualizado."],
  ["Versículo do dia — Disciple", "Verse of the day — Disciple", "Versículo del día — Disciple"],
  ["O versículo do dia, para refletir e compartilhar o evangelho.", "The verse of the day, to reflect on and share the gospel.", "El versículo del día, para reflexionar y compartir el evangelio."],
  ["Imagem salva! Agora é só compartilhar onde quiser.", "Image saved! Now share it wherever you like.", "¡Imagen guardada! Ahora compártela donde quieras."],
  ["Erro ao compartilhar versículo:", "Error sharing verse:", "Error al compartir el versículo:"],
  ["Não foi possível preparar o compartilhamento. Tente novamente.", "Could not prepare sharing. Try again.", "No se pudo preparar el contenido para compartir. Inténtalo de nuevo."],
  ["Ir para a passagem na Bíblia de Estudos", "Go to the passage in the Study Bible", "Ir al pasaje en la Biblia de Estudio"],
  ["GIF enviado no comentário", "GIF sent in comment", "GIF enviado en el comentario"],
  ["Escreva um comentário…", "Write a comment…", "Escribe un comentario…"],
  ["Lição não encontrada.", "Lesson not found.", "No se encontró la lección."],
  ["Não é essa.", "Not this one.", "No es esta."],
  ["Escreva livremente… (sua resposta vai para o Feed → Meu Diário)", "Write freely… (your answer goes to Feed → My Diary)", "Escribe libremente… (tu respuesta irá a Feed → Mi diario)"],
  ["Você:", "You:", "Tú:"],
  ["Nova Versão Internacional", "New International Version", "Nueva Versión Internacional"],
  ["Tradução moderna e de leitura fluida", "Modern translation with smooth reading", "Traducción moderna y de lectura fluida"],
  ["Equilíbrio entre fidelidade e clareza", "Balance between faithfulness and clarity", "Equilibrio entre fidelidad y claridad"],
  ["Tradução clássica e formal", "Classic and formal translation", "Traducción clásica y formal"],
  ["Nova Versão Transformadora", "New Transforming Version", "Nueva Versión Transformadora"],
  ["Linguagem contemporânea e acessível", "Contemporary and accessible language", "Lenguaje contemporáneo y accesible"],
  ["Este dispositivo não oferece notificações push.", "This device does not support push notifications.", "Este dispositivo no admite notificaciones push"],
  ["As notificações push ainda não estão configuradas.", "Push notifications are not configured yet.", "Las notificaciones push aún no están configuradas."],
  ["Permita as notificações do navegador para ativar o lembrete.", "Allow browser notifications to activate the reminder.", "Permite las notificaciones del navegador para activar el recordatorio."],
  ["Lembrete ativado! Você receberá avisos às 06h e às 20h.", "Reminder enabled! You will receive alerts at 6 AM and 8 PM.", "¡Recordatorio activado! Recibirás avisos a las 06:00 y a las 20:00."],
  ["Não foi possível atualizar as notificações neste dispositivo.", "Could not update notifications on this device.", "No se pudieron actualizar las notificaciones en este dispositivo."],
  ["ID inválido (3–24 caracteres: letras, números, . ou _).", "Invalid ID (3–24 characters: letters, numbers, . or _).", "ID no válido (3–24 caracteres: letras, números, . o _)."],
  ["Esse ID já está em uso.", "This ID is already in use.", "Este ID ya está en uso."],
  ["Cancelar edição", "Cancel editing", "Cancelar edición"],
  ["Não vinculado a uma igreja", "Not linked to a church", "No vinculado a una iglesia"],
  ["Você receberá avisos às 06h e às 20h.", "You will receive alerts at 6 AM and 8 PM.", "Recibirás avisos a las 06:00 y a las 20:00."],
  ["Receba um aviso diário para não perder a Palavra.", "Get a daily reminder so you do not miss the Word.", "Recibe un recordatorio diario para no perderte la Palabra."],
  ["Não foi possível carregar suas anotações.", "Could not load your notes.", "No se pudieron cargar tus notas."],
  ["Não foi possível criar a anotação agora.", "Could not create the note right now.", "No se pudo crear la nota ahora."],
  ["Sua primeira nota começa aqui", "Your first note starts here", "Tu primera nota comienza aquí"],
  ["Tente buscar por outra palavra ou título.", "Try searching for another word or title.", "Intenta buscar otra palabra o título."],
  ["Registre uma ideia, uma oração ou algo que Deus falou ao seu coração.", "Record an idea, a prayer, or something God spoke to your heart.", "Registra una idea, una oración o algo que Dios habló a tu corazón."],
  ["Comece a escrever sua reflexão…", "Start writing your reflection…", "Comienza a escribir tu reflexión…"],
  ["Não foi possível carregar essa anotação.", "Could not load this note.", "No se pudo cargar esta nota."],
  ["Escreva algo primeiro para a IA sugerir um título.", "Write something first so the AI can suggest a title.", "Escribe algo primero para que la IA sugiera un título."],
  ["Não foi possível gerar um título agora.", "Could not generate a title right now.", "No se pudo generar un título ahora."],
  ["Não foi possível concluir essa ação de IA agora.", "Could not complete this AI action right now.", "No se pudo completar esta acción de IA ahora."],
  ["Sugestão aplicada.", "Suggestion applied.", "Sugerencia aplicada."],
  ["Anotação excluída.", "Note deleted.", "Nota eliminada."],
  ["Não foi possível excluir a anotação.", "Could not delete the note.", "No se pudo eliminar la nota."],
  ["Não foi possível gerar o PDF agora.", "Could not generate the PDF right now.", "No se pudo generar el PDF ahora."],
  ["Não foi possível compartilhar. Tente baixar o PDF.", "Could not share. Try downloading the PDF.", "No se pudo compartir. Intenta descargar el PDF."],
  ["Escreva aqui seu título", "Write your title here", "Escribe aquí tu título"],
  ["Seu navegador não suporta compartilhamento direto de arquivos — baixe o PDF abaixo.", "Your browser does not support direct file sharing — download the PDF below.", "Tu navegador no admite compartir archivos directamente — descarga el PDF abajo."],
  ["Compartilhe sua jornada e celebre cada passo de fé.", "Share your journey and celebrate every step of faith.", "Comparte tu camino y celebra cada paso de fe."],
  ["Orações", "Prayers", "Oraciones"],
  ["Mural de oração", "Prayer wall", "Mural de oración"],
  ["Divida seus pedidos e sustente outras pessoas em oração.", "Share your requests and support others in prayer.", "Comparte tus peticiones y apoya a otros en oración."],
  ["Meu Diário", "My Diary", "Mi diario"],
  ["Espaço pessoal", "Personal space", "Espacio personal"],
  ["Publicação", "Post", "Publicación"],
  ["Lição concluída", "Lesson completed", "Lección completada"],
  ["Módulo concluído", "Module completed", "Módulo completado"],
  ["Novo estudo bíblico", "New Bible study", "Nuevo estudio bíblico"],
  ["O que você gostaria de compartilhar hoje?", "What would you like to share today?", "¿Qué te gustaría compartir hoy?"],
  ["Adicione amigos e continue estudando. As conquistas de vocês aparecerão aqui.", "Add friends and keep studying. Your achievements will appear here.", "Añade amigos y sigue estudiando. Sus logros aparecerán aquí."],
  ["Como podemos orar por você hoje?", "How can we pray for you today?", "¿Cómo podemos orar por ti hoy?"],
  ["Irmão adicionado!", "Brother added!", "¡Hermano añadido!"],
  ["Não foi possível adicionar esse irmão(ã).", "Could not add this brother or sister.", "No se pudo añadir a este hermano o hermana."],
  ["Barnabé", "Barnabas", "Bernabé"],
  ["Muito provável", "Very likely", "Muy probable"],
  ["Não tenho certeza", "Not sure", "No estoy seguro"],
  ["Carregando presença", "Loading presence", "Cargando presencia"],
  ["Bíblia de Estudos — Disciple", "Study Bible — Disciple", "Biblia de Estudio — Disciple"],
  ["Leia a Bíblia em português com estudo das línguas originais: grego, hebraico, Strong, léxico e referências cruzadas.", "Read the Bible in Portuguese with original-language study: Greek, Hebrew, Strong, lexicon, and cross-references.", "Lee la Biblia en español con estudio de las lenguas originales: griego, hebreo, Strong, léxico y referencias cruzadas."],
  ["Referência não encontrada. Use, por exemplo, João 3:16.", "Reference not found. Try, for example, John 3:16.", "Referencia no encontrada. Usa, por ejemplo, Juan 3:16."],
  ["Não foi possível buscar agora. Tente novamente.", "Could not search right now. Try again.", "No se pudo buscar ahora. Inténtalo de nuevo."],
  ["Gênesis a Malaquias", "Genesis to Malachi", "Génesis a Malaquías"],
  ["Pronto para começar", "Ready to begin", "Listo para comenzar"],
  ["rápida", "quick", "rápida"],
  ["épica", "epic", "épica"],
  ["Escolha uma grade para resolver sozinho ou reúna seus amigos para um desafio bíblico em sala.", "Choose a grid to solve alone or gather your friends for a Bible room challenge.", "Elige una cuadrícula para resolverla solo o reúne a tus amigos para un desafío bíblico en una sala."],
  ["grade concluída", "grid completed", "cuadrícula completada"],
  ["grades concluídas", "grids completed", "cuadrículas completadas"],
  ["Essa sala não está mais disponível.", "This room is no longer available.", "Esta sala ya no está disponible."],
  ["Não foi possível atualizar seu status.", "Could not update your status.", "No se pudo actualizar tu estado."],
  ["Não foi possível carregar sua árvore de discipulado.", "Could not load your discipleship tree.", "No se pudo cargar tu árbol de discipulado."],
  ["· Painel do Líder", "· Leader dashboard", "· Panel del líder"],
  ["Liderança acima", "Leadership above you", "Liderazgo superior"],
  ["Discípulos", "Disciples", "Discípulos"],
  ["árvore de habilidades", "skill tree", "árbol de habilidades"],
  ["nó de circuito", "circuit node", "nodo de circuito"],
  ["Você tem um líder acima na cadeia.", "You have a leader above you in the chain.", "Tienes un líder superior en la cadena."],
  ["Você está no topo da sua cadeia de discipulado.", "You are at the top of your discipleship chain.", "Estás en la cima de tu cadena de discipulado."],
  ["Você ainda não tem discípulos.", "You do not have any disciples yet.", "Todavía no tienes discípulos."],
  ["Leitura bíblica — Disciple", "Bible reading — Disciple", "Lectura bíblica — Disciple"],
  ["Leia a Bíblia capítulo a capítulo com destaques, anotações e estudo das línguas originais.", "Read the Bible chapter by chapter with highlights, notes, and original-language study.", "Lee la Biblia capítulo a capítulo con destacados, notas y estudio de las lenguas originales."],
  ["Áudio inválido", "Invalid audio", "Audio no válido"],
  ["Não foi possível carregar a narração.", "Could not load the narration.", "No se pudo cargar la narración."],
  ["A narração externa está indisponível no momento.", "External narration is unavailable right now.", "La narración externa no está disponible en este momento."],
  ["Não foi possível carregar este capítulo.", "Could not load this chapter.", "No se pudo cargar este capítulo."],
  ["Pausar narração", "Pause narration", "Pausar narración"],
  ["Ouvir narração", "Listen to narration", "Escuchar narración"],
  ["Carregando narração", "Loading narration", "Cargando narración"],
  ["Tentar narração novamente", "Try narration again", "Intentar la narración de nuevo"],
  ["Continuar narração", "Resume narration", "Continuar narración"],
  ["Velocidade da narração", "Narration speed", "Velocidad de narración"],
  ["Parar narração", "Stop narration", "Detener narración"],
  ["Fonte e versões da Bíblia", "Bible font and versions", "Fuente y versiones de la Biblia"],
  ["Capítulo anterior", "Previous chapter", "Capítulo anterior"],
  ["Escolher capítulo", "Choose chapter", "Elegir capítulo"],
  ["Próximo capítulo", "Next chapter", "Capítulo siguiente"],
  ["Escreva sua anotação…", "Write your note…", "Escribe tu nota…"],
  ["Anotação salva", "Note saved", "Nota guardada"],
  ["Leia o versículo na língua em que foi escrito.", "Read the verse in the language in which it was written.", "Lee el versículo en el idioma en que fue escrito."],
  ["Compare cada termo original com sua tradução.", "Compare each original term with its translation.", "Compara cada término original con su traducción."],
  ["Análise", "Analysis", "Análisis"],
  ["Explore pronúncia, sentidos e função de cada palavra.", "Explore the pronunciation, meanings, and function of each word.", "Explora la pronunciación, los sentidos y la función de cada palabra."],
  ["Referências", "References", "Referencias"],
  ["Conexões", "Connections", "Conexiones"],
  ["Encontre outras passagens ligadas a este versículo.", "Find other passages linked to this verse.", "Encuentra otros pasajes relacionados con este versículo."],
  ["Léxico", "Lexicon", "Léxico"],
  ["Dicionário", "Dictionary", "Diccionario"],
  ["Consulte os verbetes acadêmicos de Strong.", "Consult Strong's academic entries.", "Consulta las entradas académicas de Strong."],
  ["Estudo do versículo — Disciple", "Verse study — Disciple", "Estudio del versículo — Disciple"],
  ["Grego, hebraico, interlinear, léxico e referências cruzadas do versículo.", "Greek, Hebrew, interlinear, lexicon, and cross-references for the verse.", "Griego, hebreo, interlineal, léxico y referencias cruzadas del versículo."],
  ["Estude o versículo nas línguas originais com fontes acadêmicas.", "Study the verse in the original languages with academic sources.", "Estudia el versículo en las lenguas originales con fuentes académicas."],
  ["Informação indisponível na base consultada.", "Information unavailable in the consulted source.", "Información no disponible en la fuente consultada."],
  ["No princípio", "In the beginning", "En el principio"],
  ["Texto original indisponível", "Original text unavailable", "Texto original no disponible"],
  ["Não foi possível consultar a base acadêmica para esta passagem agora.", "Could not consult the academic source for this passage right now.", "No se pudo consultar la fuente académica para este pasaje ahora."],
  ["Análise temporariamente indisponível", "Analysis temporarily unavailable", "Análisis temporalmente no disponible"],
  ["As palavras e o léxico continuam disponíveis normalmente.", "Words and lexicon remain available as usual.", "Las palabras y el léxico siguen disponibles normalmente."],
  ["Abrir Barnabé, Mentor IA", "Open Barnabas, AI Mentor", "Abrir Bernabé, Mentor IA"],
  ["Barnabé, Mentor IA", "Barnabas, AI Mentor", "Bernabé, Mentor IA"],
  ["semana passada você comentou que...", "last week you said...", "la semana pasada comentaste que..."],
  ["Escolha um GIF para o comentário", "Choose a GIF for the comment", "Elige un GIF para el comentario"],
  ["Não foi possível responder ao convite.", "Could not respond to the invitation.", "No se pudo responder a la invitación."],
  ["TTS 402: sem créditos", "TTS 402: no credits", "TTS 402: sin créditos"],
  ["Narração: erro ao tocar áudio", "Narration: audio playback error", "Narración: error al reproducir el audio"],
  ["Narração: voz de IA indisponível, usando a voz do aparelho", "Narration: AI voice unavailable, using device voice", "Narración: voz de IA no disponible; usando la voz del dispositivo"],
  ["Não foi possível narrar (tente novamente)", "Could not narrate (try again)", "No se pudo narrar (inténtalo de nuevo)"],
  ["Esta versão não retornou este versículo agora.", "This version did not return this verse right now.", "Esta versión no devolvió este versículo ahora."],
  ["Personagem bíblico", "Bible character", "Personaje bíblico"],
  ["Referência bíblica", "Bible reference", "Referencia bíblica"],
  ["Esta sala não está disponível.", "This room is not available.", "Esta sala no está disponible."],
  ["Não foi possível preparar esta rodada.", "Could not prepare this round.", "No se pudo preparar esta ronda."],
  ["Não foi possível registrar sua resposta.", "Could not submit your answer.", "No se pudo registrar tu respuesta."],
  ["Você venceu!", "You won!", "¡Ganaste!"],
  ["Você perdeu desta vez", "You lost this time", "Perdiste esta vez"],
  ["Resposta rápida, boa leitura e uma bela pontuação.", "Fast answer, good reading, and a great score.", "Respuesta rápida, buena lectura y una gran puntuación."],
  ["Reconheça a passagem", "Recognize the passage", "Reconoce el pasaje"],
  ["Ninguém acertou desta vez.", "Nobody got it right this time.", "Nadie acertó esta vez."],
  ["Próxima rodada", "Next round", "Siguiente ronda"],
  ["Escolha um discípulo ou grupo.", "Choose a disciple or group.", "Elige un discípulo o grupo."],
  ["Conteúdo aplicado ao grupo", "Content assigned to the group", "Contenido aplicado al grupo"],
  ["Formação de liderança", "Leadership training", "Formación de liderazgo"],
  ["Voltar para os módulos", "Back to modules", "Volver a los módulos"],
  ["Não foi possível atualizar sua igreja.", "Could not update your church.", "No se pudo actualizar tu iglesia."],
  ["Não foi possível cadastrar essa igreja.", "Could not register this church.", "No se pudo registrar esta iglesia."],
  ["Irmão(ã)", "Brother or sister", "Hermano o hermana"],
  ["Módulo", "Module", "Módulo"],
  ["Não foi possível aceitar o desafio. Tente novamente.", "Could not accept the challenge. Try again.", "No se pudo aceptar el desafío. Inténtalo de nuevo."],
  ["Não foi possível recusar o desafio. Tente novamente.", "Could not decline the challenge. Try again.", "No se pudo rechazar el desafío. Inténtalo de nuevo."],
  ["Não foi possível cancelar o desafio. Tente novamente.", "Could not cancel the challenge. Try again.", "No se pudo cancelar el desafío. Inténtalo de nuevo."],
  ["Não foi possível enviar. Tente novamente.", "Could not send. Try again.", "No se pudo enviar. Inténtalo de nuevo."],
  ["Não foi possível acessar o microfone", "Could not access the microphone", "No se pudo acceder al micrófono"],
  ["Referências cruzadas", "Cross-references", "Referencias cruzadas"],
  ["versículo", "verse", "versículo"],
  ["Quiz do Milhão", "Million Quiz", "Quiz del Millón"],
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
    pattern: /^há\s+(.+)$/,
    render: (match, language) => language === "en" ? match[1] + " ago" : language === "es" ? "hace " + match[1] : match[0],
  },
  {
    pattern: /^(\d+)\s+XP(?:\s+total)?$/,
    render: (match, language) => language === "en" ? match[1] + " XP" + (match[0].includes("total") ? " total" : "") : language === "es" ? match[1] + " XP" + (match[0].includes("total") ? " total" : "") : match[0],
  },
  {
    pattern: /^(\d+)\s+registros$/,
    render: (match, language) => language === "en" ? match[1] + " records" : language === "es" ? match[1] + " registros" : match[0],
  },
  {
    pattern: /^(\d+)\s+conversas$/,
    render: (match, language) => language === "en" ? match[1] + " conversations" : language === "es" ? match[1] + " conversaciones" : match[0],
  },
  {
    pattern: /^(\d+)\s+amigos?$/,
    render: (match, language) => language === "en" ? match[1] + (match[0].endsWith("amigo") ? " friend" : " friends") : language === "es" ? match[1] + (match[0].endsWith("amigo") ? " amigo" : " amigos") : match[0],
  },
  {
    pattern: /^(\d+)\s+rodadas?$/,
    render: (match, language) => language === "en" ? match[1] + (match[0].endsWith("rodada") ? " round" : " rounds") : language === "es" ? match[1] + (match[0].endsWith("rodada") ? " ronda" : " rondas") : match[0],
  },
  {
    pattern: /^(\d+)\s+pistas?$/,
    render: (match, language) => language === "en" ? match[1] + (match[0].endsWith("pista") ? " clue" : " clues") : language === "es" ? match[1] + (match[0].endsWith("pista") ? " pista" : " pistas") : match[0],
  },
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
    pattern: /^(\d+) de (\d+) dias · (\d+)%$/,
    render: (match, language) =>
      language === "en"
        ? match[1] + " of " + match[2] + " days · " + match[3] + "%"
        : language === "es"
          ? match[1] + " de " + match[2] + " días · " + match[3] + "%"
          : match[0],
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
  for (const referenceEntry of ENTRIES) {
    if (normalized.startsWith(referenceEntry[0] + " ") && /^\s+\d+(?::\d+(?:-\d+)?)?$/.test(normalized.slice(referenceEntry[0].length))) {
      return { source: normalized, value: targetFor(referenceEntry, language) + normalized.slice(referenceEntry[0].length) };
    }
  }
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
  if (!normalized) return;
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
    attributeFilter: ["placeholder", "aria-label", "title", "alt"],
  });
  return () => observer.disconnect();
}
