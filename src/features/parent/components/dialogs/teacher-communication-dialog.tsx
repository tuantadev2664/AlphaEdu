'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import type {
  ParentTeacherCommunication,
  Conversation,
  Message
} from '@/features/parent/types';
import {
  MessageSquare,
  Send,
  Search,
  User,
  Clock,
  BookOpen,
  Users,
  Phone,
  Mail,
  CheckCircle,
  Circle
} from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

interface TeacherCommunicationDialogProps {
  children: React.ReactNode;
}

// Mock data - would come from API
const mockCommunicationData: ParentTeacherCommunication = {
  parent: {
    id: 'parent-1',
    role: 'parent',
    full_name: 'Nguyễn Văn An',
    email: 'an.nguyen@parent.com',
    phone: '+84-123-456-789',
    school_id: 'school-1',
    created_at: '2023-08-01T00:00:00Z'
  },
  child: {
    id: 'student-1',
    role: 'student',
    full_name: 'Nguyễn Minh Khang',
    email: 'khang.nguyen@student.edu',
    phone: '+84-987-654-321',
    school_id: 'school-1',
    created_at: '2023-08-01T00:00:00Z'
  },
  teachers: [
    {
      teacher: {
        id: 'teacher-math',
        role: 'teacher',
        full_name: 'Cô Nguyễn Thị Lan',
        email: 'lan.nguyen@school.edu',
        phone: '+84-123-456-789',
        school_id: 'school-1',
        created_at: '2023-08-01T00:00:00Z'
      },
      subjects: [
        {
          id: 'math',
          code: 'MATH',
          name: 'Toán học',
          level: 'upper_secondary',
          is_active: true
        }
      ],
      class: {
        id: 'class-1',
        grade_id: 'grade-1',
        name: '10A1',
        homeroom_teacher_id: 'teacher-1'
      },
      unread_count: 2,
      last_message: {
        id: 'msg-1',
        sender_id: 'teacher-math',
        receiver_id: 'parent-1',
        content:
          'Con Khang đã có tiến bộ rõ rệt trong môn Toán. Hôm nay em đã làm bài kiểm tra rất tốt.',
        created_at: '2024-10-01T10:30:00Z',
        is_read: false
      }
    },
    {
      teacher: {
        id: 'teacher-lit',
        role: 'teacher',
        full_name: 'Thầy Trần Văn Nam',
        email: 'nam.tran@school.edu',
        phone: '+84-123-456-790',
        school_id: 'school-1',
        created_at: '2023-08-01T00:00:00Z'
      },
      subjects: [
        {
          id: 'literature',
          code: 'LIT',
          name: 'Ngữ văn',
          level: 'upper_secondary',
          is_active: true
        }
      ],
      class: {
        id: 'class-1',
        grade_id: 'grade-1',
        name: '10A1',
        homeroom_teacher_id: 'teacher-1'
      },
      unread_count: 0,
      last_message: {
        id: 'msg-2',
        sender_id: 'parent-1',
        receiver_id: 'teacher-lit',
        content:
          'Cảm ơn thầy đã quan tâm. Con ở nhà cũng đã chăm chỉ luyện tập viết văn hơn.',
        created_at: '2024-09-28T15:45:00Z',
        is_read: true
      }
    }
  ],
  recent_messages: []
};

const mockConversations: Conversation[] = [
  {
    id: 'conv-1',
    participants: [
      mockCommunicationData.parent,
      mockCommunicationData.teachers[0].teacher
    ],
    messages: [
      {
        id: 'msg-1',
        sender_id: 'teacher-math',
        receiver_id: 'parent-1',
        content:
          'Chào phụ huynh, tôi muốn thông báo về kết quả học tập của con Khang trong tuần này.',
        created_at: '2024-10-01T09:00:00Z',
        is_read: true,
        sender: mockCommunicationData.teachers[0].teacher
      },
      {
        id: 'msg-2',
        sender_id: 'parent-1',
        receiver_id: 'teacher-math',
        content:
          'Chào cô, cảm ơn cô đã quan tâm. Con ở nhà có học bài đều đặn ạ.',
        created_at: '2024-10-01T09:15:00Z',
        is_read: true,
        sender: mockCommunicationData.parent
      },
      {
        id: 'msg-3',
        sender_id: 'teacher-math',
        receiver_id: 'parent-1',
        content:
          'Con Khang đã có tiến bộ rõ rệt trong môn Toán. Hôm nay em đã làm bài kiểm tra rất tốt.',
        created_at: '2024-10-01T10:30:00Z',
        is_read: false,
        sender: mockCommunicationData.teachers[0].teacher
      }
    ],
    last_message: {
      id: 'msg-3',
      sender_id: 'teacher-math',
      receiver_id: 'parent-1',
      content:
        'Con Khang đã có tiến bộ rõ rệt trong môn Toán. Hôm nay em đã làm bài kiểm tra rất tốt.',
      created_at: '2024-10-01T10:30:00Z',
      is_read: false
    },
    unread_count: 1,
    subject_context: mockCommunicationData.teachers[0].subjects[0],
    student_context: mockCommunicationData.child
  }
];

