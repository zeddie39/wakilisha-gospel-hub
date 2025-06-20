
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { MessageSquare, Send, Reply, User, Calendar } from 'lucide-react';

interface Message {
  id: string;
  subject: string;
  content: string;
  sender_id: string;
  recipient_id: string;
  is_read: boolean;
  created_at: string;
}

interface MessageReply {
  id: string;
  message_id: string;
  sender_id: string;
  content: string;
  created_at: string;
}

const MemberMessages = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [replies, setReplies] = useState<MessageReply[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [newMessage, setNewMessage] = useState({ subject: '', content: '' });
  const [replyContent, setReplyContent] = useState('');
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchMessages();
      setupRealtimeSubscription();
    }
  }, [user]);

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .or(`sender_id.eq.${user?.id},recipient_id.eq.${user?.id}`)
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
      .channel('member-messages')
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

  const sendMessage = async () => {
    if (!newMessage.subject || !newMessage.content) {
      toast({
        title: "Missing Information",
        description: "Please provide both subject and message content",
        variant: "destructive"
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          sender_id: user?.id,
          recipient_id: null, // Send to admin (will be handled by admin dashboard)
          subject: newMessage.subject,
          content: newMessage.content
        });

      if (error) throw error;

      toast({
        title: "Message Sent",
        description: "Your message has been sent to the admin team"
      });

      setNewMessage({ subject: '', content: '' });
      fetchMessages();
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive"
      });
    }
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
    if (!message.is_read && message.recipient_id === user?.id) {
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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Messages List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <MessageSquare className="mr-2 h-5 w-5" />
            Messages
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Send New Message */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-3">Send Message to Admin</h3>
            <div className="space-y-3">
              <Input
                placeholder="Subject"
                value={newMessage.subject}
                onChange={(e) => setNewMessage({...newMessage, subject: e.target.value})}
              />
              <Textarea
                placeholder="Your message..."
                value={newMessage.content}
                onChange={(e) => setNewMessage({...newMessage, content: e.target.value})}
                rows={3}
              />
              <Button onClick={sendMessage} className="w-full">
                <Send className="mr-2 h-4 w-4" />
                Send Message
              </Button>
            </div>
          </div>

          {/* Messages List */}
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
                        {!message.is_read && message.recipient_id === user?.id && (
                          <Badge variant="secondary" className="text-xs">New</Badge>
                        )}
                      </div>
                      <p className="text-gray-600 text-xs truncate">{message.content}</p>
                      <p className="text-gray-400 text-xs mt-1">{formatDate(message.created_at)}</p>
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
          <CardTitle>
            {selectedMessage ? selectedMessage.subject : 'Select a message'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {selectedMessage ? (
            <div className="space-y-4">
              {/* Original Message */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center mb-2">
                  <User className="h-4 w-4 mr-2" />
                  <span className="text-sm font-medium">
                    {selectedMessage.sender_id === user?.id ? 'You' : 'Admin'}
                  </span>
                  <span className="text-xs text-gray-500 ml-auto">
                    {formatDate(selectedMessage.created_at)}
                  </span>
                </div>
                <p className="text-gray-700">{selectedMessage.content}</p>
              </div>

              {/* Replies */}
              <div className="space-y-3">
                {replies.map((reply) => (
                  <div key={reply.id} className="p-3 border-l-4 border-gospel-gold bg-white">
                    <div className="flex items-center mb-2">
                      <Reply className="h-4 w-4 mr-2" />
                      <span className="text-sm font-medium">
                        {reply.sender_id === user?.id ? 'You' : 'Admin'}
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
                  placeholder="Type your reply..."
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  rows={3}
                  className="mb-3"
                />
                <Button onClick={sendReply} disabled={!replyContent.trim()}>
                  <Send className="mr-2 h-4 w-4" />
                  Send Reply
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

export default MemberMessages;
