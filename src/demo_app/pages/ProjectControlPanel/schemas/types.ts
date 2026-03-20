// Schema types for dynamic form generation

export type Industry =
  | "Construction (Design + Build)"
  | "Landscape Design + Construction"
  | "Architecture Design"
  | "Logistics"
  | "Entertainment Production + Deployment";

export type FieldType =
  | "text"
  | "textarea"
  | "number"
  | "date"
  | "select"
  | "multiSelect"
  | "toggle";

export interface VisibleWhenRule {
  field: string;
  equals?: any;
  in?: any[];
}

export interface FieldDef {
  id: string;
  type: FieldType;
  label: string;
  required?: boolean;
  default?: any;
  options?: any[];
  placeholder?: string;
  help?: string;
  min?: number;
  max?: number;
  rows?: number;
  visibleWhen?: VisibleWhenRule;
}

export interface SectionDef {
  id: string;
  title: string;
  columns?: number;
  fields: FieldDef[];
}

export interface IndustrySchema {
  schemaVersion: string;
  industry: Industry;
  title: string;
  description?: string;
  sections: SectionDef[];
}

export type OutputFormat = "Markdown Table" | "CSV" | "JSON" | "Excel";

export const OUTPUT_FORMAT_OPTIONS: OutputFormat[] = [
  "Markdown Table",
  "CSV",
  "JSON",
  "Excel",
];

export interface GlobalSettings {
  integrations: {
    weatherImpact: boolean;
    costCalibration: boolean;
    versionControl: boolean;
  };
  output: {
    outputFormat: OutputFormat;
    includeAssumptions: boolean;
  };
}

export interface FormState {
  industry: Industry;
  values: Record<string, any>;
  globalSettings: GlobalSettings;
}

export const DEFAULT_GLOBAL_SETTINGS: GlobalSettings = {
  integrations: {
    weatherImpact: true,
    costCalibration: true,
    versionControl: true,
  },
  output: {
    outputFormat: "Markdown Table",
    includeAssumptions: true,
  },
};

export const INDUSTRIES: Industry[] = [
  "Construction (Design + Build)",
  "Landscape Design + Construction",
  "Architecture Design",
  "Logistics",
  "Entertainment Production + Deployment",
];

export const DEFAULT_PRESERVE_FIELDS: string[] = [
  "projectName",
  "projectLocation",
  "projectStartDate",
  "marketYear",
  "projectPrompt",
];
