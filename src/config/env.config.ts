// TODO: eliminare variabili d'ambiente inutilizzate
declare namespace NodeJS {
  export interface ProcessEnv {
    PORT: string;
    JWT_SECRET: string;
  }
}
