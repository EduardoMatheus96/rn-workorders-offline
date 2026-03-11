module.exports = {
  getLocales: () => [{ languageCode: 'pt', countryCode: 'BR', languageTag: 'pt-BR', isRTL: false }],
  getNumberFormatSettings: () => ({ decimalSeparator: ',', groupingSeparator: '.' }),
  getCalendar: () => 'gregorian',
  getCountry: () => 'BR',
  getCurrencies: () => ['BRL'],
  getTemperatureUnit: () => 'celsius',
  getTimeZone: () => 'America/Sao_Paulo',
  uses24HourClock: () => true,
  usesMetricSystem: () => true,
  addEventListener: () => ({ remove: () => {} }),
  removeEventListener: () => {},
};