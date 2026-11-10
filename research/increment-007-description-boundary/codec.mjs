// Node-only qualification adapter; frozen Stage A remains unchanged.
import parser from '../increment-007-stage-a/node_modules/jsonc-parser/lib/umd/main.js';
import {makeCodec, preflight} from '../increment-007-stage-a/codec.mjs';

export const tokenDescriptionLimit = 1024;
const base = makeCodec(parser);
// Own data descriptors keep malformed shapes from invoking inherited accessors.
const data = (object, key) => object && typeof object === 'object'
  ? Object.getOwnPropertyDescriptor(object, key)?.value : undefined;
function guard(snapshot) {
  const tokens = data(snapshot, 'tokens');
  if (!Array.isArray(tokens)) return; // Base codec owns shape/type rejection.
  for (let i = 0; i < tokens.length; i++) {
    const description = data(data(tokens, String(i)), 'description');
    if (typeof description === 'string' && description.length > tokenDescriptionLimit) {
      const path = `snapshot.tokens[${i}].description`;
      throw Object.assign(new Error(`token-description-size ${path}`), {
        code:'token-description-size', path, observed:description.length,
      });
    }
  }
}
export const codec = {
  encode(snapshot) {
    preflight(snapshot); // Reject non-data and bound traversal before accessing fields.
    guard(snapshot);
    return base.encode(snapshot);
  },
  decode(bytes) {
    const result = base.decode(bytes); // Strict lexical/shape/resource checks remain first.
    guard(result.snapshot);
    return result;
  },
  scan: base.scan, // Lexical inspection alone does not establish snapshot admission.
};
