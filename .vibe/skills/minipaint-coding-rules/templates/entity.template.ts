// DO NOT MODIFY: This is a template for new entities.
// Usage: Copy this file and fill in the placeholders.

import { ENTITY_NAMEId } from '../types/ENTITY_NAME.types';

export class ENTITY_NAME {
  constructor(
    public readonly id: ENTITY_NAMEId,
    // Add required fields here (use readonly for immutability)
    public readonly field1: TYPE1,
    public readonly field2: TYPE2,
    // Optional fields (provide default values)
    public optionalField: TYPE = DEFAULT_VALUE,
  ) {}

  // Add entity methods here
  // Example: getCompletionRate(): number { ... }
}
