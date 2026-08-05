# Dados da Bíblia de Estudos

## Princípio editorial

A interface separa três coisas que não devem ser confundidas:

1. a palavra original e sua morfologia;
2. a tradução contextual daquela ocorrência;
3. os sentidos possíveis registrados pelo léxico.

Nenhuma tradução isolada é apresentada como a única interpretação possível. Os
termos revisados manualmente no código têm prioridade. A procedência de cada
verbete permanece registrada nos dados locais, sem inserir avisos sobre o processo
de tradução na interface de estudo.

## Fontes abertas

- Texto hebraico: Westminster Leningrad Codex / Open Scriptures.
- Texto grego: Tischendorf com números de Strong.
- Léxico: Brown-Driver-Briggs (hebraico) e Thayer (grego), ambos históricos e em
  domínio público, obtidos no formato estruturado da bolls.life.
- Alinhamento e morfologia em evolução: STEPBible Data (CC BY 4.0).
- Referências cruzadas: OpenBible.info (CC BY 4.0).

## Tradução sem API paga

`scripts/generate-open-lexicon-pt.py` usa um modelo Argos Translate aberto,
instalado apenas na máquina de geração. O script grava arquivos JSON estáticos em
`public/data/lexicon-pt`. O navegador não baixa o modelo, não chama um tradutor e
não precisa de chave, cota ou cobrança.

Termos teologicamente sensíveis devem ser incluídos na lista `CORE_TERMS` de
`src/lib/bible-source.ts`, com sentidos e contexto conferidos por revisão editorial.

## Áudio

O áudio usa `SpeechSynthesis` do próprio navegador/dispositivo. Isso é gratuito e
não envia a palavra a uma API paga. A disponibilidade e a pronúncia dependem das
vozes instaladas; as vozes de hebraico e grego modernos são uma aproximação de
pronúncias bíblicas antigas, e a interface deve deixar isso explícito.
