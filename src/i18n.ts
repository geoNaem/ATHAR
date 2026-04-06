import { getRequestConfig } from 'next-intl/server';
import { locales } from '@/navigation';

export default getRequestConfig(async ({ locale }) => ({
  locale: locale,
  messages: (await import(`../messages/${locale}.json`)).default
}));
