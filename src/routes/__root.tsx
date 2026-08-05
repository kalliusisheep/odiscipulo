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
            Go home
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
    // uma nova versÃ£o. Um Ãºnico reload recupera o mÃ³dulo atualizado sem
    // prender o usuÃ¡rio em uma tela em branco ou em um ciclo de recarga.
    if (!isModuleLoadError || typeof window === "undefined") return;

    try {
      const retryKey = "odiscipulo:module-load-retry";
      const retryMarker = `${window.location.pathname}:${error.message}`;
      if (window.sessionStorage.getItem(retryKey) !== retryMarker) {
        window.sessionStorage.setItem(retryKey, retryMarker);
        window.location.reload();
      }
    } catch {
      // Se o armazenamento estiver indisponÃ­vel, o botÃ£o manual permanece.
    }
  }, [error, isModuleLoadError]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          {isModuleLoadError ? "Atualizando o aplicativoâ€¦" : "Esta pÃ¡gina nÃ£o carregou"}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {isModuleLoadError
            ? "Encontramos uma versÃ£o mais recente. Se a pÃ¡gina nÃ£o voltar sozinha, toque em recarregar."
            : "Algo inesperado aconteceu. VocÃª pode tentar novamente ou voltar ao inÃ­cio."}
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
            Voltar ao inÃ­cio
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
      { title: "Disciple â€” Discipulado cristÃ£o gamificado" },
      { name: "description", content: "Trilhas de estudo, quizzes e um Mentor IA para crescer na fÃ© um dia por vez." },
      { property: "og:title", content: "Disciple" },
      { property: "og:description", content: "Discipulado cristÃ£o gamificado â€” um passo por dia." },
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
    <html lang="en">
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
  // MantÃ©m uma instÃ¢ncia estÃ¡vel no cliente. Isso evita que uma montagem
  // antecipada de rota passe um contexto ainda nÃ£o inicializado ao provider.
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <Outlet />
    </QueryClientProvider>
  );
}

