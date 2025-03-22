import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Linking,
} from 'react-native';
import MainLayout from '../layouts/MainLayout';
import Icon from 'react-native-vector-icons/Feather';
import {COLORS, SPACING} from '../lib/theme';

const FeatureItem = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => (
  <View style={styles.featureItem}>
    <View style={styles.featureContent}>
      <Text style={styles.featureTitle}>{title}</Text>
      <Text style={styles.featureDescription}>{description}</Text>
    </View>
  </View>
);

const TechItem = ({title, items}: {title: string; items: string[]}) => (
  <View style={styles.techItem}>
    <Text style={styles.techTitle}>{title}</Text>
    <View style={styles.techList}>
      {items.map((item, index) => (
        <View key={index} style={styles.techBadge}>
          <Text style={styles.techBadgeText}>{item}</Text>
        </View>
      ))}
    </View>
  </View>
);

export default function About() {
  return (
    <MainLayout canGoBack headerTitle="About Vicinity">
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.heroSection}>
          <Image
            source={require('../assets/images/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.title}>Vicinity</Text>
          <Text style={styles.subtitle}>
            Privacy-Preserving Location-Verified Reviews
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Overview</Text>
          <Text style={styles.paragraph}>
            Vicinity solves a fundamental problem in the online review
            ecosystem: establishing trust in anonymous reviews. Using
            zero-knowledge proofs to verify a user's physical presence at a
            location without revealing their identity, Vicinity creates a
            trustworthy review ecosystem where:
          </Text>

          <View style={styles.bulletPoints}>
            <Text style={styles.bulletPoint}>
              • Users can share honest feedback without compromising their
              privacy
            </Text>
            <Text style={styles.bulletPoint}>
              • Businesses can be confident that reviews come from actual
              visitors
            </Text>
            <Text style={styles.bulletPoint}>
              • Readers benefit from authentic location-based insights while
              reviewers remain anonymous
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Key Features</Text>
          <FeatureItem
            title="Proven Location Verification"
            description="The core feature of Vicinity is cryptographic proof that reviewers physically visited a location"
          />
          <FeatureItem
            title="Complete Anonymity"
            description="Share honest opinions without fear of retaliation or identity exposure"
          />
          <FeatureItem
            title="Community Curation"
            description="Upvote/downvote system to surface the most helpful reviews"
          />
          <FeatureItem
            title="Mobile-First Experience"
            description="Available on iOS right now via React Native"
          />
          <FeatureItem
            title="Zero Data Collection"
            description="All verification happens client-side with no user tracking"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Technology Stack</Text>
          <TechItem
            title="Frontend"
            items={['React Native', 'Noir', 'Supabase']}
          />
          <TechItem
            title="Zero-Knowledge Proofs"
            items={['Noir language', 'Custom circuits']}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>How It Works</Text>
          <View style={styles.stepItem}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>1</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Venue Discovery</Text>
              <Text style={styles.stepDescription}>
                Browse nearby venues or search for specific locations
              </Text>
            </View>
          </View>

          <View style={styles.stepItem}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>2</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Secure Location Proof</Text>
              <Text style={styles.stepDescription}>
                When at a venue, the app generates a zero-knowledge proof that
                you're within the venue's coordinates
              </Text>
            </View>
          </View>

          <View style={styles.stepItem}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>3</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Anonymous Review</Text>
              <Text style={styles.stepDescription}>
                Submit your review along with your location proof
              </Text>
            </View>
          </View>

          <View style={styles.stepItem}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>4</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Community Engagement</Text>
              <Text style={styles.stepDescription}>
                Other users can view, upvote, or downvote reviews based on
                helpfulness
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.footerSection}>
          <Text style={styles.footerText}>
            Built for ETHGlobal Hackathon using Noir - The universal language
            for zero-knowledge proofs.
          </Text>

          <TouchableOpacity
            style={styles.githubButton}
            onPress={() =>
              Linking.openURL('https://github.com/satyambnsal/vicinity')
            }>
            <Icon
              name="github"
              size={20}
              color={COLORS.paper}
              style={styles.githubIcon}
            />
            <Text style={styles.githubText}>View Project on GitHub</Text>
          </TouchableOpacity>

          <Text style={styles.licenseText}>
            This project is licensed under the MIT License
          </Text>
        </View>
      </ScrollView>
    </MainLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 20,
    marginBottom: SPACING.sm,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.textDark,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textLight,
    textAlign: 'center',
  },
  section: {
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.textDark,
    marginBottom: SPACING.md,
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    color: COLORS.textMedium,
    marginBottom: SPACING.md,
  },
  bulletPoints: {
    marginLeft: SPACING.sm,
  },
  bulletPoint: {
    fontSize: 15,
    lineHeight: 24,
    color: COLORS.textMedium,
    marginBottom: SPACING.xs,
  },
  featureItem: {
    flexDirection: 'row',
    marginBottom: SPACING.md,
    backgroundColor: COLORS.paper,
    padding: SPACING.md,
    borderRadius: 12,
    shadowColor: COLORS.shadow,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  featureIcon: {
    marginRight: SPACING.md,
    marginTop: 2,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textDark,
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: COLORS.textMedium,
    lineHeight: 20,
  },
  techItem: {
    marginBottom: SPACING.md,
  },
  techTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textDark,
    marginBottom: SPACING.sm,
  },
  techList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginLeft: SPACING.xs,
  },
  techBadge: {
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: 16,
    marginRight: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  techBadgeText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '500',
  },
  stepItem: {
    flexDirection: 'row',
    marginBottom: SPACING.md,
  },
  stepNumber: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  stepNumberText: {
    color: COLORS.paper,
    fontWeight: '700',
    fontSize: 16,
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textDark,
    marginBottom: 4,
  },
  stepDescription: {
    fontSize: 14,
    color: COLORS.textMedium,
    lineHeight: 20,
  },
  footerSection: {
    alignItems: 'center',
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.ultraLightGray,
    marginBottom: SPACING.xl,
  },
  footerText: {
    fontSize: 14,
    color: COLORS.textLight,
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  githubButton: {
    flexDirection: 'row',
    backgroundColor: '#333',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  githubIcon: {
    marginRight: SPACING.sm,
  },
  githubText: {
    color: COLORS.paper,
    fontWeight: '600',
    fontSize: 14,
  },
  licenseText: {
    fontSize: 12,
    color: COLORS.lightGray,
  },
});
