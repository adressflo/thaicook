import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async ({ locale }) => ({
  locale: locale as string, // Explicitly cast to string // Add this line
  messages: (await import(`./messages/${locale}.json`)).default
}));