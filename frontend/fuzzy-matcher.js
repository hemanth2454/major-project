/**
 * FuzzyMatcher Utility - The "Fozzi" Algorithm
 * Implements Levenshtein Distance and Token-based similarity for skill matching.
 */
class FuzzyMatcher {
    /**
     * Calculates the similarity score between two strings (0 to 1).
     * @param {string} s1 First string
     * @param {string} s2 Second string
     * @returns {number} Similarity score
     */
    static calculateSimilarity(s1, s2) {
        if (!s1 || !s2) return 0;
        
        s1 = s1.toLowerCase().trim();
        s2 = s2.toLowerCase().trim();
        
        if (s1 === s2) return 1.0;
        
        // 1. Direct inclusion check
        if (s1.includes(s2) || s2.includes(s1)) {
            const ratio = Math.min(s1.length, s2.length) / Math.max(s1.length, s2.length);
            return 0.7 + (ratio * 0.3); // High base score for inclusion
        }
        
        // 2. Levenshtein Distance
        const distance = this.levenshteinDistance(s1, s2);
        const maxLength = Math.max(s1.length, s2.length);
        const levScore = 1 - (distance / maxLength);
        
        // 3. Token-based similarity (for multi-word skills)
        const tokens1 = s1.split(/\s+/);
        const tokens2 = s2.split(/\s+/);
        let tokenMatches = 0;
        
        tokens1.forEach(t1 => {
            if (tokens2.some(t2 => t2.includes(t1) || t1.includes(t2))) {
                tokenMatches++;
            }
        });
        
        const tokenScore = tokens1.length > 0 ? tokenMatches / Math.max(tokens1.length, tokens2.length) : 0;
        
        // Weighted average
        return (levScore * 0.4) + (tokenScore * 0.6);
    }

    /**
     * Standard Levenshtein Distance algorithm.
     */
    static levenshteinDistance(a, b) {
        const matrix = [];
        for (let i = 0; i <= b.length; i++) matrix[i] = [i];
        for (let j = 0; j <= a.length; j++) matrix[0][j] = j;

        for (let i = 1; i <= b.length; i++) {
            for (let j = 1; j <= a.length; j++) {
                if (b.charAt(i - 1) === a.charAt(j - 1)) {
                    matrix[i][j] = matrix[i - 1][j - 1];
                } else {
                    matrix[i][j] = Math.min(
                        matrix[i - 1][j - 1] + 1, // substitution
                        matrix[i][j - 1] + 1,     // insertion
                        matrix[i - 1][j] + 1      // deletion
                    );
                }
            }
        }
        return matrix[b.length][a.length];
    }

    /**
     * Filters and ranks a list of objects based on a query string.
     * @param {string} query The search query
     * @param {Array} list List of objects to search
     * @param {Array} keys Keys to match against (e.g., ['title', 'desc'])
     * @returns {Array} Ranked list with 'fozziScore' property
     */
    static match(query, list, keys) {
        if (!query) return list.map(item => ({ ...item, fozziScore: 0 }));
        
        return list
            .map(item => {
                let maxScore = 0;
                keys.forEach(key => {
                    const score = this.calculateSimilarity(query, item[key] || "");
                    if (score > maxScore) maxScore = score;
                });
                return { ...item, fozziScore: Math.round(maxScore * 100) };
            })
            .filter(item => item.fozziScore > 20) // Threshold
            .sort((a, b) => b.fozziScore - a.fozziScore);
    }
}

// Export for browser
window.FuzzyMatcher = FuzzyMatcher;