export function TeacherCommunicationDialog({
  children
}: TeacherCommunicationDialogProps) {
  const [open, setOpen] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState<
    string | null
  >(null);
  const [newMessage, setNewMessage] = useState('');
  const [selectedChild, setSelectedChild] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const data = mockCommunicationData;
  const conversations = mockConversations;

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;

    // In real app, send message via API
    console.log('Sending message:', newMessage);
    setNewMessage('');
  };

  const filteredTeachers = data.teachers.filter(
    (teacher) =>
      teacher.teacher.full_name
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      teacher.subjects.some((subject) =>
        subject.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
  );

  const selectedConv = conversations.find(
    (conv) => conv.id === selectedConversation
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className='fixed top-[50%] left-[50%] z-50 max-h-[90vh] max-w-[95vw] translate-x-[-50%] translate-y-[-50%] overflow-hidden p-0 sm:max-w-[1400px]'>
        <div className='p-6'>
          <DialogHeader>
            <DialogTitle className='flex items-center gap-2'>
              <MessageSquare className='h-5 w-5' />
              Liên lạc với giáo viên
            </DialogTitle>
            <DialogDescription>
              Trao đổi với giáo viên về tình hình học tập của con
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className='flex h-[70vh] gap-4 px-6 pb-6'>
          {/* Left Sidebar - Teacher List */}
          <div className='w-1/3 border-r pr-4'>
            <Tabs defaultValue='teachers' className='w-full'>
              <TabsList className='grid w-full grid-cols-2'>
                <TabsTrigger value='teachers'>Giáo viên</TabsTrigger>
                <TabsTrigger value='conversations'>Tin nhắn</TabsTrigger>
              </TabsList>

              <TabsContent value='teachers' className='space-y-4'>
                {/* Search */}
                <div className='relative'>
                  <Search className='text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform' />
                  <Input
                    placeholder='Tìm giáo viên hoặc môn học...'
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className='pl-10'
                  />
                </div>

                {/* Child Filter */}
                <Select value={selectedChild} onValueChange={setSelectedChild}>
                  <SelectTrigger>
                    <SelectValue placeholder='Chọn con' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='all'>Tất cả các con</SelectItem>
                    <SelectItem value={data.child.id}>
                      {data.child.full_name}
                    </SelectItem>
                  </SelectContent>
                </Select>

                {/* Teachers List */}
                <ScrollArea className='h-[400px]'>
                  <div className='space-y-2'>
                    {filteredTeachers.map((teacherContact) => (
                      <Card
                        key={teacherContact.teacher.id}
                        className={`hover:bg-muted/50 cursor-pointer transition-colors ${
                          selectedConversation ===
                          `conv-${teacherContact.teacher.id}`
                            ? 'bg-muted'
                            : ''
                        }`}
                        onClick={() =>
                          setSelectedConversation(
                            `conv-${teacherContact.teacher.id}`
                          )
                        }
                      >
                        <CardContent className='p-4'>
                          <div className='flex items-start gap-3'>
                            <Avatar className='h-10 w-10'>
                              <AvatarFallback className='bg-blue-100 text-blue-600'>
                                {teacherContact.teacher.full_name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div className='min-w-0 flex-1'>
                              <div className='mb-1 flex items-center justify-between'>
                                <h4 className='truncate font-medium'>
                                  {teacherContact.teacher.full_name}
                                </h4>
                                {teacherContact.unread_count > 0 && (
                                  <Badge
                                    variant='destructive'
                                    className='text-xs'
                                  >
                                    {teacherContact.unread_count}
                                  </Badge>
                                )}
                              </div>
                              <div className='text-muted-foreground mb-2 text-sm'>
                                {teacherContact.subjects
                                  .map((s) => s.name)
                                  .join(', ')}{' '}
                                • {teacherContact.class.name}
                              </div>
                              {teacherContact.last_message && (
                                <div className='text-muted-foreground line-clamp-2 text-xs'>
                                  {teacherContact.last_message.content}
                                </div>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value='conversations' className='space-y-4'>
                <ScrollArea className='h-[400px]'>
                  <div className='space-y-2'>
                    {conversations.map((conversation) => (
                      <Card
                        key={conversation.id}
                        className={`hover:bg-muted/50 cursor-pointer transition-colors ${
                          selectedConversation === conversation.id
                            ? 'bg-muted'
                            : ''
                        }`}
                        onClick={() => setSelectedConversation(conversation.id)}
                      >
                        <CardContent className='p-4'>
                          <div className='flex items-start gap-3'>
                            <Avatar className='h-10 w-10'>
                              <AvatarFallback className='bg-green-100 text-green-600'>
                                {conversation.participants
                                  .find((p) => p.id !== data.parent.id)
                                  ?.full_name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div className='min-w-0 flex-1'>
                              <div className='mb-1 flex items-center justify-between'>
                                <h4 className='truncate font-medium'>
                                  {
                                    conversation.participants.find(
                                      (p) => p.id !== data.parent.id
                                    )?.full_name
                                  }
                                </h4>
                                {conversation.unread_count > 0 && (
                                  <Badge
                                    variant='destructive'
                                    className='text-xs'
                                  >
                                    {conversation.unread_count}
                                  </Badge>
                                )}
                              </div>
                              <div className='text-muted-foreground mb-2 text-sm'>
                                {conversation.subject_context?.name} •{' '}
                                {conversation.student_context?.full_name}
                              </div>
                              {conversation.last_message && (
                                <div className='text-muted-foreground line-clamp-2 text-xs'>
                                  {conversation.last_message.content}
                                </div>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Side - Conversation */}
          <div className='flex flex-1 flex-col'>
            {selectedConv ? (
              <>
                {/* Conversation Header */}
                <div className='mb-4 border-b pb-4'>
                  <div className='flex items-center gap-3'>
                    <Avatar className='h-12 w-12'>
                      <AvatarFallback className='bg-blue-100 text-blue-600'>
                        {selectedConv.participants
                          .find((p) => p.id !== data.parent.id)
                          ?.full_name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className='font-semibold'>
                        {
                          selectedConv.participants.find(
                            (p) => p.id !== data.parent.id
                          )?.full_name
                        }
                      </h3>
                      <div className='text-muted-foreground text-sm'>
                        {selectedConv.subject_context?.name} •{' '}
                        {selectedConv.student_context?.full_name}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <ScrollArea className='mb-4 flex-1'>
                  <div className='space-y-4 pr-4'>
                    {selectedConv.messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.sender_id === data.parent.id ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[70%] ${
                            message.sender_id === data.parent.id
                              ? 'bg-blue-500 text-white'
                              : 'bg-muted'
                          } rounded-lg p-3`}
                        >
                          <p className='text-sm'>{message.content}</p>
                          <div
                            className={`mt-2 flex items-center gap-1 text-xs ${
                              message.sender_id === data.parent.id
                                ? 'text-blue-100'
                                : 'text-muted-foreground'
                            }`}
                          >
                            <Clock className='h-3 w-3' />
                            <span>
                              {format(
                                new Date(message.created_at),
                                'HH:mm dd/MM',
                                { locale: vi }
                              )}
                            </span>
                            {message.sender_id === data.parent.id &&
                              (message.is_read ? (
                                <CheckCircle className='ml-1 h-3 w-3' />
                              ) : (
                                <Circle className='ml-1 h-3 w-3' />
                              ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>

                {/* Message Input */}
                <div className='flex gap-2'>
                  <Textarea
                    placeholder='Nhập tin nhắn...'
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className='min-h-[80px] flex-1 resize-none'
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                    className='self-end'
                  >
                    <Send className='h-4 w-4' />
                  </Button>
                </div>
              </>
            ) : (
              <div className='text-muted-foreground flex flex-1 items-center justify-center'>
                <div className='text-center'>
                  <MessageSquare className='mx-auto mb-4 h-12 w-12 opacity-50' />
                  <p>Chọn một cuộc trò chuyện để bắt đầu</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
