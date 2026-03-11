import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as RNLocalize from 'react-native-localize';

import ptBR from './locales/pt-BR.json';
import enUS from './locales/en-US.json';

const resolveLanguage = (): string => {
    const locales = RNLocalize.getLocales();
    const code = locales[0]?.languageCode ?? 'pt';
    return code === 'pt' ? 'pt-BR' : 'en-US';
};

i18n
    .use(initReactI18next)
    .init({
        resources: {
            'pt-BR': { translation: ptBR },
            'en-US': { translation: enUS },
        },
        lng: resolveLanguage(),
        fallbackLng: 'pt-BR',
        interpolation: { escapeValue: false },
        initImmediate: false,
    });

export default i18n;