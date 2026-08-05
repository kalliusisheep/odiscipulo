"""Gera o lexico Strong em portugues usado pela Biblia de Estudos.

Entradas:
  1. BDBT.json exportado pela bolls.life (BDB para hebraico e Thayer para grego)
  2. Um modelo Argos en->pt-BR instalado localmente

Saida:
  public/data/lexicon-pt/{G|H}<centena>.json

O tradutor e o modelo sao ferramentas de geracao. Eles nao fazem parte do
aplicativo publicado e nenhuma chamada de traducao acontece em producao.
"""

from __future__ import annotations

import argparse
import html
import json
import re
from collections import defaultdict
from html.parser import HTMLParser
from pathlib import Path
from typing import Iterable

import ctranslate2
import sentencepiece as spm


SPACE_RE = re.compile(r"\s+")
STRONG_RE = re.compile(r"[GH]\d+", re.IGNORECASE)

GRAMMAR_REPLACEMENTS = {
    "Noun": "Substantivo",
    "Verb": "Verbo",
    "Adjective": "Adjetivo",
    "Adverb": "Advérbio",
    "Pronoun": "Pronome",
    "Preposition": "Preposição",
    "Conjunction": "Conjunção",
    "Particle": "Partícula",
    "Article": "Artigo",
    "Interjection": "Interjeição",
    "Letter": "Letra",
    "Carta": "Letra",
    "Masculine": "Masculino",
    "Feminine": "Feminino",
    "Neuter": "Neutro",
    "Common": "Comum",
    "Proper": "Próprio",
    "Singular": "Singular",
    "Plural": "Plural",
}


def clean(value: str | None) -> str:
    if not value:
        return ""
    value = re.sub(r"<br\s*/?>|</?p[^>]*>", " ", value, flags=re.IGNORECASE)
    value = re.sub(r"<[^>]+>", " ", value)
    return SPACE_RE.sub(" ", html.unescape(value)).strip(" -:;,.")


class DefinitionParser(HTMLParser):
    """Extrai os itens de definicao sem depender de uma unica variante HTML."""

    def __init__(self) -> None:
        super().__init__()
        self.list_depth = 0
        self.active_li: list[str] | None = None
        self.active_li_depth = 0
        self.active_paragraph: list[str] | None = None
        self.results: list[str] = []

    def finish_li(self) -> None:
        if self.active_li is not None and self.active_li_depth == 1:
            text = clean(" ".join(self.active_li))
            if 1 < len(text) <= 360:
                self.results.append(text)
        self.active_li = None
        self.active_li_depth = 0

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        attr = dict(attrs)
        if tag == "ol":
            self.list_depth += 1
        elif tag == "li":
            # O HTML BDB historico frequentemente omite </li>. Um novo <li>
            # encerra o item anterior, e a profundidade de <ol> identifica se
            # ele e um sentido principal ou apenas um detalhamento.
            self.finish_li()
            self.active_li = []
            self.active_li_depth = self.list_depth
        elif tag == "p" and (attr.get("class") or "").startswith("li"):
            self.active_paragraph = []

    def handle_endtag(self, tag: str) -> None:
        if tag == "li":
            self.finish_li()
        elif tag == "ol":
            self.finish_li()
            self.list_depth = max(0, self.list_depth - 1)
        elif tag == "p" and self.active_paragraph is not None:
            text = clean(" ".join(self.active_paragraph))
            if 1 < len(text) <= 360:
                self.results.append(text)
            self.active_paragraph = None

    def handle_data(self, data: str) -> None:
        # Em listas BDB, apenas o texto do item de primeiro nivel representa
        # um sentido principal. Os subitens detalham esse sentido e nao devem
        # ser concatenados repetidamente ao rotulo pai.
        if self.active_li is not None:
            self.active_li.append(data)
        if self.active_paragraph is not None:
            self.active_paragraph.append(data)


def labeled_value(raw_html: str, label: str) -> str:
    match = re.search(
        rf"(?:^|<p\s*/?>|</p>)\s*-?\s*{label}:\s*(.*?)(?:<p\s*/?>|</p>|$)",
        raw_html,
        flags=re.IGNORECASE | re.DOTALL,
    )
    return clean(match.group(1)) if match else ""


def definition_candidates(item: dict[str, object]) -> list[str]:
    raw_html = str(item.get("definition") or "")
    parser = DefinitionParser()
    parser.feed(raw_html)

    values: list[str] = []
    short_definition = clean(str(item.get("short_definition") or ""))
    if short_definition:
        values.append(short_definition)
    values.extend(parser.results)

    strongs = labeled_value(raw_html, r"Strong(?:'s|s)")
    if strongs:
        values.append(strongs)

    unique: list[str] = []
    seen: set[str] = set()
    for value in values:
        normalized = value.casefold()
        if normalized and normalized not in seen:
            unique.append(value)
            seen.add(normalized)
        if len(unique) == 3:
            break
    return unique


def translated_text(tokens: list[str]) -> str:
    value = "".join(tokens).replace("▁", " ")
    value = re.sub(r"\s+([,.;:!?])", r"\1", value)
    return SPACE_RE.sub(" ", value).strip()


def normalize_grammar(value: str) -> str:
    for source, target in GRAMMAR_REPLACEMENTS.items():
        value = re.sub(rf"\b{source}\b", target, value, flags=re.IGNORECASE)
    return SPACE_RE.sub(" ", value).strip()


