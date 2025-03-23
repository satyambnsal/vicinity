/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import MainLayout from '../layouts/MainLayout';
import Button from '../components/Button';
import {supabase} from '../lib/supabase';

// Define TypeScript interfaces based on your Supabase schema
interface SignupEmail {
  id: string;
  name: string;
  email: string;
  created_at: string;
}

export default function SupabaseTest() {
  const [loading, setLoading] = useState(false);
  const [emails, setEmails] = useState<SignupEmail[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<
    'untested' | 'success' | 'failed'
  >('untested');

  const testConnection = async () => {
    setLoading(true);
    setError(null);

    try {
      const {data, error: queryError} = await supabase
        .from('signup_emails')
        .select('*')
        .limit(5);

      if (queryError) {
        throw queryError;
      }

      setConnectionStatus('success');
      setEmails(data as SignupEmail[]);
    } catch (err: any) {
      console.error('Supabase connection error:', err);
      setConnectionStatus('failed');
      setError(err.message || 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout canGoBack={true}>
      <Text style={styles.title}>Supabase Connection Test</Text>

      <Text style={styles.description}>
        This screen tests your Supabase connection by attempting to fetch data
        from the signup_emails table.
      </Text>

      {connectionStatus === 'untested' && (
        <Button onPress={testConnection} disabled={loading}>
          <Text style={{color: 'white', fontWeight: '700'}}>
            {loading ? 'Testing Connection...' : 'Test Supabase Connection'}
          </Text>
        </Button>
      )}

      {loading && (
        <ActivityIndicator
          size="large"
          color="#6B7280"
          style={{marginTop: 20}}
        />
      )}

      {connectionStatus === 'success' && (
        <View style={styles.successContainer}>
          <Text style={styles.successText}>
            ✅ Connected to Supabase successfully!
          </Text>

          <Text style={styles.sectionTitle}>Sample Data (signup_emails):</Text>
          <ScrollView style={styles.dataContainer}>
            {emails.length > 0 ? (
              emails.map(email => (
                <View key={email.id} style={styles.dataItem}>
                  <Text style={styles.dataName}>{email.name}</Text>
                  <Text style={styles.dataEmail}>{email.email}</Text>
                  <Text style={styles.dataDate}>
                    Joined: {new Date(email.created_at).toLocaleDateString()}
                  </Text>
                </View>
              ))
            ) : (
              <Text style={styles.noDataText}>No email records found</Text>
            )}
          </ScrollView>

          <Button
            theme="secondary"
            onPress={testConnection}
            disabled={loading}
            style={{marginTop: 20}}>
            <Text style={{color: '#151628', fontWeight: '700'}}>
              {loading ? 'Refreshing...' : 'Refresh Data'}
            </Text>
          </Button>
        </View>
      )}

      {connectionStatus === 'failed' && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>❌ Failed to connect to Supabase</Text>
          <Text style={styles.errorDetail}>{error}</Text>

          <Text style={styles.errorHint}>
            Check your environment variables and make sure your Supabase URL and
            anon key are correct.
          </Text>

          <Button
            onPress={testConnection}
            disabled={loading}
            style={{marginTop: 20}}>
            <Text style={{color: 'white', fontWeight: '700'}}>Try Again</Text>
          </Button>
        </View>
      )}
    </MainLayout>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#151628',
    textAlign: 'center',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 20,
  },
  successContainer: {
    marginTop: 20,
    paddingVertical: 10,
  },
  successText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#10B981',
    textAlign: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#151628',
    marginBottom: 10,
  },
  dataContainer: {
    maxHeight: 300,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 10,
  },
  dataItem: {
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#F9FAFB',
    borderRadius: 6,
  },
  dataName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#151628',
  },
  dataEmail: {
    fontSize: 14,
    color: '#4B5563',
  },
  dataDate: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 5,
  },
  noDataText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    fontStyle: 'italic',
    padding: 20,
  },
  errorContainer: {
    marginTop: 20,
    paddingVertical: 10,
  },
  errorText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#EF4444',
    textAlign: 'center',
    marginBottom: 10,
  },
  errorDetail: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#FEF2F2',
    borderRadius: 8,
  },
  errorHint: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 10,
  },
});
