/**
 * Utility for scoring calculations and validations.
 */

export function calculateOverallScore(scores) {
    const { technical, clarity, communication, logic } = scores;
    const total = (technical || 0) + (clarity || 0) + (communication || 0) + (logic || 0);
    return Math.round(total / 4);
}

export function validateScores(scores) {
    const required = ["technical", "clarity", "communication", "logic"];
    for (const key of required) {
        if (typeof scores[key] !== "number") {
            scores[key] = 5; // Default if LLM fails
        }
        scores[key] = Math.max(0, Math.min(10, scores[key]));
    }
    return scores;
}
