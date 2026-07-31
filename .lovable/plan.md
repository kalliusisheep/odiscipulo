# Narração: consertar, deixar natural em pt-BR e barata

## Por que parou

A narração hoje chama um servidor externo (Kokoro, hospedado no Render) pelo endpoint `/api/tts`. Esse servidor não está mais respondendo — o app recebe erro 504 ("timeout") e o botão entra em estado de erro. Nada dentro do app está quebrado; a dependência externa é que caiu.

## Como funciona o "gasta só na primeira vez"

Cada frase narrada vira um arquivo de áudio guardado no armazenamento do próprio app, identificado por uma "impressão digital" do texto:

1. Alguém toca em ouvir uma frase pela primeira vez → o áudio é gerado (aí sim consome créditos, um valor bem pequeno por frase).
2. O arquivo fica salvo para sempre.
3. Qualquer pessoa que ouvir aquela mesma frase depois — você ou qualquer outro usuário, quantas vezes quiser — recebe o arquivo salvo. Custo zero, sem limite.

Ou seja: o custo é por **conteúdo novo**, não por **uso**. Como as lições, planos e estudos são textos fixos, depois que cada um for ouvido uma vez o app fica praticamente gratuito para sempre. Só volta a gerar (e a custar centavos) quando você publicar conteúdo novo. O único conteúdo que sempre geraria de novo seria texto dinâmico (ex.: respostas do Mentor IA), e a narração não é usada lá.

Esse cache já existe no projeto — ele foi feito para o Kokoro e vai ser reaproveitado.

## O que vou fazer

1. **Trocar o motor de voz**: `/api/tts` deixa de chamar o servidor Render e passa a usar a voz de IA da Lovable, com voz e instruções ajustadas para português do Brasil natural, ritmo pastoral e leitura calma.
2. **Manter e reforçar o cache** no armazenamento do app, para que cada trecho só seja gerado uma vez (custo zero nas repetições).
3. **Rede de segurança**: se a geração falhar por qualquer motivo (sem créditos, instabilidade), o app cai automaticamente para a voz de português do próprio celular/navegador — a narração nunca fica indisponível, e nesse modo é 100% grátis e ilimitada.
4. **Melhorar o botão**: mensagens de erro mais claras, retomar de onde parou e destaque de palavras funcionando igual nos dois modos.

## Detalhes técnicos

- `src/routes/api/tts.ts`: substituir a chamada Kokoro por `POST https://ai.gateway.lovable.dev/v1/audio/speech` com `LOVABLE_API_KEY` (lido dentro do handler), voz natural para pt-BR, `stream_format: "audio"` e `response_format: "mp3"` (arquivo completo, para poder cachear).
- Cache: manter `hashText(text)` + bucket `narration-audio` no Storage; mudar extensão/content-type para `audio/mpeg` e a chave do arquivo para refletir o novo motor.
- Erros: repassar 402/429/5xx com corpo legível para o cliente decidir o fallback.
- `src/components/NarrationButton.tsx`: adicionar fallback via `window.speechSynthesis` com voz `pt-BR`, usando `onboundary` para o destaque palavra a palavra; acionado quando `/api/tts` falha. Remover a lógica de "erro definitivo" que hoje desabilita o botão.
- Secrets `KOKORO_TTS_URL` / `KOKORO_TTS_API_KEY` deixam de ser usados.
