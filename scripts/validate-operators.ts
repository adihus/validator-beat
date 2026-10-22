/**
 * Validates all public operator declarations at build time.
 * A valid schema never means the operator's identity or security is independently verified.
 */
import { readOperatorProfiles } from "../lib/operators/data";

try {
  const operators = readOperatorProfiles();
  console.log("Validated " + operators.length + " public operator profile(s).");
} catch (error) {
  console.error(error);
  process.exitCode = 1;
}
