'use client';

import { useState, useRef, useEffect } from 'react';
import { Box, TextField, Button, Paper, Typography, Container, CircularProgress } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import http from '@fred/lib/http';
import ReactMarkdown from 'react-markdown';
const openAIApiKey = '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';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const initContext = async () => {


    const chatContext = await http('GET', '/auth/chat-context');
    const chatContextData = chatContext.data;

    console.log(chatContextData);

    const systemMessage = { 
      role: 'system', 
      content: chatContextData 
    };
    
    try {
      setMessages([{ role: 'assistant', content: 'Hello! I am your personal financial advisor. I have access to your account information and I\'m here to help you make informed financial decisions. How can I assist you today?' }]);

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openAIApiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [systemMessage, { role: 'assistant', content: 'Hello! How can I help you today?' }],
          stream: true,
        }),
      });

      const reader = response.body?.getReader();
      let assistantMessage = { role: 'assistant' as const, content: '' };
      setMessages([assistantMessage]);
      
      while (reader) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = new TextDecoder().decode(value);
        const lines = chunk.split('\n').filter(line => line.trim() !== '');
        
        for (const line of lines) {
          if (line.includes('[DONE]')) continue;
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              const content = data.choices[0]?.delta?.content || '';
              assistantMessage.content += content;
              setMessages([{ ...assistantMessage }]);
            } catch (err) {
              console.error('Error parsing chunk:', err);
            }
          }
        }
      }
    } catch (error) {
      console.error('Error initializing context:', error);
    }
  };

  useEffect(() => {
    initContext();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;


    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openAIApiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [...messages, userMessage],
          stream: true,
        }),
      });

      const reader = response.body?.getReader();
      let assistantMessage = { role: 'assistant' as const, content: '' };
      setMessages(prev => [...prev, assistantMessage]);
      
      while (reader) {
        const { done, value } = await reader.read();
        if (done) break;

        // Convert the chunk to text
        const chunk = new TextDecoder().decode(value);
        const lines = chunk.split('\n').filter(line => line.trim() !== '');
        
        for (const line of lines) {
          if (line.includes('[DONE]')) continue;
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              const content = data.choices[0]?.delta?.content || '';
              assistantMessage.content += content;
              setMessages(prev => prev.map((msg, i) => 
                i === prev.length - 1 ? { role: 'assistant' as const, content: assistantMessage.content } : msg
              ));
            } catch (err) {
              console.error('Error parsing chunk:', err);
            }
          }
        }
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ height: 'calc(100vh - 64px)', py: 4 }}>
      <Paper elevation={3} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ flexGrow: 1, overflow: 'auto', p: 2 }}>
          {messages.map((message, index) => (
            <Box
              key={index}
              sx={{
                display: 'flex',
                justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start',
                mb: 2
              }}
            >
              <Paper
                elevation={1}
                sx={{
                  p: 2,
                  maxWidth: '70%',
                  bgcolor: message.role === 'user' ? 'primary.light' : 'grey.100'
                }}
              >
                <Typography>
                  <ReactMarkdown>{message.content}</ReactMarkdown>
                </Typography>
              </Paper>
            </Box>
          ))}
          <div ref={messagesEndRef} />
        </Box>
        
        <Box component="form" onSubmit={handleSubmit} sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              fullWidth
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              disabled={isLoading}
              variant="outlined"
              size="small"
            />
            <Button 
              type="submit" 
              variant="contained" 
              disabled={isLoading}
              endIcon={isLoading ? <CircularProgress size={20} /> : <SendIcon />}
            >
              Send
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}
