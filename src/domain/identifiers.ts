declare const componentDefinitionIdBrand: unique symbol;
declare const projectIdBrand: unique symbol;
declare const themePresetIdBrand: unique symbol;
declare const tokenGroupIdBrand: unique symbol;
declare const tokenIdBrand: unique symbol;
declare const variationAxisIdBrand: unique symbol;
declare const variationOptionIdBrand: unique symbol;

export type ComponentDefinitionId = string & {
  readonly [componentDefinitionIdBrand]: "ComponentDefinitionId";
};

export type ProjectId = string & {
  readonly [projectIdBrand]: "ProjectId";
};

export type ThemePresetId = string & {
  readonly [themePresetIdBrand]: "ThemePresetId";
};

export type TokenGroupId = string & {
  readonly [tokenGroupIdBrand]: "TokenGroupId";
};

export type TokenId = string & {
  readonly [tokenIdBrand]: "TokenId";
};

export type VariationAxisId = string & {
  readonly [variationAxisIdBrand]: "VariationAxisId";
};

export type VariationOptionId = string & {
  readonly [variationOptionIdBrand]: "VariationOptionId";
};