class OfflineTranslator:
    def __init__(self, model_dir: Path) -> None:
        self.processor = spm.SentencePieceProcessor(
            model_file=str(model_dir / "sentencepiece.model")
        )
        self.translator = ctranslate2.Translator(str(model_dir / "model"), device="cpu")

    def translate_many(self, texts: Iterable[str], cache_path: Path | None = None) -> dict[str, str]:
        unique = list(dict.fromkeys(text for text in texts if text))
        output: dict[str, str] = {}
        if cache_path and cache_path.exists():
            output = json.loads(cache_path.read_text(encoding="utf-8"))
        unique = [text for text in unique if text not in output]
        batch_size = 256
        total = len(unique)
        for start in range(0, total, batch_size):
            batch = unique[start : start + batch_size]
            encoded = [self.processor.encode(text, out_type=str) for text in batch]
            results = self.translator.translate_batch(
                encoded,
                beam_size=1,
                max_batch_size=batch_size,
            )
            for source, result in zip(batch, results):
                output[source] = translated_text(result.hypotheses[0])
            if cache_path and (start // batch_size) % 10 == 0:
                cache_path.parent.mkdir(parents=True, exist_ok=True)
                cache_path.write_text(
                    json.dumps(output, ensure_ascii=False, separators=(",", ":")),
                    encoding="utf-8",
                )
            print(f"Traduzidos {min(start + batch_size, total)}/{total}", flush=True)
        if cache_path:
            cache_path.parent.mkdir(parents=True, exist_ok=True)
            cache_path.write_text(
                json.dumps(output, ensure_ascii=False, separators=(",", ":")),
                encoding="utf-8",
            )
        return output


def bucket_for(code: str) -> str:
    match = STRONG_RE.fullmatch(code)
    if not match:
        raise ValueError(f"Codigo Strong invalido: {code}")
    return f"{code[0].upper()}{int(code[1:]) // 100}"


def distinct(values: Iterable[str], limit: int = 3) -> list[str]:
    result: list[str] = []
    seen: set[str] = set()
    for value in values:
        value = SPACE_RE.sub(" ", value).strip(" -:;,.")
        # Evita listas produzidas pela fonte com o mesmo item repetido.
        if "," in value:
            parts = distinct((part.strip() for part in value.split(",")), limit=8)
            value = ", ".join(parts)
        if len(value) > 240:
            value = value[:237].rstrip(" -:;,.") + "..."
        key = value.casefold()
        if len(value) > 1 and key not in seen:
            result.append(value)
            seen.add(key)
        if len(result) == limit:
            break
    return result


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--dictionary", type=Path, required=True)
    parser.add_argument("--model", type=Path, required=True)
    parser.add_argument("--output", type=Path, required=True)
    parser.add_argument("--cache", type=Path)
    args = parser.parse_args()

    items = json.loads(args.dictionary.read_text(encoding="utf-8"))
    prepared: list[dict[str, object]] = []
    phrases: list[str] = []

    for item in items:
        code = str(item.get("topic") or "").upper()
        if not STRONG_RE.fullmatch(code):
            continue
        raw_html = str(item.get("definition") or "")
        definitions = definition_candidates(item)
        part_of_speech = labeled_value(raw_html, r"Part\(s\) of speech")
        origin = labeled_value(raw_html, "Origin")
        phrases.extend(definitions)
        phrases.extend(value for value in (part_of_speech, origin) if value)
        prepared.append(
            {
                "code": code,
                "original": clean(str(item.get("lexeme") or "")),
                "transliteration": clean(str(item.get("transliteration") or "")),
                "phonetic": clean(str(item.get("pronunciation") or "")),
                "part_of_speech": part_of_speech,
                "origin": origin,
                "definitions": definitions,
                "related": sorted(
                    {
                        match.upper()
                        for match in STRONG_RE.findall(raw_html)
                        if match.upper() != code
                    }
                ),
            }
        )

    translations = OfflineTranslator(args.model).translate_many(phrases, args.cache)
    buckets: dict[str, dict[str, object]] = defaultdict(dict)

    for item in prepared:
        code = str(item["code"])
        english_definitions = item["definitions"]
        senses = distinct(translations.get(value, value) for value in english_definitions)
        if not senses:
            senses = ["Sentido lexical nao detalhado pela fonte aberta consultada."]

        buckets[bucket_for(code)][code] = {
            "o": item["original"] or None,
            "t": item["transliteration"] or None,
            "p": item["phonetic"] or None,
            "g": normalize_grammar(translations.get(str(item["part_of_speech"]), ""))
            or "Classe gramatical não informada pela fonte.",
            "e": translations.get(str(item["origin"]), "")
            or "Etimologia não informada pela fonte.",
            "d": senses,
            "r": item["related"],
        }

    args.output.mkdir(parents=True, exist_ok=True)
    for old_file in args.output.glob("[GH]*.json"):
        old_file.unlink()
    for bucket, entries in sorted(buckets.items()):
        path = args.output / f"{bucket}.json"
        path.write_text(
            json.dumps(entries, ensure_ascii=False, separators=(",", ":")),
            encoding="utf-8",
        )

    manifest = {
        "version": 1,
        "entries": sum(len(entries) for entries in buckets.values()),
        "buckets": len(buckets),
        "source": "Brown-Driver-Briggs / Thayer via bolls.life",
        "translation": "Argos Translate en->pt-BR 1.9 (geracao offline)",
        "reviewed": False,
    }
    (args.output / "manifest.json").write_text(
        json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )
    print(json.dumps(manifest, ensure_ascii=False))


if __name__ == "__main__":
    main()
