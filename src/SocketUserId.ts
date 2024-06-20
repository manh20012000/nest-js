export const addConnection = (clients: Record<string, string[]>, userId: string, socketId: string): Record<string, string[]> => {
  if (clients[userId]) {
    clients[userId].push(socketId);
  } else {
    clients[userId] = [socketId];
  }
  return clients;
};

export const removeSocketIDFromArray = (clients: Record<string, string[]>, userId: string, socketId: string): Record<string, string[]> => {
  clients[userId] = clients[userId]?.filter(id => id !== socketId);

  if (!clients[userId]?.length) {
    delete clients[userId];
  }
  return clients;
};

