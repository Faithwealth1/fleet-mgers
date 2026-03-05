import { collection, doc, getDoc, getDocs, getDocsFromServer } from 'firebase/firestore';
import { db } from '../firebase';

export const toDate = (value) => {
  if (!value) return null;
  if (typeof value?.toDate === 'function') return value.toDate();
  if (typeof value?.seconds === 'number') return new Date(value.seconds * 1000);
  if (typeof value === 'string' || typeof value === 'number') {
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }
  return null;
};

export const toMillis = (value) => {
  const date = toDate(value);
  return date ? date.getTime() : 0;
};

const sortByDateDesc = (items, fieldNames) =>
  [...items].sort((a, b) => {
    const aTime = fieldNames.map((field) => toMillis(a?.[field])).find((x) => x > 0) || 0;
    const bTime = fieldNames.map((field) => toMillis(b?.[field])).find((x) => x > 0) || 0;
    return bTime - aTime;
  });

const isDeletedRecord = (entry = {}) => {
  const status = String(entry.status || entry.accountStatus || '').toLowerCase();
  return Boolean(
    entry.deleted === true ||
      entry.isDeleted === true ||
      entry.deletedAt ||
      entry.deleted_at ||
      status === 'deleted'
  );
};

export const fetchCollectionDocs = async (collectionName) => {
  try {
    const snapshot = await getDocsFromServer(collection(db, collectionName));
    return snapshot.docs.map((entry) => ({ id: entry.id, ...entry.data() }));
  } catch (error) {
    // Fallback to default behavior if server fetch is unavailable.
    const snapshot = await getDocs(collection(db, collectionName));
    return snapshot.docs.map((entry) => ({ id: entry.id, ...entry.data() }));
  }
};

export const fetchUsers = async () => {
  const users = await fetchCollectionDocs('users');
  const activeUsers = users.filter((entry) => !isDeletedRecord(entry));
  return sortByDateDesc(activeUsers, ['created_at', 'createdAt']);
};

export const fetchSiteUsers = async () => {
  const candidates = ['siteUsers', 'chatUsers', 'appUsers'];
  const results = await Promise.all(candidates.map((name) => fetchCollectionDocs(name)));
  const flattened = results.flat().filter((entry) => !isDeletedRecord(entry));

  const uniqueUsers = [];
  const seen = new Set();

  flattened.forEach((entry) => {
    const key = entry.id || entry.uid || entry.user_id || entry.email || `${entry.username || ''}-${entry.phone || ''}`;
    if (!key || seen.has(String(key))) return;
    seen.add(String(key));
    uniqueUsers.push(entry);
  });

  return sortByDateDesc(uniqueUsers, ['created_at', 'createdAt']);
};

export const fetchPayments = async () => {
  const payments = await fetchCollectionDocs('payments');
  return sortByDateDesc(payments, ['payment_date', 'created_at', 'createdAt']);
};

export const fetchDiagnoses = async () => {
  const candidates = ['diagnoses', 'car_diagnoses'];
  for (const name of candidates) {
    const records = await fetchCollectionDocs(name);
    if (records.length > 0) return sortByDateDesc(records, ['created_at', 'createdAt']);
  }
  return [];
};

export const fetchAdminProfile = async (uid) => {
  if (!uid) return null;
  const profile = await getDoc(doc(db, 'admins', uid));
  if (!profile.exists()) return null;
  return { id: profile.id, ...profile.data() };
};
