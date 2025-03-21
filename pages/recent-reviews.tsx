/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import MainLayout from '../layouts/MainLayout';
import {supabase} from '../lib/supabase';
import Button from '../components/Button';
import Geolocation from '@react-native-community/geolocation';
import {getTimeAgo} from './place-detail';

const {width} = Dimensions.get('window');
const cardWidth = width - 40;

interface Review {
  id: string;
  place_id: string;
  rating: number;
  review_text: string;
  location_proof: string;
  created_at: string;
  user_id: string;
  upvotes: number;
  downvotes: number;
}

export default function RecentReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedReviews, setExpandedReviews] = useState<Set<string>>(
    new Set(),
  );

  useEffect(() => {
    fetchReviews();
    Geolocation.requestAuthorization(
      () => {
        console.log('Geolocation authorization successful');
        Geolocation.getCurrentPosition(info => console.log(info));
      },
      error => {
        console.log(
          'Geolocation authorization failed with error',
          error.message,
          error.code,
          error.PERMISSION_DENIED,
        );
      },
    );
  }, []);

  const fetchReviews = async () => {
    setLoading(true);
    setError(null);

    try {
      const {data, error: supabaseError} = await supabase
        .from('reviews')
        .select('*')
        .order('created_at', {ascending: false})
        .limit(20);

      if (supabaseError) {
        throw supabaseError;
      }

      setReviews(data || []);
    } catch (err: any) {
      console.error('Error fetching reviews:', err);
      setError(`Failed to load reviews: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const toggleExpandReview = (reviewId: string) => {
    setExpandedReviews(prevExpanded => {
      const newExpanded = new Set(prevExpanded);
      if (newExpanded.has(reviewId)) {
        newExpanded.delete(reviewId);
      } else {
        newExpanded.add(reviewId);
      }
      return newExpanded;
    });
  };

  const handleVote = async (reviewId: string, isUpvote: boolean) => {
    const reviewToUpdate = reviews.find(r => r.id === reviewId);
    if (!reviewToUpdate) return;

    try {
      const {data, error: supabaseError} = await supabase
        .from('reviews')
        .update({
          upvotes: isUpvote
            ? reviewToUpdate.upvotes + 1
            : reviewToUpdate.upvotes,
          downvotes: !isUpvote
            ? reviewToUpdate.downvotes + 1
            : reviewToUpdate.downvotes,
        })
        .eq('id', reviewId)
        .select();

      if (supabaseError) {
        throw supabaseError;
      }

      // Update local state
      setReviews(prevReviews =>
        prevReviews.map(review => (review.id === reviewId ? data[0] : review)),
      );
    } catch (err: any) {
      console.error('Error updating votes:', err);
    }
  };

  // Render star rating
  const renderRating = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Text
          key={i}
          style={{color: i <= rating ? '#FFC107' : '#E0E0E0', fontSize: 18}}>
          ★
        </Text>,
      );
    }
    return <View style={{flexDirection: 'row'}}>{stars}</View>;
  };

  return (
    <MainLayout canGoBack={true}>
      <View style={styles.header}>
        <Text style={styles.title}>Recent Reviews</Text>
        <TouchableOpacity onPress={fetchReviews}>
          <Text style={styles.refreshText}>Refresh</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#3B82F6" style={styles.loader} />
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <Button onPress={fetchReviews} style={styles.retryButton}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </Button>
        </View>
      ) : reviews.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No reviews found</Text>
          <Text style={styles.emptySubText}>
            Be the first to write a review!
          </Text>
          <Button onPress={() => {}} style={styles.writeReviewButton}>
            <Text style={styles.buttonText}>Write a Review</Text>
          </Button>
        </View>
      ) : (
        <View style={styles.reviewsContainer}>
          {reviews.map(review => (
            <View key={review.id} style={styles.reviewCard}>
              <View style={styles.reviewHeader}>
                <View>
                  <Text style={styles.venueName}>
                    Venue #{review.place_id.substring(0, 8)}
                  </Text>
                  <Text style={styles.timeAgo}>
                    {getTimeAgo(review.created_at)}
                  </Text>
                </View>
                {renderRating(review.rating)}
              </View>

              <Text
                style={styles.reviewText}
                numberOfLines={expandedReviews.has(review.id) ? undefined : 3}>
                {review.review_text}
              </Text>

              {review.review_text.length > 150 && (
                <TouchableOpacity onPress={() => toggleExpandReview(review.id)}>
                  <Text style={styles.readMoreText}>
                    {expandedReviews.has(review.id) ? 'Show less' : 'Read more'}
                  </Text>
                </TouchableOpacity>
              )}

              <View style={styles.proofContainer}>
                <View style={styles.proofBadge}>
                  {/* <Image
                    source={require('../assets/images/icons/check-circle.png')}
                    style={styles.verifiedIcon}
                  /> */}
                  <Text style={styles.proofText}>Location Verified</Text>
                </View>
                <TouchableOpacity style={styles.proofButton}>
                  <Text style={styles.proofButtonText}>View Proof</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.reviewFooter}>
                <Text style={styles.userIdText}>
                  User {review.user_id.substring(0, 10)}
                </Text>
                <View style={styles.votesContainer}>
                  <TouchableOpacity
                    style={styles.voteButton}
                    onPress={() => handleVote(review.id, true)}>
                    <Text style={styles.voteIcon}>👍</Text>
                    <Text style={styles.voteCount}>{review.upvotes}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.voteButton}
                    onPress={() => handleVote(review.id, false)}>
                    <Text style={styles.voteIcon}>👎</Text>
                    <Text style={styles.voteCount}>{review.downvotes}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </View>
      )}
    </MainLayout>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1E293B',
  },
  refreshText: {
    color: '#3B82F6',
    fontWeight: '600',
  },
  loader: {
    marginTop: 50,
  },
  errorContainer: {
    alignItems: 'center',
    marginTop: 50,
    padding: 20,
    backgroundColor: '#FEF2F2',
    borderRadius: 12,
  },
  errorText: {
    color: '#EF4444',
    marginBottom: 16,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#EF4444',
    paddingHorizontal: 24,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 60,
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 8,
  },
  emptySubText: {
    color: '#64748B',
    marginBottom: 24,
  },
  writeReviewButton: {
    paddingHorizontal: 32,
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
  },
  reviewsContainer: {
    marginBottom: 16,
  },
  reviewCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 3,
    width: cardWidth,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  venueName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 4,
  },
  timeAgo: {
    fontSize: 12,
    color: '#64748B',
  },
  reviewText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#334155',
    marginBottom: 12,
  },
  readMoreText: {
    color: '#3B82F6',
    fontWeight: '600',
    marginBottom: 12,
  },
  proofContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  proofBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 16,
  },
  verifiedIcon: {
    width: 16,
    height: 16,
    marginRight: 4,
  },
  proofText: {
    fontSize: 12,
    color: '#059669',
    fontWeight: '600',
  },
  proofButton: {
    padding: 6,
  },
  proofButtonText: {
    fontSize: 12,
    color: '#3B82F6',
    fontWeight: '600',
  },
  reviewFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  userIdText: {
    fontSize: 12,
    color: '#64748B',
  },
  votesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  voteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
  },
  voteIcon: {
    fontSize: 16,
    marginRight: 4,
  },
  voteCount: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '600',
  },
});
