function calculateThresholdCheck(meters) {
  // Approximate meters per degree at equator (both lat/lon for simplification)
  const METERS_PER_DEGREE = 111195;
  // Fixed-point scaling factor used in circuit (1e6)
  const SCALING_FACTOR = 1e6;

  // Convert meters to degrees (decimal)
  const thresholdDegrees = meters / METERS_PER_DEGREE;

  // Convert to scaled integer (fixed-point representation)
  const scaledThreshold = thresholdDegrees * SCALING_FACTOR;

  // Round to nearest integer and square for distance comparison
  const roundedThreshold = Math.round(scaledThreshold);
  return roundedThreshold * roundedThreshold;
}

// Example usage for 50 meter threshold:
console.log(calculateThresholdCheck(1000)); // Output: 80874049 (matches original example)
