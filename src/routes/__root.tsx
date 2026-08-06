import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Voltar ao início
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  const isModuleLoadError = /failed to fetch dynamically imported module|loading chunk|importing a module script failed/i.test(
    error.message,
  );

  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });

    // O preview pode manter a URL de um chunk antigo depois de sincronizar
    // uma nova versão. Um único reload recupera o módulo atualizado sem
    // prender o usuário em uma tela em branco ou em um ciclo de recarga.
    if (!isModuleLoadError || typeof window === "undefined") return;

    try {
      const retryKey = "odiscipulo:module-load-retry";
      const retryMarker = `${window.location.pathname}:${error.message}`;
      if (window.sessionStorage.getItem(retryKey) !== retryMarker) {
        window.sessionStorage.setItem(retryKey, retryMarker);
        window.location.reload();
      }
    } catch {
      // Se o armazenamento estiver indisponível, o botão manual permanece.
    }
  }, [error, isModuleLoadError]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          {isModuleLoadError ? "Atualizando o aplicativo…" : "Esta página não carregou"}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {isModuleLoadError
            ? "Encontramos uma versão mais recente. Se a página não voltar sozinha, toque em recarregar."
            : "Algo inesperado aconteceu. Você pode tentar novamente ou voltar ao início."}
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            {isModuleLoadError ? "Recarregar" : "Tentar novamente"}
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Voltar ao início
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { name: "theme-color", content: "#1c1830" },
      { title: "Disciple — Discipulado cristão gamificado" },
      { name: "description", content: "Trilhas de estudo, quizzes e um Mentor IA para crescer na fé um dia por vez." },
      { property: "og:title", content: "Disciple" },
      { property: "og:description", content: "Discipulado cristão gamificado — um passo por dia." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
      { rel: "manifest", href: "/manifest.webmanifest" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Cormorant+Garamond:ital,wght@0,500;0,600;1,500&family=Noto+Serif:ital,wght@0,500;0,600;1,500&family=Noto+Serif+Hebrew:wght@500;600&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  // Mantém uma instância estável no cliente. Isso evita que uma montagem
  // antecipada de rota passe um contexto ainda não inicializado ao provider.
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <Outlet />
    </QueryClientProvider>
  );
}
