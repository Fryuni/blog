import type { JsonValue, JsonObject } from '@croct/json';
import type { VersionedSlotId } from '@croct/plug/slot';
import type { FetchResponse, FetchOptions } from '@croct/plug/plug';
import {
  ContentFetcher,
  type DynamicContentOptions,
} from '@croct/sdk/contentFetcher';
import { type EvaluationOptions, Evaluator } from '@croct/sdk/evaluator';
import type { APIContext, AstroGlobal } from 'astro';

const evaluator = new Evaluator({
  apiKey: import.meta.env.CROCT_API_KEY,
  logger: console,
});

const contentFetcher = new ContentFetcher({
  apiKey: import.meta.env.CROCT_API_KEY,
  logger: console,
});

export function astroCroct(astro: AstroGlobal | APIContext): AstroCroct {
  return new AstroCroct({
    clientAgent: astro.request.headers.get('user-agent') ?? undefined,
    clientIp: astro.clientAddress,
    clientId: astro.locals.clientId,
    fetchOptions: {
      preferredLocale: astro.preferredLocale,
    },
    context: {
      page: {
        url: astro.url.toString(),
        referrer: astro.request.headers.get('referer') ?? undefined,
      },
    },
  });
}

type AstroCroctOptions = Pick<
  EvaluationOptions,
  keyof DynamicContentOptions & keyof EvaluationOptions
> & {
  evaluationOptions?: Omit<EvaluationOptions, keyof DynamicContentOptions>;
  fetchOptions?: Omit<DynamicContentOptions, keyof EvaluationOptions>;
};

export class AstroCroct {
  private options: Pick<
    EvaluationOptions,
    keyof DynamicContentOptions & keyof EvaluationOptions
  >;

  private evaluationOptions: Omit<
    EvaluationOptions,
    keyof DynamicContentOptions
  >;

  private fetchOptions: Omit<DynamicContentOptions, keyof EvaluationOptions>;

  public constructor(options: AstroCroctOptions) {
    const { evaluationOptions, fetchOptions, ...common } = options;

    this.options = common;
    this.evaluationOptions = evaluationOptions ?? {};
    this.fetchOptions = fetchOptions ?? {};
  }

  public evaluate(
    query: string,
    options: EvaluationOptions = {}
  ): Promise<JsonValue> {
    return evaluator.evaluate(query, {
      ...this.options,
      ...this.evaluationOptions,
      ...options,
    });
  }

  public fetch<
    C extends JsonObject,
    I extends VersionedSlotId = VersionedSlotId,
  >(slotId: I, options: FetchOptions = {}): Promise<FetchResponse<I, C>> {
    const [id, version = 'latest'] = slotId.split('@') as [
      string,
      `${number}` | 'latest' | undefined,
    ];

    return contentFetcher.fetch(id, {
      ...this.options,
      ...this.fetchOptions,
      ...(version === 'latest' ? options : { ...options, version: version }),
    });
  }
}
