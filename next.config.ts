import createMDX from '@next/mdx';
import createNextIntlPlugin from 'next-intl/plugin';

const withMDX = createMDX({ extension: /\.mdx?$/ });
const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig = {
  experimental: { mdxRs: true },
  pageExtensions: ['ts', 'tsx', 'mdx']
};

export default withNextIntl(withMDX(nextConfig));
