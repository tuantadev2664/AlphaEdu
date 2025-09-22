'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Message } from '@/features/teacher/types';
import {
  MessageSquare,
  Search,
  Filter,
  Send,
  MoreHorizontal,
  Reply,
  Archive,
  Trash2
} from 'lucide-react';
import { format } from 'date-fns';
import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

interface InboxViewProps {
  messages: Message[];
}

export function InboxView({ messages }: InboxViewProps) {
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const unreadMessages = messages.filter((m) => !m.is_read);
  const filteredMessages = messages.filter(
    (m) =>
      m.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.sender?.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className='grid gap-6 md:grid-cols-3'>
      {/* Message List */}
      <div className='space-y-4 md:col-span-1'>
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <MessageSquare className='h-5 w-5' />
              Messages
              {unreadMessages.length > 0 && (
                <Badge variant='destructive' className='ml-auto'>
                  {unreadMessages.length}
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Search */}
            <div className='relative mb-4'>
              <Search className='text-muted-foreground absolute top-3 left-3 h-4 w-4' />
              <Input
                placeholder='Search messages...'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className='pl-10'
              />
            </div>

            {/* Filter Buttons */}
            <div className='mb-4 flex gap-2'>
              <Button
                variant='outline'
                size='sm'
                className='flex items-center gap-1'
              >
                <Filter className='h-3 w-3' />
                All
              </Button>
              <Button variant='outline' size='sm'>
                Unread ({unreadMessages.length})
              </Button>
            </div>

            {/* Message List */}
            <div className='max-h-96 space-y-2 overflow-y-auto'>
              {filteredMessages.map((message) => (
                <MessageListItem
                  key={message.id}
                  message={message}
                  isSelected={selectedMessage?.id === message.id}
                  onClick={() => setSelectedMessage(message)}
                />
              ))}

              {filteredMessages.length === 0 && (
                <div className='text-muted-foreground py-8 text-center'>
                  {searchTerm
                    ? 'No messages match your search'
                    : 'No messages found'}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Message Detail */}
      <div className='md:col-span-2'>
        {selectedMessage ? (
          <MessageDetail message={selectedMessage} />
        ) : (
          <Card>
            <CardContent className='pt-6'>
              <div className='text-muted-foreground py-12 text-center'>
                <MessageSquare className='mx-auto mb-4 h-12 w-12 opacity-50' />
                <h3 className='mb-2 font-medium'>Select a message</h3>
                <p className='text-sm'>
                  Choose a message from the list to view its content
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

interface MessageListItemProps {
  message: Message;
  isSelected: boolean;
  onClick: () => void;
}

function MessageListItem({
  message,
  isSelected,
  onClick
}: MessageListItemProps) {
  const senderName = message.sender?.full_name || 'Unknown Sender';
  const initials = senderName
    .split(' ')
    .map((name) => name[0])
    .join('')
    .toUpperCase();

  return (
    <div
      className={`hover:bg-muted/50 cursor-pointer rounded-lg border p-3 transition-colors ${
        isSelected ? 'bg-muted border-primary' : ''
      } ${!message.is_read ? 'border-l-primary border-l-4' : ''}`}
      onClick={onClick}
    >
      <div className='flex items-start gap-3'>
        <Avatar className='h-8 w-8'>
          <AvatarFallback className='text-xs'>{initials}</AvatarFallback>
        </Avatar>

        <div className='min-w-0 flex-1'>
          <div className='mb-1 flex items-center justify-between'>
            <h5
              className={`truncate text-sm ${!message.is_read ? 'font-semibold' : 'font-medium'}`}
            >
              {senderName}
            </h5>
            <span className='text-muted-foreground text-xs'>
              {format(new Date(message.created_at), 'MMM dd')}
            </span>
          </div>

          <p className='text-muted-foreground line-clamp-2 text-xs'>
            {message.content}
          </p>

          {!message.is_read && (
            <Badge variant='destructive' className='mt-1 text-xs'>
              New
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
}

interface MessageDetailProps {
  message: Message;
}

function MessageDetail({ message }: MessageDetailProps) {
  const senderName = message.sender?.full_name || 'Unknown Sender';
  const initials = senderName
    .split(' ')
    .map((name) => name[0])
    .join('')
    .toUpperCase();

  return (
    <Card>
      <CardHeader>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <Avatar className='h-10 w-10'>
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className='font-semibold'>{senderName}</h3>
              <p className='text-muted-foreground text-sm'>
                {format(new Date(message.created_at), 'MMM dd, yyyy at h:mm a')}
              </p>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='ghost' size='sm'>
                <MoreHorizontal className='h-4 w-4' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>
                <Reply className='mr-2 h-4 w-4' />
                Reply
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Archive className='mr-2 h-4 w-4' />
                Archive
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Trash2 className='mr-2 h-4 w-4' />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent>
        <div className='space-y-4'>
          <div className='prose prose-sm max-w-none'>
            <p className='whitespace-pre-wrap'>{message.content}</p>
          </div>

          <div className='flex gap-2 border-t pt-4'>
            <Button size='sm'>
              <Reply className='mr-2 h-4 w-4' />
              Reply
            </Button>
            <Button variant='outline' size='sm'>
              <Send className='mr-2 h-4 w-4' />
              Forward
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
