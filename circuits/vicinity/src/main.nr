fn main(
    // User's current location (private)
    user_lat: Field,
    user_lon: Field,
    // Landmark's location (public)
    landmark_lat: pub Field,
    landmark_lon: pub Field,
    max_distance: pub Field,
) {
    // Calculate the differences in scaled coordinates
    let delta_lat = user_lat - landmark_lat;
    let delta_lon = user_lon - landmark_lon;

    // Compute squared differences
    let delta_lat_sq = delta_lat * delta_lat;
    let delta_lon_sq = delta_lon * delta_lon;

    // Sum of squared differences
    let sum_squares = delta_lat_sq + delta_lon_sq;

    // Constrain the sum to be within the threshold (scaled 50 meters)
    // Threshold is 202,500 which is 450^2 (0.00045 degrees * 1e6 scaling)
    assert(sum_squares as i64 <= max_distance as i64, "User is too far from the landmark");
}
