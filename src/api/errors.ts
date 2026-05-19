/**
 * Erros de API normalizados para o Mobile.
 *
 * O backend responde erros como `{ error: { code, message, details } }`.
 * Aqui guardamos SOMENTE `code` + uma `message` curta. Nunca persistimos
 * body bruto, headers, token ou stack.
 */

/** Codigos de erro relevantes para o Mobile (subset do backend). */
export type ApiErrorCode =
  | 'UNAUTHENTICATED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'VALIDATION_ERROR'
  | 'RATE_LIMITED'
  | 'INTERNAL_ERROR'
  | 'NETWORK_OFFLINE'
  | 'TIMEOUT'
  | 'BAD_RESPONSE'
  | 'UNKNOWN';

/** Como o erro aconteceu (para decidir UX: retry vs limpar sessao). */
export type ApiErrorKind = 'http' | 'network' | 'timeout' | 'parse';

export class ApiError extends Error {
  readonly code: ApiErrorCode;
  readonly kind: ApiErrorKind;
  /** Status HTTP, quando houve resposta. */
  readonly httpStatus?: number;

  constructor(params: {
    code: ApiErrorCode;
    kind: ApiErrorKind;
    message: string;
    httpStatus?: number;
  }) {
    super(params.message);
    this.name = 'ApiError';
    this.code = params.code;
    this.kind = params.kind;
    this.httpStatus = params.httpStatus;
  }

  /** Token ausente/invalido/expirado — Mobile deve limpar a sessao. */
  get isUnauthenticated(): boolean {
    return this.code === 'UNAUTHENTICATED' || this.httpStatus === 401;
  }

  /** Conta bloqueada/deletada ou role insuficiente — bloquear acesso. */
  get isForbidden(): boolean {
    return this.code === 'FORBIDDEN' || this.httpStatus === 403;
  }

  /** Sem rede / backend inalcancavel / timeout — manter sessao e oferecer retry. */
  get isConnectivity(): boolean {
    return this.kind === 'network' || this.kind === 'timeout';
  }
}

const STATUS_TO_CODE: Record<number, ApiErrorCode> = {
  401: 'UNAUTHENTICATED',
  403: 'FORBIDDEN',
  404: 'NOT_FOUND',
  400: 'VALIDATION_ERROR',
  429: 'RATE_LIMITED',
};

/** Mensagens genericas e seguras (sem detalhe sensivel) por code. */
export function safeMessageFor(code: ApiErrorCode): string {
  switch (code) {
    case 'UNAUTHENTICATED':
      return 'Your session has expired. Please sign in again.';
    case 'FORBIDDEN':
      return 'This account cannot access the app right now.';
    case 'NETWORK_OFFLINE':
      return 'No connection. Check your network and try again.';
    case 'TIMEOUT':
      return 'The request took too long. Please try again.';
    case 'RATE_LIMITED':
      return 'Too many requests. Please try again later.';
    case 'BAD_RESPONSE':
      return 'Unexpected server response. Please try again.';
    default:
      return 'Something went wrong. Please try again.';
  }
}

/** Mapeia status HTTP + body de erro do backend para um ApiError seguro. */
export function apiErrorFromHttp(
  httpStatus: number,
  body: unknown,
): ApiError {
  const code =
    STATUS_TO_CODE[httpStatus] ??
    (httpStatus >= 500 ? 'INTERNAL_ERROR' : 'UNKNOWN');

  // Confia apenas no `code` do envelope se ele for um codigo conhecido;
  // a mensagem exibida sempre vem da tabela segura local.
  const envelopeCode = readEnvelopeCode(body);
  const finalCode: ApiErrorCode = envelopeCode ?? code;

  return new ApiError({
    code: finalCode,
    kind: 'http',
    httpStatus,
    message: safeMessageFor(finalCode),
  });
}

function readEnvelopeCode(body: unknown): ApiErrorCode | undefined {
  if (typeof body !== 'object' || body === null) {
    return undefined;
  }
  const error = (body as { error?: unknown }).error;
  if (typeof error !== 'object' || error === null) {
    return undefined;
  }
  const raw = (error as { code?: unknown }).code;
  if (typeof raw !== 'string') {
    return undefined;
  }
  const known: ApiErrorCode[] = [
    'UNAUTHENTICATED',
    'FORBIDDEN',
    'NOT_FOUND',
    'VALIDATION_ERROR',
    'RATE_LIMITED',
    'INTERNAL_ERROR',
  ];
  return known.includes(raw as ApiErrorCode)
    ? (raw as ApiErrorCode)
    : undefined;
}
