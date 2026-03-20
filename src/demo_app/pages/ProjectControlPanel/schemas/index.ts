import type { Industry, IndustrySchema } from "./types";

import constructionSchema from "./schema.construction.json";
import architectureSchema from "./schema.architecture.json";
import logisticsSchema from "./schema.logistics.json";
import landscapeSchema from "./schema.landscape.json";
import entertainmentSchema from "./schema.entertainment.json";

// Re-export types
export type {
  Industry,
  FieldType,
  VisibleWhenRule,
  FieldDef,
  SectionDef,
  IndustrySchema,
  GlobalSettings,
  FormState,
  OutputFormat,
} from "./types";

// Re-export constants
export {
  DEFAULT_GLOBAL_SETTINGS,
  INDUSTRIES,
  DEFAULT_PRESERVE_FIELDS,
  OUTPUT_FORMAT_OPTIONS,
} from "./types";

const schemas: Record<Industry, IndustrySchema> = {
  "Construction (Design + Build)": constructionSchema as IndustrySchema,
  "Architecture Design": architectureSchema as IndustrySchema,
  "Logistics": logisticsSchema as IndustrySchema,
  "Landscape Design + Construction": landscapeSchema as IndustrySchema,
  "Entertainment Production + Deployment": entertainmentSchema as IndustrySchema,
};

export function getSchema(industry: Industry): IndustrySchema {
  const schema = schemas[industry];
  if (!schema) {
    throw new Error(`Schema not found for industry: ${industry}`);
  }
  return schema;
}

export function getSchemaDefaults(schema: IndustrySchema): Record<string, any> {
  const defaults: Record<string, any> = {};
  for (const section of schema.sections) {
    for (const field of section.fields) {
      if (field.default !== undefined) {
        defaults[field.id] = field.default;
      }
    }
  }
  return defaults;
}

export function isFieldVisible(
  field: { visibleWhen?: { field: string; equals?: any; in?: any[] } },
  values: Record<string, any>
): boolean {
  if (!field.visibleWhen) return true;

  const { field: dependentField, equals, in: inArray } = field.visibleWhen;
  const currentValue = values[dependentField];

  if (equals !== undefined) {
    return currentValue === equals;
  }

  if (inArray !== undefined) {
    return inArray.includes(currentValue);
  }

  return true;
}

export { constructionSchema, architectureSchema, logisticsSchema, landscapeSchema, entertainmentSchema };
