import React, { useState } from 'react';
import {IonPage, IonHeader, IonToolbar, IonTitle,IonContent,IonInput,
  IonButton,IonList,IonItem,IonLabel,IonLoading,IonAlert,
} from '@ionic/react';
import axios from 'axios';

const AdminDashboard: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    setResults([]);

    try {
      const response = await axios.post('https://eo16nb655e.execute-api.us-east-1.amazonaws.com/production/searchUsers', { query });
      setResults(response.data.users.filter((user: any) => user.role === 'driver')); // Filter drivers
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch users. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Admin Dashboard</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonItem>
          <IonLabel position="stacked">Search Drivers</IonLabel>
          <IonInput
            value={query}
            placeholder="Enter username or email"
            onIonInput={(e) => setQuery(e.detail.value || '')}
          />
        </IonItem>
        <IonButton expand="block" onClick={handleSearch}>
          Search
        </IonButton>
        <IonLoading isOpen={loading} message="Searching..." />
        <IonAlert
            isOpen={!!error}
            message={error || undefined}
            buttons={['OK']}
            onDidDismiss={() => setError(null)}
        />
        <IonList>
          {(results || []).map((user, index) => (
            <IonItem key={index}>
              <IonLabel>
                <h2>{user.username || 'No username'}</h2>
                <p>{user.email || 'No email'}</p>
              </IonLabel>
            </IonItem>
          ))}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default AdminDashboard;
