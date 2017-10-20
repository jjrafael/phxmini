const apiConstantsKeys = {
  Global: [
    'wagerLimitsGroups',
    'outcomeWagerLimitsActions',
    'liabilityIndicatorsActions',
    'voidReasons',
    'placeTerms',
    'cancelReasons',
    'closureReasons',
    'accountStatuses'
  ],
  'Risk Manager': ['riskColumns', 'riskSports'],
  'Customer Manager': [
    'voidReasons',
    'cancelReasons',
    'closureReasons',
    'accountStatuses',
    'performancePeriods',
    'riskSports',
    'outcomeWagerLimitsActions',
    'playerProfiles',
    'languages',
    'countries',
    'referralMethods',
    'currencies',
    'securityQuestions',
    'origins',
    'lines',
    'packages',
    'priceFormats',
    'accountTypes',
    'priceFormatsLong',
    'wagerLimitsGroupsDescription'
  ],
  'Event Creator': [
    'riskSports',
    'countries',
    'templates',
    'tags',
    'placeTerms',
    'bookTypes'
  ],
  'Results Verifier': ['riskSports'],
  'Instant Action': ['riskSports', 'allOrigins', 'channels', 'brands'],
  'Operator Manager': [
    'accountStatuses',
    'currencies',
    'languages',
    'origins',
    'priceFormatsShort'
  ],
}

export default apiConstantsKeys
