/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import MainLayout from '../layouts/MainLayout';
import {supabase} from '../lib/supabase';
import {useNavigation} from '@react-navigation/native';
import {PlacesListNavigationProp} from '../types/navigation';
import SearchBar from '../components/SearchBar';
import {useDebounce} from '../lib/hooks';

const {width} = Dimensions.get('window');
const cardWidth = width - 40;

interface Place {
  id: string;
  name: string;
  description: string;
  address: string;
  latitude: number;
  longitude: number;
  category: string;
  image_url: string;
  created_at: string;
  place_id: string;
}

export default function PlacesList() {
  const [places, setPlaces] = useState<Place[]>([]);
  const [filteredPlaces, setFilteredPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const navigation = useNavigation<PlacesListNavigationProp>();

  useEffect(() => {
    fetchPlaces();
  }, []);

  // Effect for filtering places when search query changes
  useEffect(() => {
    if (!places.length) {
      return;
    }

    if (!debouncedSearchQuery.trim()) {
      setFilteredPlaces(places);
      return;
    }

    const lowercasedQuery = debouncedSearchQuery.toLowerCase();
    const filtered = places.filter(
      place =>
        place.name.toLowerCase().includes(lowercasedQuery) ||
        place.description.toLowerCase().includes(lowercasedQuery) ||
        place.address.toLowerCase().includes(lowercasedQuery) ||
        place.category.toLowerCase().includes(lowercasedQuery),
    );

    setFilteredPlaces(filtered);
  }, [debouncedSearchQuery, places]);

  const fetchPlaces = async () => {
    setLoading(true);
    setError(null);

    try {
      const {data, error: supabaseError} = await supabase
        .from('places')
        .select('*')
        .order('name', {ascending: true});

      if (supabaseError) {
        throw supabaseError;
      }

      setPlaces(data || []);
      setFilteredPlaces(data || []);
    } catch (err: any) {
      console.error('Error fetching places:', err);
      setError(`Failed to load places: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const navigateToPlaceDetail = (place: Place) => {
    navigation.navigate('PlaceDetail', {place_id: place.place_id});
  };

  const handleSearchClear = () => {
    setSearchQuery('');
  };

  const renderPlaceCard = ({item}: {item: Place}) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigateToPlaceDetail(item)}>
      <Image
        source={{
          uri: `https://oqymtqolwjujkayjyxdt.supabase.co/storage/v1/object/public/places//${item.place_id}.jpg`,
        }}
        style={styles.cardImage}
        resizeMode="cover"
      />
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{item.name}</Text>
        <Text style={styles.cardCategory}>{item.category}</Text>
        <Text style={styles.cardDescription} numberOfLines={2}>
          {item.description}
        </Text>
        <Text style={styles.cardAddress} numberOfLines={1}>
          {item.address}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderEmptySearch = () => (
    <View style={styles.emptySearchContainer}>
      <Text style={styles.emptySearchText}>
        No places found matching your search
      </Text>
      <TouchableOpacity onPress={handleSearchClear}>
        <Text style={styles.emptySearchReset}>Reset search</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <MainLayout canGoBack={true} disableScroll={true}>
      <View style={{flex: 1}}>
        <View style={styles.header}>
          <Text style={styles.title}>Famous Places</Text>
          <TouchableOpacity onPress={fetchPlaces}>
            <Text style={styles.refreshText}>Refresh</Text>
          </TouchableOpacity>
        </View>

        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search places by name, category..."
          onClear={handleSearchClear}
        />

        {loading ? (
          <ActivityIndicator
            size="large"
            color="#3B82F6"
            style={styles.loader}
          />
        ) : error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={fetchPlaces}>
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={filteredPlaces}
            renderItem={renderPlaceCard}
            keyExtractor={item => item.id}
            contentContainerStyle={[
              styles.list,
              filteredPlaces.length === 0 && styles.centerEmptySet,
            ]}
            showsVerticalScrollIndicator={false}
            style={{flex: 1}}
            ListEmptyComponent={renderEmptySearch}
          />
        )}
      </View>
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
    paddingVertical: 8,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  list: {
    paddingBottom: 20,
  },
  centerEmptySet: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  emptySearchContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 30,
  },
  emptySearchText: {
    fontSize: 16,
    color: '#64748B',
    marginBottom: 12,
  },
  emptySearchReset: {
    fontSize: 14,
    color: '#3B82F6',
    fontWeight: '600',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    width: cardWidth,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 3,
  },
  cardImage: {
    width: '100%',
    height: 160,
  },
  cardContent: {
    padding: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
    color: '#1E293B',
  },
  cardCategory: {
    fontSize: 14,
    color: '#3B82F6',
    marginBottom: 8,
    fontWeight: '500',
  },
  cardDescription: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 8,
    lineHeight: 20,
  },
  cardAddress: {
    fontSize: 12,
    color: '#94A3B8',
  },
});
