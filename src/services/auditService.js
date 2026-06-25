import { collection, addDoc, query, orderBy, getDocs, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebase';

const auditCollection = collection(db, 'auditLogs');

export const logAuditEvent = async ({ actorId, actorEmail, actionType, entityType, entityId, entityName, details }) => {
  const auditEvent = {
    actorId: actorId || null,
    actorEmail: actorEmail || null,
    actionType,
    entityType,
    entityId: entityId || null,
    entityName: entityName || null,
    details: details || null,
    createdAt: serverTimestamp(),
  };

  await addDoc(auditCollection, auditEvent);
};

export const getAuditLogs = async () => {
  const logsQuery = query(auditCollection, orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(logsQuery);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};
