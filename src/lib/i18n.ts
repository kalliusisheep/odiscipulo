export const APP_LANGUAGES = [
  {
    code: "pt-BR",
    label: "Português (Brasil)",
    nativeLabel: "Português",
    bibleTranslation: "NVIPT",
  },
  {
    code: "en",
    label: "English",
    nativeLabel: "English",
    bibleTranslation: "WEB",
  },
  {
    code: "es",
    label: "Español",
    nativeLabel: "Español",
    bibleTranslation: "RV1960",
  },
] as const;

export type AppLanguage = (typeof APP_LANGUAGES)[number]["code"];

export const THEME_OPTIONS = [
  { id: "white", labelKey: "theme.white", descriptionKey: "theme.whiteDescription" },
  { id: "gray", labelKey: "theme.gray", descriptionKey: "theme.grayDescription" },
  { id: "black", labelKey: "theme.black", descriptionKey: "theme.blackDescription" },
  { id: "pink", labelKey: "theme.pink", descriptionKey: "theme.pinkDescription" },
] as const;

export type AppTheme = (typeof THEME_OPTIONS)[number]["id"];

const MESSAGES = {
  "pt-BR": {
    "nav.home": "Inicial",
    "nav.studies": "Estudos",
    "nav.bible": "Bíblia",
    "nav.feed": "Feed",
    "nav.profile": "Você",
    "profile.preferences": "Preferências",
    "profile.language": "Idioma",
    "profile.languageDescription": "Idioma da interface e da Bíblia",
    "profile.theme": "Tema",
    "profile.themeDescription": "Personalize as cores do aplicativo",
    "profile.languageDialogTitle": "Idioma do aplicativo",
    "profile.languageDialogDescription": "Escolha o idioma dos menus e da leitura bíblica.",
    "profile.themeDialogTitle": "Tema do aplicativo",
    "profile.themeDialogDescription": "Escolha uma paleta confortável para toda a experiência.",
    "profile.bibleVersion": "Versão da Bíblia",
    "profile.myChurch": "Minha Igreja",
    "profile.devotionalReminder": "Lembrete de Devocional",
    "profile.accountProtected": "Conta protegida",
    "profile.signOut": "Sair da conta",
    "theme.white": "Branco",
    "theme.whiteDescription": "Claro e arejado",
    "theme.gray": "Cinza",
    "theme.grayDescription": "Neutro e confortável",
    "theme.black": "Preto",
    "theme.blackDescription": "Escuro e imersivo",
    "theme.pink": "Rosa",
    "theme.pinkDescription": "Acolhedor e vibrante",
    "theme.activateLight": "Ativar um tema claro",
    "theme.activateDark": "Ativar um tema escuro",
  },
  en: {
    "nav.home": "Home",
    "nav.studies": "Studies",
    "nav.bible": "Bible",
    "nav.feed": "Feed",
    "nav.profile": "You",
    "profile.preferences": "Preferences",
    "profile.language": "Language",
    "profile.languageDescription": "Interface and Bible language",
    "profile.theme": "Theme",
    "profile.themeDescription": "Customize the app colors",
    "profile.languageDialogTitle": "App language",
    "profile.languageDialogDescription": "Choose the language for menus and Bible reading.",
    "profile.themeDialogTitle": "App theme",
    "profile.themeDialogDescription": "Choose a comfortable palette for the whole experience.",
    "profile.bibleVersion": "Bible version",
    "profile.myChurch": "My Church",
    "profile.devotionalReminder": "Devotional reminder",
    "profile.accountProtected": "Protected account",
    "profile.signOut": "Sign out",
    "theme.white": "White",
    "theme.whiteDescription": "Light and airy",
    "theme.gray": "Gray",
    "theme.grayDescription": "Neutral and comfortable",
    "theme.black": "Black",
    "theme.blackDescription": "Dark and immersive",
    "theme.pink": "Pink",
    "theme.pinkDescription": "Warm and vibrant",
    "theme.activateLight": "Activate a light theme",
    "theme.activateDark": "Activate a dark theme",
  },
  es: {
    "nav.home": "Inicio",
    "nav.studies": "Estudios",
    "nav.bible": "Biblia",
    "nav.feed": "Feed",
    "nav.profile": "Tú",
    "profile.preferences": "Preferencias",
    "profile.language": "Idioma",
    "profile.languageDescription": "Idioma de la interfaz y de la Biblia",
    "profile.theme": "Tema",
    "profile.themeDescription": "Personaliza los colores de la aplicación",
    "profile.languageDialogTitle": "Idioma de la aplicación",
    "profile.languageDialogDescription": "Elige el idioma de los menús y de la lectura bíblica.",
    "profile.themeDialogTitle": "Tema de la aplicación",
    "profile.themeDialogDescription": "Elige una paleta cómoda para toda la experiencia.",
    "profile.bibleVersion": "Versión de la Biblia",
    "profile.myChurch": "Mi Iglesia",
    "profile.devotionalReminder": "Recordatorio devocional",
    "profile.accountProtected": "Cuenta protegida",
    "profile.signOut": "Cerrar sesión",
    "theme.white": "Blanco",
    "theme.whiteDescription": "Claro y aireado",
    "theme.gray": "Gris",
    "theme.grayDescription": "Neutro y cómodo",
    "theme.black": "Negro",
    "theme.blackDescription": "Oscuro e inmersivo",
    "theme.pink": "Rosa",
    "theme.pinkDescription": "Acogedor y vibrante",
    "theme.activateLight": "Activar un tema claro",
    "theme.activateDark": "Activar un tema oscuro",
  },
} as const;

export type I18nKey = keyof (typeof MESSAGES)["pt-BR"];

export function translate(language: AppLanguage, key: I18nKey): string {
  return MESSAGES[language][key] ?? MESSAGES["pt-BR"][key];
}

export function languageByCode(code: string): (typeof APP_LANGUAGES)[number] {
  return APP_LANGUAGES.find((language) => language.code === code) ?? APP_LANGUAGES[0];
}

export function defaultBibleTranslationForLanguage(language: AppLanguage): string {
  return languageByCode(language).bibleTranslation;
}
