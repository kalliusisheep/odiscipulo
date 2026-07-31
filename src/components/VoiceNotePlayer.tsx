type Props = {
  src: string;
  className?: string;
};

/** Player simples para uma nota de voz já salva (mural ou chat). */
export function VoiceNotePlayer({ src, className }: Props) {
  return <audio controls preload="none" src={src} className={className ?? "h-9 w-full max-w-[260px]"} />;
}
