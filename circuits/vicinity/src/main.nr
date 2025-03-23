use jwt::JWT;
global MAX_PARTIAL_DATA_LENGTH: u32 = 256;

fn main(
    user_lat: Field,
    user_lon: Field,
    landmark_lat: pub Field,
    landmark_lon: pub Field,
    max_distance: pub Field,
    partial_data: BoundedVec<u8, MAX_PARTIAL_DATA_LENGTH>,
    partial_hash: [u32; 8],
    full_data_length: u32,
    base64_decode_offset: u32,
    pubkey_modulus_limbs: pub [Field; 18],
    redc_params_limbs: [Field; 18],
    signature_limbs: [Field; 18],
) {
    let jwt = JWT::init_with_partial_hash(
        partial_data,
        partial_hash,
        full_data_length,
        base64_decode_offset,
        pubkey_modulus_limbs,
        redc_params_limbs,
        signature_limbs,
    );

    jwt.verify();
    jwt.assert_claim_string("sub".as_bytes(), BoundedVec::<u8, 8>::from_array("vicinity".as_bytes()));

    // Calculate the differences in scaled coordinates
    let delta_lat = user_lat - landmark_lat;
    let delta_lon = user_lon - landmark_lon;

    // Compute squared differences
    let delta_lat_sq = delta_lat * delta_lat;
    let delta_lon_sq = delta_lon * delta_lon;

    // Sum of squared differences
    let sum_squares = delta_lat_sq + delta_lon_sq;

    // Constrain the sum to be within the threshold (scaled 50 meters)
    assert(sum_squares as i64 <= max_distance as i64, "User is too far from the landmark");
}
