'use client';

import { useState, useEffect } from 'react';
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
  Circle,
  ArrowLeft,
  Save,
  FileText
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
  const [isMobile, setIsMobile] = useState(false);
  const [showConversation, setShowConversation] = useState(false);
  const [draftMessages, setDraftMessages] = useState<Record<string, string>>(
    {}
  );
  const [showDrafts, setShowDrafts] = useState(false);

  const data = mockCommunicationData;
  const conversations = mockConversations;

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Load draft messages from localStorage on mount
  useEffect(() => {
    const savedDrafts = localStorage.getItem('teacher-communication-drafts');
    if (savedDrafts) {
      setDraftMessages(JSON.parse(savedDrafts));
    }
  }, []);

  // Save draft messages to localStorage
  useEffect(() => {
    localStorage.setItem(
      'teacher-communication-drafts',
      JSON.stringify(draftMessages)
    );
  }, [draftMessages]);

  // Load draft when conversation changes
  useEffect(() => {
    if (selectedConversation && draftMessages[selectedConversation]) {
      setNewMessage(draftMessages[selectedConversation]);
    } else {
      setNewMessage('');
    }
  }, [selectedConversation, draftMessages]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;

    // In real app, send message via API
    console.log('Sending message:', newMessage);

    // Clear draft for this conversation
    const newDrafts = { ...draftMessages };
    delete newDrafts[selectedConversation];
    setDraftMessages(newDrafts);

    setNewMessage('');
  };

  const handleSaveDraft = () => {
    if (!newMessage.trim() || !selectedConversation) return;

    setDraftMessages((prev) => ({
      ...prev,
      [selectedConversation]: newMessage
    }));
  };

  const handleMessageChange = (value: string) => {
    setNewMessage(value);

    // Auto-save draft after 2 seconds of no typing
    if (selectedConversation) {
      const timeoutId = setTimeout(() => {
        if (value.trim()) {
          setDraftMessages((prev) => ({
            ...prev,
            [selectedConversation]: value
          }));
        }
      }, 2000);

      return () => clearTimeout(timeoutId);
    }
  };

  const handleConversationSelect = (conversationId: string) => {
    setSelectedConversation(conversationId);
    if (isMobile) {
      setShowConversation(true);
    }
  };

  const handleBackToList = () => {
    setShowConversation(false);
    setSelectedConversation(null);
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
      <DialogContent
        className={`fixed top-[50%] left-[50%] z-50 max-h-[90vh] translate-x-[-50%] translate-y-[-50%] overflow-hidden p-0 ${
          isMobile
            ? 'h-full max-h-[100vh] w-full max-w-[100vw] rounded-none'
            : 'max-w-[95vw] sm:max-w-[1400px]'
        }`}
      >
        <div className='p-4 sm:p-6'>
          <DialogHeader>
            <DialogTitle className='flex items-center gap-2'>
              {isMobile && showConversation && (
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={handleBackToList}
                  className='mr-2 p-1'
                >
                  <ArrowLeft className='h-4 w-4' />
                </Button>
              )}
              <MessageSquare className='h-5 w-5' />
              Liên lạc với giáo viên
            </DialogTitle>
            <DialogDescription>
              Trao đổi với giáo viên về tình hình học tập của con
            </DialogDescription>
          </DialogHeader>
        </div>

        <div
          className={`flex gap-4 px-4 pb-4 sm:px-6 sm:pb-6 ${
            isMobile ? 'h-[calc(100vh-120px)]' : 'h-[70vh]'
          }`}
        >
          {/* Left Sidebar - Teacher List */}
          <div
            className={`${
              isMobile
                ? showConversation
                  ? 'hidden'
                  : 'w-full'
                : 'w-1/3 border-r pr-4'
            }`}
          >
            <Tabs defaultValue='teachers' className='w-full'>
              <TabsList className='grid w-full grid-cols-3'>
                <TabsTrigger value='teachers'>Giáo viên</TabsTrigger>
                <TabsTrigger value='conversations'>Tin nhắn</TabsTrigger>
                <TabsTrigger value='drafts'>Bản nháp</TabsTrigger>
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
                <ScrollArea
                  className={`${isMobile ? 'h-[calc(100vh-200px)]' : 'h-[400px]'}`}
                >
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
                          handleConversationSelect(
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
                <ScrollArea
                  className={`${isMobile ? 'h-[calc(100vh-200px)]' : 'h-[400px]'}`}
                >
                  <div className='space-y-2'>
                    {conversations.map((conversation) => (
                      <Card
                        key={conversation.id}
                        className={`hover:bg-muted/50 cursor-pointer transition-colors ${
                          selectedConversation === conversation.id
                            ? 'bg-muted'
                            : ''
                        }`}
                        onClick={() =>
                          handleConversationSelect(conversation.id)
                        }
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

              <TabsContent value='drafts' className='space-y-4'>
                <ScrollArea
                  className={`${isMobile ? 'h-[calc(100vh-200px)]' : 'h-[400px]'}`}
                >
                  <div className='space-y-2'>
                    {Object.keys(draftMessages).length === 0 ? (
                      <div className='text-muted-foreground py-8 text-center'>
                        <FileText className='mx-auto mb-4 h-12 w-12 opacity-50' />
                        <p>Chưa có bản nháp nào</p>
                      </div>
                    ) : (
                      Object.entries(draftMessages).map(
                        ([conversationId, draft]) => {
                          const conversation = conversations.find(
                            (c) => c.id === conversationId
                          );
                          if (!conversation) return null;

                          return (
                            <Card
                              key={conversationId}
                              className='hover:bg-muted/50 cursor-pointer transition-colors'
                              onClick={() =>
                                handleConversationSelect(conversationId)
                              }
                            >
                              <CardContent className='p-4'>
                                <div className='flex items-start gap-3'>
                                  <Avatar className='h-10 w-10'>
                                    <AvatarFallback className='bg-orange-100 text-orange-600'>
                                      <FileText className='h-4 w-4' />
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
                                      <Badge
                                        variant='secondary'
                                        className='text-xs'
                                      >
                                        Bản nháp
                                      </Badge>
                                    </div>
                                    <div className='text-muted-foreground mb-2 text-sm'>
                                      {conversation.subject_context?.name} •{' '}
                                      {conversation.student_context?.full_name}
                                    </div>
                                    <div className='text-muted-foreground line-clamp-2 text-xs'>
                                      {draft}
                                    </div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          );
                        }
                      )
                    )}
                  </div>
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Side - Conversation */}
          <div
            className={`flex flex-1 flex-col ${
              isMobile ? (showConversation ? 'block' : 'hidden') : 'block'
            }`}
          >
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
                    <div className='flex-1'>
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
                    {isMobile && (
                      <Button
                        variant='ghost'
                        size='sm'
                        onClick={handleBackToList}
                        className='p-2'
                      >
                        <ArrowLeft className='h-4 w-4' />
                      </Button>
                    )}
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
                <div className='space-y-2'>
                  <div className='flex gap-2'>
                    <Textarea
                      placeholder='Nhập tin nhắn...'
                      value={newMessage}
                      onChange={(e) => handleMessageChange(e.target.value)}
                      className={`${isMobile ? 'min-h-[60px]' : 'min-h-[80px]'} flex-1 resize-none`}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                    />
                    <div className='flex flex-col gap-1'>
                      <Button
                        onClick={handleSendMessage}
                        disabled={!newMessage.trim()}
                        className='self-end'
                        size={isMobile ? 'sm' : 'default'}
                      >
                        <Send className='h-4 w-4' />
                      </Button>
                      {newMessage.trim() && (
                        <Button
                          onClick={handleSaveDraft}
                          variant='outline'
                          size={isMobile ? 'sm' : 'default'}
                          className='self-end'
                        >
                          <Save className='h-4 w-4' />
                        </Button>
                      )}
                    </div>
                  </div>
                  {selectedConversation &&
                    draftMessages[selectedConversation] && (
                      <div className='text-muted-foreground flex items-center gap-1 text-xs'>
                        <FileText className='h-3 w-3' />
                        <span>Đã lưu bản nháp</span>
                      </div>
                    )}
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
