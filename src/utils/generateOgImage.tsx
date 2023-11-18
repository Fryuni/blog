import {BaseDatetime, type DatetimeFormatting} from '@components/Datetime';
import {SITE} from '@config';
import {Resvg} from '@resvg/resvg-js';
import type React from 'react';
import satori, {type SatoriOptions} from 'satori';

// Regular Font
const fontRegular: ArrayBuffer = await fetch(
  'https://www.1001fonts.com/download/font/ibm-plex-mono.regular.ttf',
).then(response => response.arrayBuffer());

// Bold Font
const fontBold: ArrayBuffer = await fetch(
  'https://www.1001fonts.com/download/font/ibm-plex-mono.bold.ttf',
).then(response => response.arrayBuffer());

const ogImage = (
  text: string,
  datetime?: DatetimeFormatting,
): React.JSX.Element => (
  <div
    style={{
      background: '#fefbfb',
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <div
      style={{
        position: 'absolute',
        top: '-1px',
        right: '-1px',
        border: '4px solid #000',
        background: '#ecebeb',
        opacity: '0.9',
        borderRadius: '4px',
        display: 'flex',
        justifyContent: 'center',
        margin: '2.5rem',
        width: '88%',
        height: '80%',
      }}
    />

    <div
      style={{
        border: '4px solid #000',
        background: '#fefbfb',
        borderRadius: '4px',
        display: 'flex',
        justifyContent: 'center',
        margin: '2rem',
        width: '88%',
        height: '80%',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          margin: '20px',
          width: '90%',
          height: '90%',
        }}
      >
        <p
          style={{
            fontSize: 72,
            fontWeight: 'bold',
            maxHeight: '84%',
            overflow: 'hidden',
          }}
        >
          {text}
        </p>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            width: '100%',
            marginBottom: '8px',
            fontSize: 28,
          }}
        >
          <span>
            {datetime != null && (
              <>
                on
                <span
                  style={{
                    color: 'transparent',
                  }}
                >
                  "
                </span>
                <span style={{overflow: 'hidden', fontWeight: 'bold'}}>
                  <BaseDatetime {...datetime} />
                </span>
                <span
                  style={{
                    color: 'transparent',
                  }}
                >
                  "
                </span>
              </>
            )}
            by
            <span
              style={{
                color: 'transparent',
              }}
            >
              "
            </span>
            <span style={{overflow: 'hidden', fontWeight: 'bold'}}>
              {SITE.author}
            </span>
          </span>

          <span style={{overflow: 'hidden', fontWeight: 'bold'}}>
            {SITE.title}
          </span>
        </div>
      </div>
    </div>
  </div>
);

const options: SatoriOptions = {
  width: 1200,
  height: 630,
  embedFont: true,
  fonts: [
    {
      name: 'IBM Plex Mono',
      data: fontRegular,
      weight: 400,
      style: 'normal',
    },
    {
      name: 'IBM Plex Mono',
      data: fontBold,
      weight: 600,
      style: 'normal',
    },
  ],
};

type Result = {
  svg: string,
  getPng: () => Buffer,
};

export const generateOgImage = async (
  mytext?: string,
  datetime?: DatetimeFormatting,
): Promise<Result> => {
  const svg = await satori(ogImage(mytext ?? SITE.title, datetime), options);

  return {
    svg,
    getPng: () => new Resvg(svg).render().asPng(),
  };
};
