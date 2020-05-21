import React from 'react';
import NextLink from 'next/link';

const Link = React.forwardRef(({ className, href, hrefAs, children, prefetch, ...otherProps }, ref) => (
  <NextLink href={href} as={hrefAs} prefetch ref={ref}>
    <a className={className} {...otherProps}>
      { children }
    </a>
  </NextLink>
));

export default Link;
