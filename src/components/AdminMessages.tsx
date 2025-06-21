import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { MessageSquare, Send, Reply, User, Calendar, Trash2 } from 'lucide-react';

interface Message {
  id: string;
  subject: string;
  content: string;
  sender_id?: string;
  recipient_id?: string;
  is_read: boolean;
  created_at: string;
  sender_name?: string;
  sender_email?: string;
  phone?: string;
}

interface MessageReply {
  id: string;
  message_id: string;
  sender_id: string;
  content: string;
  created_at: string;
}

interface Profile {
  id: string;
  full_name: string;
}

const AdminMessages = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [replies, setReplies] = useState<MessageReply[]>([]);
  const [profiles, setProfiles] = useState<{[key: string]: Profile}>({});
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchMessages();
      fetchProfiles();
      setupRealtimeSubscription();
    }
  }, [user]);

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast({
        title: "Error",
        description: "Failed to load messages",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchProfiles = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name');

      if (error) throw error;
      
      const profileMap: {[key: string]: Profile} = {};
      data?.forEach(profile => {
        profileMap[profile.id] = profile;
      });
      setProfiles(profileMap);
    } catch (error) {
      console.error('Error fetching profiles:', error);
    }
  };

  const fetchReplies = async (messageId: string) => {
    try {
      const { data, error } = await supabase
        .from('message_replies')
        .select('*')
        .eq('message_id', messageId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setReplies(data || []);
    } catch (error) {
      console.error('Error fetching replies:', error);
    }
  };

  const setupRealtimeSubscription = () => {
    const channel = supabase
      .channel('admin-messages')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages'
        },
        () => {
          fetchMessages();
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'message_replies'
        },
        () => {
          if (selectedMessage) {
            fetchReplies(selectedMessage.id);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const sendReply = async () => {
    if (!replyContent || !selectedMessage) return;

    try {
      const { error } = await supabase
        .from('message_replies')
        .insert({
          message_id: selectedMessage.id,
          sender_id: user?.id,
          content: replyContent
        });

      if (error) throw error;

      toast({
        title: "Reply Sent",
        description: "Your reply has been sent"
      });

      setReplyContent('');
      fetchReplies(selectedMessage.id);
    } catch (error) {
      console.error('Error sending reply:', error);
      toast({
        title: "Error",
        description: "Failed to send reply",
        variant: "destructive"
      });
    }
  };

  const deleteMessage = async (messageId: string) => {
    if (!confirm('Are you sure you want to delete this message and all its replies?')) return;

    try {
      // Delete replies first
      await supabase
        .from('message_replies')
        .delete()
        .eq('message_id', messageId);

      // Then delete the message
      const { error } = await supabase
        .from('messages')
        .delete()
        .eq('id', messageId);

      if (error) throw error;

      toast({
        title: "Message Deleted",
        description: "Message and all replies have been deleted"
      });

      setSelectedMessage(null);
      fetchMessages();
    } catch (error) {
      console.error('Error deleting message:', error);
      toast({
        title: "Error",
        description: "Failed to delete message",
        variant: "destructive"
      });
    }
  };

  const markAsRead = async (messageId: string) => {
    try {
      await supabase
        .from('messages')
        .update({ is_read: true })
        .eq('id', messageId);
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

  const selectMessage = (message: Message) => {
    setSelectedMessage(message);
    fetchReplies(message.id);
    if (!message.is_read) {
      markAsRead(message.id);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getUserName = (userId: string) => {
    return profiles[userId]?.full_name || 'Unknown User';
  };

  // Main render
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Messages List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <MessageSquare className="mr-2 h-5 w-5" />
            All Messages ({messages.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {loading ? (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gospel-gold"></div>
              </div>
            ) : messages.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No messages yet</p>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedMessage?.id === message.id
                      ? 'bg-gospel-gold/10 border-gospel-gold'
                      : 'hover:bg-gray-50'
                  }`}
                  onClick={() => selectMessage(message)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-medium text-sm">{message.subject}</h4>
                        {!message.is_read && (
                          <Badge variant="secondary" className="text-xs">New</Badge>
                        )}
                      </div>
                      <p className="text-gray-600 text-xs truncate">{message.content}</p>
                      <div className="flex items-center justify-between mt-1">
                        <p className="text-gray-400 text-xs">
                          From: {getUserName(message.sender_id || "")}
                        </p>
                        <p className="text-gray-400 text-xs">{formatDate(message.created_at)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
      {/* Message Detail */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>
              {selectedMessage ? selectedMessage.subject : 'Select a message'}
            </CardTitle>
            {selectedMessage && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => deleteMessage(selectedMessage.id)}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {selectedMessage ? (
            <div className="space-y-4">
              {/* Original Message */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex flex-col sm:flex-row sm:items-center mb-2 gap-2">
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-2" />
                    <span className="text-sm font-medium">
                      {selectedMessage.sender_name || getUserName(selectedMessage.sender_id || "")}
                    </span>
                  </div>
                  {selectedMessage.sender_email && (
                    <span className="text-xs text-blue-700 ml-2">
                      <a href={`mailto:${selectedMessage.sender_email}`} className="underline">{selectedMessage.sender_email}</a>
                    </span>
                  )}
                  {selectedMessage.phone && (
                    <span className="text-xs text-gray-700 ml-2">
                      {selectedMessage.phone}
                    </span>
                  )}
                  <span className="text-xs text-gray-500 ml-auto">
                    {formatDate(selectedMessage.created_at)}
                  </span>
                </div>
                <p className="text-gray-700 whitespace-pre-line">{selectedMessage.content}</p>
              </div>
              {/* Replies */}
              <div className="space-y-3">
                {replies.map((reply) => (
                  <div key={reply.id} className="p-3 border-l-4 border-gospel-gold bg-white">
                    <div className="flex items-center mb-2">
                      <Reply className="h-4 w-4 mr-2" />
                      <span className="text-sm font-medium">
                        {reply.sender_id === user?.id ? 'You (Admin)' : getUserName(reply.sender_id)}
                      </span>
                      <span className="text-xs text-gray-500 ml-auto">
                        {formatDate(reply.created_at)}
                      </span>
                    </div>
                    <p className="text-gray-700">{reply.content}</p>
                  </div>
                ))}
              </div>
              {/* Reply Form */}
              <div className="border-t pt-4">
                <Textarea
                  placeholder="Type your admin response..."
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  rows={3}
                  className="mb-3"
                />
                <Button onClick={sendReply} disabled={!replyContent.trim()}>
                  <Send className="mr-2 h-4 w-4" />
                  Send Admin Reply
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <MessageSquare className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <p>Select a message to view details and reply</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminMessages;
