/** Popup exibido quando os dois participantes concluem o desafio. */
function ChallengeCompletedModal({
  meAvatarUrl,
  peerAvatarUrl,
  peerName,
  onClose,
}: {
  meAvatarUrl: string | null | undefined;
  peerAvatarUrl: string | null | undefined;
  peerName: string | null | undefined;
  onClose: () => void;
}) {
  const [canClose, setCanClose] = useState(false);

  useEffect(() => {
    playVictoryTrumpet();
    const t = setTimeout(() => setCanClose(true), 1000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center bg-black/70 px-6 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={() => canClose && onClose()}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-sm overflow-hidden rounded-3xl border border-ancient/40 bg-gradient-to-b from-slate-900 via-slate-950 to-black p-6 text-center text-white shadow-2xl animate-scale-in"
      >
        {canClose && (
          <button
            onClick={onClose}
            aria-label="Fechar"
            className="absolute right-3 top-3 z-20 rounded-full p-1.5 text-white/60 hover:bg-white/10 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        )}

        <img
          src="/desafio-concluido.jpeg"
          alt="Ovelhas comemorando o desafio concluído"
          className="mx-auto h-36 w-full rounded-2xl object-cover"
        />

        <h2 className="mt-3 text-xl font-black">Desafio concluído!</h2>

        <div className="mt-4 flex items-center justify-center gap-4">
          <Avatar url={meAvatarUrl} name="Você" size="h-14 w-14" ring="ring-orange-400" />
          <Swords className="h-5 w-5 shrink-0 text-white/50" />
          <Avatar url={peerAvatarUrl} name={peerName} size="h-14 w-14" ring="ring-indigo-400" />
        </div>
      </div>
    </div>
  );
}
