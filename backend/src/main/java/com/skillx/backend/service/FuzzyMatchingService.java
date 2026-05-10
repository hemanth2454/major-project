package com.skillx.backend.service;

import org.springframework.stereotype.Service;
import java.util.stream.IntStream;

/**
 * FuzzyMatchingService - The backend implementation of the "Fozzi" Algorithm.
 * Use this service to match skills and users based on textual similarity.
 */
@Service
public class FuzzyMatchingService {

    /**
     * Calculates the similarity score between two strings using Levenshtein Distance.
     * @param s1 First string
     * @param s2 Second string
     * @returns Similarity score between 0.0 and 1.0
     */
    public double calculateSimilarity(String s1, String s2) {
        if (s1 == null || s2 == null) return 0.0;
        if (s1.equalsIgnoreCase(s2)) return 1.0;

        String str1 = s1.toLowerCase().trim();
        String str2 = s2.toLowerCase().trim();

        // 1. Inclusion check
        if (str1.contains(str2) || str2.contains(str1)) {
            double ratio = (double) Math.min(str1.length(), str2.length()) / Math.max(str1.length(), str2.length());
            return 0.7 + (ratio * 0.3);
        }

        // 2. Levenshtein Distance
        int distance = calculateLevenshteinDistance(str1, str2);
        int maxLength = Math.max(str1.length(), str2.length());
        
        return 1.0 - ((double) distance / maxLength);
    }

    private int calculateLevenshteinDistance(String x, String y) {
        int[][] dp = new int[x.length() + 1][y.length() + 1];

        for (int i = 0; i <= x.length(); i++) {
            for (int j = 0; j <= y.length(); j++) {
                if (i == 0) {
                    dp[i][j] = j;
                } else if (j == 0) {
                    dp[i][j] = i;
                } else {
                    dp[i][j] = min(
                        dp[i - 1][j - 1] + (x.charAt(i - 1) == y.charAt(j - 1) ? 0 : 1),
                        dp[i - 1][j] + 1,
                        dp[i][j - 1] + 1
                    );
                }
            }
        }
        return dp[x.length()][y.length()];
    }

    private int min(int... numbers) {
        return IntStream.of(numbers).min().orElse(Integer.MAX_VALUE);
    }
}
