/**
 * Safely extracts JSON from a raw LLM string that might contain markdown fences.
 */
export function extractJSON(raw) {
    try {
        // Try direct parse first
        return JSON.parse(raw);
    } catch {
        // Strip markdown fences if present: ```json ... ```
        const match = raw.match(/```(?:json)?\s*([\s\S]*?)```/);
        if (match) {
            try {
                return JSON.parse(match[1].trim());
            } catch (err) {
                // Continue to next fallback
            }
        }

        // Last resort: grab first {...} block
        const braceMatch = raw.match(/\{[\s\S]*\}/);
        if (braceMatch) {
            try {
                return JSON.parse(braceMatch[0]);
            } catch (err) {
                // Final failure
            }
        }

        console.error("Failed to extract JSON from raw string:", raw);
        throw new Error("Could not extract JSON from LLM response");
    }
}
