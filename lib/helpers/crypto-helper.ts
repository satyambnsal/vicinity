// Define types for the key objects
export interface KeyObject {
  type: 'private' | 'public';
  asymmetricKeyType: string;
  pem: string;
  data: string;
  export: () => string;
}

// Define input types
export type KeyInput =
  | string
  | Buffer
  | {
      key?: string | Buffer;
      pem?: string | Buffer;
      type?: string;
      [key: string]: any;
    };

/**
 * Parse PEM formatted private key without requiring crypto module
 * @param {KeyInput} pem - PEM content as string, Buffer, or object with key property
 * @returns {KeyObject} - Key object that can be used with React Native crypto libraries
 */
export const createPrivateKey = (pem: KeyInput): KeyObject => {
  // Handle different input types
  let pemString = '';

  if (Buffer.isBuffer(pem)) {
    pemString = pem.toString('utf8');
  } else if (typeof pem === 'object' && pem !== null) {
    if (pem.key) {
      return createPrivateKey(pem.key);
    }
    if (pem.pem) {
      return createPrivateKey(pem.pem);
    }
    throw new TypeError('Invalid private key input');
  } else if (typeof pem === 'string') {
    pemString = pem;
  } else {
    throw new TypeError(
      'Private key must be a string, Buffer, or object with key property',
    );
  }

  // Validate PEM format
  if (
    !pemString.includes('-----BEGIN') ||
    !pemString.includes('PRIVATE KEY-----')
  ) {
    throw new Error('Invalid PEM format for private key');
  }

  // Extract key data between headers and footers
  const keyData = extractPemData(pemString);

  // Parse key type
  const keyType = determineKeyType(pemString);

  // Construct and return key object
  return {
    type: 'private',
    asymmetricKeyType: keyType,
    pem: pemString,
    data: keyData,
    // Add additional properties depending on your needs
    export: () => pemString,
  };
};

/**
 * Parse PEM formatted public key without requiring crypto module
 * @param {KeyInput} pem - PEM content as string, Buffer, or object with key property
 * @returns {KeyObject} - Key object that can be used with React Native crypto libraries
 */
export const createPublicKey = (pem: KeyInput): KeyObject => {
  // Handle different input types
  let pemString = '';

  if (Buffer.isBuffer(pem)) {
    pemString = pem.toString('utf8');
  } else if (typeof pem === 'object' && pem !== null) {
    // Check if we received a private key object
    if (pem.type === 'private') {
      // In a real implementation, we would extract the public key from the private key
      // This would require actual crypto operations, so for this implementation
      // we'll throw an error
      throw new Error(
        'Extracting public key from private key object requires crypto operations',
      );
    }

    if (pem.key) {
      return createPublicKey(pem.key);
    }
    if (pem.pem) {
      return createPublicKey(pem.pem);
    }
    throw new TypeError('Invalid public key input');
  } else if (typeof pem === 'string') {
    pemString = pem;
  } else {
    throw new TypeError(
      'Public key must be a string, Buffer, or object with key property',
    );
  }

  // Validate PEM format
  if (
    !pemString.includes('-----BEGIN') ||
    (!pemString.includes('PUBLIC KEY-----') &&
      !pemString.includes('CERTIFICATE-----'))
  ) {
    throw new Error('Invalid PEM format for public key');
  }

  // Extract key data between headers and footers
  const keyData = extractPemData(pemString);

  // Parse key type
  const keyType = determineKeyType(pemString);

  // Construct and return key object
  return {
    type: 'public',
    asymmetricKeyType: keyType,
    pem: pemString,
    data: keyData,
    // Add additional properties depending on your needs
    export: () => pemString,
  };
};

/**
 * Helper function to extract the base64 data from a PEM string
 * @param {string} pemString - PEM formatted string
 * @returns {string} - Extracted base64 data
 */
const extractPemData = (pemString: string): string => {
  // Remove headers, footers, and whitespace
  const lines = pemString.split('\n');
  const data = lines
    .filter(
      line =>
        !line.includes('-----BEGIN') &&
        !line.includes('-----END') &&
        line.trim().length > 0,
    )
    .join('');

  return data;
};

/**
 * Determine the key type from PEM contents
 * @param {string} pemString - PEM formatted string
 * @returns {string} - Key type (rsa, ec, dsa, etc.)
 */
const determineKeyType = (pemString: string): string => {
  if (
    pemString.includes('RSA PRIVATE KEY') ||
    pemString.includes('RSA PUBLIC KEY')
  ) {
    return 'rsa';
  } else if (
    pemString.includes('EC PRIVATE KEY') ||
    pemString.includes('EC PUBLIC KEY')
  ) {
    return 'ec';
  } else if (
    pemString.includes('DSA PRIVATE KEY') ||
    pemString.includes('DSA PUBLIC KEY')
  ) {
    return 'dsa';
  } else if (
    pemString.includes('PRIVATE KEY') ||
    pemString.includes('PUBLIC KEY')
  ) {
    // Generic key type, might be PKCS#8
    // To determine exactly, we would need to parse ASN.1 which is complex
    return 'rsa'; // Default to RSA as it's most common
  } else if (pemString.includes('CERTIFICATE')) {
    return 'rsa'; // Most certificates use RSA
  }

  return 'unknown';
};

/**
 * Examples of PEM formatted keys
 */
export const examples = {
  privateKey: `-----BEGIN RSA PRIVATE KEY-----
MIIEpAIBAAKCAQEAo8uCyhiO4JUGMFV6+rD6FEWt49jz1Lc8qhEJMzbY06nBRgw+
QQP6kX4WuCM5wdiwS0DqYdu2AGsCeiNQQvYQbFWKaC7NUWoVjlPompCju5yT5Tk3
...
fQIDAQAB
-----END RSA PRIVATE KEY-----`,

  publicKey: `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAo8uCyhiO4JUGMFV6+rD6
FEWt49jz1Lc8qhEJMzbY06nBRgw+QQP6kX4WuCM5wdiwS0DqYdu2AGsCeiNQQvYQ
...
fQIDAQAB
-----END PUBLIC KEY-----`,
};

/**
 * Example of how to use the utility functions
 */
export const exampleUsage = (): {
  privateKey: KeyObject;
  publicKey: KeyObject;
} => {
  // Parse keys
  const privateKey = createPrivateKey(examples.privateKey);
  const publicKey = createPublicKey(examples.publicKey);

  console.log('Private key type:', privateKey.asymmetricKeyType);
  console.log('Public key type:', publicKey.asymmetricKeyType);

  return {privateKey, publicKey};
};
