import type {JsonObject, JsonValue} from '@croct/json';
import type {FetchOptions as BaseFetchOptions, FetchResponse} from '@croct/plug/plug';
import type {SlotContent, VersionedSlotId} from '@croct/plug/slot';
import {ContentFetcher, type DynamicContentOptions, type StaticContentOptions} from '@croct/sdk/contentFetcher';
import {type EvaluationOptions, Evaluator} from '@croct/sdk/evaluator';
import type {APIContext, AstroGlobal} from 'astro';
import {isSSG} from './environment';

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
    ...(
      isSSG(astro)
        ? {fetchOptions: {static: true}}
        : {
          clientAgent: astro.request
            .headers
            .get('user-agent') ?? undefined,
          clientIp: astro.clientAddress,
          clientId: astro.locals.clientId,
          fetchOptions: {
            static: false,
            preferredLocale: astro.preferredLocale,
            previewToken: astro.locals.croctPreview,
          },
        }
    ),
    timeout: Number(import.meta.env.CROCT_TIMEOUT ?? 1000),
    context: {
      page: {
        url: astro.url.toString(),
        referrer: astro.request
          .headers
          .get('referer') ?? undefined,
      },
    },
  });
}

type InnerFetchOptions =
  Omit<StaticContentOptions, keyof EvaluationOptions>
  | Omit<DynamicContentOptions, keyof EvaluationOptions>;

type AstroCroctOptions = Pick<
  EvaluationOptions,
  keyof DynamicContentOptions & keyof EvaluationOptions
> & {
  evaluationOptions?: Omit<EvaluationOptions, keyof DynamicContentOptions>,
  fetchOptions?: InnerFetchOptions,
};

type FetchOptions = BaseFetchOptions;

export class AstroCroct {
  private options: Pick<
    EvaluationOptions,
    keyof DynamicContentOptions & keyof EvaluationOptions
  >;

  private evaluationOptions: Omit<
    EvaluationOptions,
    keyof DynamicContentOptions
  >;

  private fetchOptions: InnerFetchOptions;

  public constructor(options: AstroCroctOptions) {
    const {evaluationOptions, fetchOptions, ...common} = options;

    this.options = common;
    this.evaluationOptions = evaluationOptions ?? {};
    this.fetchOptions = fetchOptions ?? {};
  }

  public evaluate(
    query: string,
    options: EvaluationOptions = {},
  ): Promise<JsonValue> {
    return evaluator.evaluate(query, {
      ...this.options,
      ...this.evaluationOptions,
      ...options,
    });
  }

  public async fetch<
    C extends JsonObject,
    I extends VersionedSlotId = VersionedSlotId,
  >(
    slotId: I,
    options: FetchOptions = {},
  ): Promise<Partial<FetchResponse<I, C>>> {
    const [id, version = 'latest'] = slotId.split('@') as [
      string,
      `${number}` | 'latest' | undefined,
    ];

    try {
      return await contentFetcher.fetch<SlotContent<I, C>>(id, {
        ...this.options,
        ...this.fetchOptions,
        ...options,
        version: version === 'latest' ? undefined : version,
      });
    } catch (error) {
      console.error(error);

      return {};
    }
  }
}
