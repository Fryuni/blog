type FetchedHTML = {
  html: string;
  mediaType: DOMParserSupportedType;

  /**
   * If there was a redirect, this will be the final URL of the page.
   */
  redirected?: string;
};

async function fetchHTML(href: string, init?: RequestInit): Promise<FetchedHTML | null> {
  try {
    const response = await fetch(href, init);

    const contentType = response.headers.get('content-type') ?? '';

    const mediaType = contentType.split(';', 1)[0].trim();

    if (mediaType !== 'text/html' && mediaType !== 'application/xhtml+xml') {
      // Not an HTML page that we can parse, let the browser handle it.
      return null;
    }

    const html = await response.text();

    return {
      html,
      mediaType,
      redirected: response.redirected ? response.url : undefined,
    };
  } catch {
    // If there is an error loading the page let the browser handle it and show the error
    // page to the user.
    return null;
  }
}

let parser: DOMParser | undefined;

type LoadedPage = {
  doc: Document;
  redirected?: string;
};

async function loadPage(href: string, init?: RequestInit): Promise<LoadedPage | null> {
  const response = await fetchHTML(href, init);
  if (!response) return null;

  const { html, mediaType, redirected } = response;

  // Initialize the parser if it wasn't initialized yet.
  parser ??= new DOMParser();

  const doc = parser.parseFromString(html, mediaType);
  /// From Astro's source: https://github.com/withastro/astro/blob/8a0def2b6c/packages/astro/src/transitions/router.ts#L481-L485
  // The next line might look like a hack,
  // but it is actually necessary as noscript elements
  // and their contents are returned as markup by the parser,
  // see https://developer.mozilla.org/en-US/docs/Web/API/DOMParser/parseFromString
  doc.querySelectorAll('noscript').forEach((el) => el.remove());

  return { doc, redirected };
}

export async function navigateTo(url: string) {
  const loadedPage = await loadPage(url);
  if (!loadedPage) return;

  const { doc, redirected } = loadedPage;

  function updateDOM() {
    // Add the new url to the browser's history
    history.pushState({}, '', redirected ?? url);

    document.documentElement.replaceWith(doc.documentElement);
  }

  if (!document.startViewTransition) {
    // If the browser doesn't support startViewTransition, just update the DOM.
    updateDOM();
    return;
  }

  const transition = document.startViewTransition(() => updateDOM());

  await transition.finished;
}
