# Vicinity: Privacy-Preserving Location-Verified Reviews

Vicinity is a privacy focused review platform that enables users to anonymously share experiences at real-world locations while cryptographically proving they were actually there.

## 🌟 Overview

Vicinity solves a fundamental problem in the online review ecosystem: establishing trust in anonymous reviews. Using zero-knowledge proofs to verify a user's physical presence at a location without revealing their identity, Vicinity creates a trustworthy review ecosystem where:

1. Users can share honest feedback without compromising their privacy
2. Businesses can be confident that reviews come from actual visitors
3. Readers benefit from authentic location-based insights while reviewers remain anonymous

## 🔐 Key Features

- **Proven Location Verification**: The core feature of Vicinity is cryptographic proof that reviewers physically visited a location
- **Complete Anonymity**: Share honest opinions without fear of retaliation or identity exposure
- **Community Curation**: Upvote/downvote system to surface the most helpful reviews
- **Mobile-First Experience**: Available on iOS and Android via React Native
- **Zero Data Collection**: All verification happens client-side with no user tracking

## 🛠️ Technology Stack

### Frontend

- React Native for cross-platform mobile experience
- Noir for proof generation and verification
- Supabase for data storage

### Zero-Knowledge Proofs

- **Noir language** for all ZK circuits
- Custom circuits for secure location verification

## 📊 Zero-Knowledge Circuits

For this hackathon, we're focusing specifically on the location verification aspect:

### Location Verification Circuit

Our primary Noir circuit proves a user was physically present at specific coordinates within a venue's radius without revealing:

- The user's exact location
- The precise time of their visit
- Any identifying information

This enables trustworthy, location-verified content while maintaining complete user privacy.

## 🔄 How It Works

1. **Venue Discovery**: Browse nearby venues or search for specific locations

2. **Secure Location Proof**: When at a venue, the app generates a zero-knowledge proof that you're within the venue's coordinates

3. **Anonymous Review**: Submit your review along with your location proof

4. **Community Engagement**: Other users can view, upvote, or downvote reviews based on helpfulness

## 📱 Hackathon Demo Flow

For this hackathon, we're focusing on demonstrating:

1. Secure location verification using Noir ZK proofs
2. Anonymous review submission with location verification
3. Basic venue discovery and review browsing
4. Proof-of-concept for community curation via voting

## 🚀 Development Roadmap

### Phase 1: Hackathon MVP

- Core location verification circuit in Noir
- Basic React Native UI for proof-of-concept
- Smart contracts for review storage and verification
- Simple IPFS integration for content storage

### Future Development (Post-Hackathon)

- Enhanced human verification using zkEmail.nr
- Reputation system with anonymous credentials
- Expanded venue database integration
- Business verification and response capabilities
- Cross-chain functionality

## 🧪 Testing

To test the application locally:

1. Clone the repository
2. Install dependencies with yarn install
3. Start the React Native development server with yarn start
4. Run on iOS or Android with yarn ios or yarn android

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

Built for ETHGlobal Hackathon using Noir - The universal language for zero-knowledge proofs.
...
