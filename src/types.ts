export enum TransformationType {
  ReplaceAll = "ReplaceAll",
  ReplaceOne = "ReplaceOne",
  UrlEncode = "UrlEncode",
  UrlDecode = "UrlDecode"
}

export interface TransformationRule {
  type: TransformationType;
  searchValue: string;
  replaceValue: string;
  target: number;
}

export interface Rule {
  id: string;
  name: string;
  description: string;
  inputPattern: string;
  outputPattern: string;
  transformationRules: TransformationRule[];
  isActive: boolean;
}

export interface RuleStorage {
  rules: Rule[];
} 