use jwt::JWT;
// Maximum length for the partial data after SHA256 processing
global MAX_PARTIAL_DATA_LENGTH: u32 = 256;

// Main function of the circuit that proves a user is within vicinity of a landmark
// while verifying the proof request comes from an authorized app via JWT verification
fn main(
    // Private inputs: User's location coordinates (scaled and offset to positive integers)
    // Formula: Math.round((actual_coordinate + 90) * 1e6)
    user_lat: Field, // User's latitude as a positive integer (actual_lat + 90) * 1e6
    user_lon: Field, // User's longitude as a positive integer (actual_lon + 90) * 1e6
    // Public inputs: Landmark location and maximum allowed distance
    landmark_lat: pub Field, // Landmark's latitude (scaled and offset like user coordinates)
    landmark_lon: pub Field, // Landmark's longitude (scaled and offset like user coordinates)
    max_distance: pub Field, // Maximum allowed squared distance between user and landmark
    // JWT verification parameters
    partial_data: BoundedVec<u8, MAX_PARTIAL_DATA_LENGTH>, // Remaining data after partial SHA256
    partial_hash: [u32; 8], // First part of SHA256 hash (8 limbs of 32 bits each)
    full_data_length: u32, // Total length of the JWT data before partial hashing
    base64_decode_offset: u32, // Index to start base64 decoding (should be 1, 2, or 3 for partial SHA)
    // RSA signature verification parameters
    pubkey_modulus_limbs: pub [Field; 18], // RSA public key modulus in 18 limbs
    redc_params_limbs: [Field; 18], // Montgomery reduction parameters for bignum operations
    signature_limbs: [Field; 18], // RSA signature of the JWT in 18 limbs
) {
    // Initialize JWT verification with partial hash to optimize circuit constraints
    let jwt = JWT::init_with_partial_hash(
        partial_data,
        partial_hash,
        full_data_length,
        base64_decode_offset,
        pubkey_modulus_limbs,
        redc_params_limbs,
        signature_limbs,
    );

    // Verify JWT signature is valid
    jwt.verify();

    // Verify JWT was issued by the authorized "vicinity" app
    // This prevents fake proofs from unauthorized applications
    jwt.assert_claim_string("sub".as_bytes(), BoundedVec::<u8, 8>::from_array("vicinity".as_bytes()));

    // Calculate the differences in scaled coordinates
    let delta_lat = user_lat - landmark_lat;
    let delta_lon = user_lon - landmark_lon;

    // Compute squared differences for distance calculation
    // Using squared distances avoids having to compute square roots
    let delta_lat_sq = delta_lat * delta_lat;
    let delta_lon_sq = delta_lon * delta_lon;

    // Sum of squared differences approximates squared distance
    // This works because coordinates are scaled uniformly (by 1e6)
    let sum_squares = delta_lat_sq + delta_lon_sq;

    // Assert that squared distance is within allowed threshold
    // The threshold max_distance should be scaled appropriately for the coordinate scaling
    assert(sum_squares as i64 <= max_distance as i64, "User is too far from the landmark");
}
