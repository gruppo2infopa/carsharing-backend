declare namespace NodeJS {
  export interface ProcessEnv {
    PORT: string;
    JWT_SECRET: string;
    NOREPLY_EMAIL: string;
    NOREPLY_PASSWORD: string;
  }
}
