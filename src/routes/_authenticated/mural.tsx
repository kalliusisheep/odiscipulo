function CommentsPanel({
  open,
  loading,
  list,
  draft,
  pendingGif,
  sending,
  commentLikeCounts,
  myCommentLikes,
  onDraftChange,
  onGifSelect,
  onGifClear,
  onSend,
  onToggleCommentLike,
}: {
  open: boolean;
  loading: boolean;
  list: FeedComment[];
  draft: string;
  pendingGif: string | null;
  sending: boolean;
  commentLikeCounts: Record<string, number>;
  myCommentLikes: Set<string>;
  onDraftChange: (text: string) => void;
  onGifSelect: (url: string) => void;
  onGifClear: () => void;
  onSend: () => void;
  onToggleCommentLike: (commentId: string) => void;
}) {
  return (
    <div
      className={`grid transition-[grid-template-rows] duration-300 ease-out ${
        open ? "mt-3 grid-rows-[1fr]" : "grid-rows-[0fr]"
      }`}
    >
      <div className="overflow-hidden">
        <div className="space-y-3 border-t border-border/50 pt-3">
          {loading && (
            <div className="flex items-center gap-2 py-2 text-xs text-muted-foreground">
              <Loader2 className="h-3.5 w-3.5 animate-spin" /> Carregando comentários…
            </div>
          )}

          {!loading && list.length === 0 && (
            <p className="py-1 text-xs text-muted-foreground">Seja o primeiro a comentar.</p>
          )}

          {list.map((c) => (
            <div key={c.id} className="flex items-start gap-2.5">
              <Avatar name={c.author_name} url={c.author_avatar_url} size="sm" />
              <div className="min-w-0 flex-1">
                <div className="rounded-[16px] bg-surface-2/70 px-3 py-2">
                  <p className="text-xs font-extrabold">{c.author_name}</p>
                  {c.body && (
                    <p className="mt-0.5 text-sm leading-relaxed text-foreground/90">{c.body}</p>
                  )}
                  {c.gif_url && (
                    <img
                      src={c.gif_url}
                      alt="GIF"
                      className="mt-1.5 max-h-40 rounded-[12px] object-cover"
                    />
                  )}
                </div>
                <div className="mt-1 flex items-center gap-2.5 px-1">
                  <span className="text-[11px] text-muted-foreground">
                    {formatDistanceToNow(new Date(c.created_at), { locale: ptBR, addSuffix: true })}
                  </span>
                  <button
                    type="button"
                    onClick={() => onToggleCommentLike(c.id)}
                    className={`inline-flex items-center gap-1 text-[10px] font-bold transition-colors ${
                      myCommentLikes.has(c.id) ? "text-destructive" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Heart className={`h-3 w-3 ${myCommentLikes.has(c.id) ? "fill-destructive" : ""}`} />
                    {(commentLikeCounts[c.id] ?? 0) > 0 && commentLikeCounts[c.id]}
                  </button>
                </div>
              </div>
            </div>
          ))}

          {pendingGif && (
            <div className="relative inline-block">
              <img src={pendingGif} alt="GIF selecionado" className="max-h-28 rounded-[12px]" />
              <button
                type="button"
                onClick={onGifClear}
                className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-foreground text-background shadow"
                aria-label="Remover GIF"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          )}

          <div className="flex min-w-0 items-center gap-2 pt-1">
            <input
              value={draft}
              onChange={(e) => onDraftChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  onSend();
                }
              }}
              placeholder="Escreva um comentário…"
              className="min-h-9 min-w-0 w-full flex-1 rounded-full border border-border/70 bg-background/70 px-3.5 text-xs outline-none transition-all placeholder:text-muted-foreground focus:border-primary/60 focus:ring-4 focus:ring-primary/10"
            />
            <GifPicker onSelect={onGifSelect} className="shrink-0" />
            <button
              type="button"
              onClick={onSend}
              disabled={(!draft.trim() && !pendingGif) || sending}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md shadow-primary/20 transition-all hover:bg-primary-glow disabled:opacity-40"
              aria-label="Enviar comentário"
            >
              {sending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

type CardCommonProps = {
  item: FeedItem;