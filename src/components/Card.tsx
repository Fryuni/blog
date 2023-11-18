import type {BlogFrontmatter} from '@content/_schemas';
import type React from 'react';
import {Datetime} from './Datetime';

export interface Props {
  href?: string;
  frontmatter: BlogFrontmatter;
  secHeading?: boolean;
}

export function Card({href, frontmatter, secHeading = true}: Props): React.JSX.Element {
  const {title, pubDateTime, description} = frontmatter;
  return (
    <li className="my-6">
      <a
        href={href}
        className="inline-block text-lg font-medium text-skin-accent decoration-dashed underline-offset-4
        focus-visible:no-underline focus-visible:underline-offset-0"
      >
        {secHeading
          ? (
            <h2 className="text-lg font-medium decoration-dashed hover:underline">
              {title}
            </h2>
          )
          : (
            <h3 className="text-lg font-medium decoration-dashed hover:underline">
              {title}
            </h3>
          )}
      </a>
      <Datetime datetime={pubDateTime} />
      <p>{description}</p>
    </li>
  );
}
