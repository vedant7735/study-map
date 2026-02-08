// src/lib/api.ts

const API_BASE = '/api';

// ============================================
// CONVERSATIONS
// ============================================

export async function fetchConversations() {
  const response = await fetch(`${API_BASE}/conversations`);
  if (!response.ok) {
    throw new Error('Failed to fetch conversations');
  }
  return response.json();
}

export async function createConversation(title?: string) {
  const response = await fetch(`${API_BASE}/conversations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title })
  });
  if (!response.ok) {
    throw new Error('Failed to create conversation');
  }
  return response.json();
}

export async function fetchConversation(id: string) {
  const response = await fetch(`${API_BASE}/conversations/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch conversation');
  }
  return response.json();
}

export async function deleteConversation(id: string) {
  const response = await fetch(`${API_BASE}/conversations/${id}`, {
    method: 'DELETE'
  });
  if (!response.ok) {
    throw new Error('Failed to delete conversation');
  }
  return response.json();
}

export async function updateConversation(id: string, data: { title?: string; status?: string }) {
  const response = await fetch(`${API_BASE}/conversations/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!response.ok) {
    throw new Error('Failed to update conversation');
  }
  return response.json();
}

// ============================================
// MESSAGES
// ============================================

export async function fetchMessages(conversationId: string) {
  const response = await fetch(`${API_BASE}/conversations/${conversationId}/messages`);
  if (!response.ok) {
    throw new Error('Failed to fetch messages');
  }
  return response.json();
}

export async function sendMessage(
  conversationId: string,
  content: string,
  role: 'user' | 'assistant'
) {
  const response = await fetch(`${API_BASE}/conversations/${conversationId}/messages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ role, content })
  });
  if (!response.ok) {
    throw new Error('Failed to send message');
  }
  return response.json();
}

// ============================================
// UPLOAD
// ============================================

export async function uploadPDF(conversationId: string, file: File) {
  const formData = new FormData();
  formData.append('pdf', file);
  formData.append('conversationId', conversationId);

  const response = await fetch(`${API_BASE}/upload`, {
    method: 'POST',
    body: formData
  });

  if (!response.ok) {
    throw new Error('Failed to upload PDF');
  }
  return response.json();
}