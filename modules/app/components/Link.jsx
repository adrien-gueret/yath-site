import React from 'react';
import NextLink from 'next/link';

const Link = React.forwardRef(({ className, href, hrefAs, children, ...otherProps }, ref) => (
  <NextLink href={href} as={hrefAs} ref={ref}>
    <a className={className} {...otherProps}>
      { children }
    </a>
  </NextLink>
));

export default Link;
