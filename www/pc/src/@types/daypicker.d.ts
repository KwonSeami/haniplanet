declare module 'react-day-picker/lib/src/addons/MomentLocaleUtils' {
    const formatDate: ((date: Date, format: string, locale: string) => string) | undefined;
    const parseDate: ((str: string, format: string, locale: string) => void | Date) | undefined;
}
