// TODO: eliminare variabili d'ambiente inutilizzate
declare namespace NodeJS {
  export interface ProcessEnv {
    PORT: string;
    DB_USER?: string;
    DB_PASSWORD?: string;
    DB_URI?: string;
    JWT_SECRET: string;
  }
}
