import React from 'react';
import NextLink from 'next/link';

const Link = React.forwardRef(({ className, href, hrefAs, children, ...otherProps }, ref) => (
  <NextLink href={href} as={hrefAs}>
    <a className={className} {...otherProps} ref={ref}>
      { children }
    </a>
  </NextLink>
));

export default Link;
