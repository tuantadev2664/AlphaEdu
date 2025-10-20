'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { StudentScore } from '@/features/score/type';
import {
  MoreHorizontal,
  Edit3,
  FileText,
  Mail,
  Calculator
} from 'lucide-react';
import { toast } from 'sonner';

interface CellActionProps {
  data: StudentScore;
  onViewDetails?: (student: StudentScore) => void;
  onEditDetails?: (student: StudentScore) => void;
}

export const CellAction: React.FC<CellActionProps> = ({
  data,
  onViewDetails,
  onEditDetails
}) => {
  const [contactOpen, setContactOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleCalculateGrade = async () => {
    setLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setLoading(false);
    toast.success('Đã Tính Lại Điểm', {
      description: `Điểm trung bình đã được tính lại cho ${data.fullName}`,
      duration: 3000
    });
  };

  const handleContactParent = () => {
    setContactOpen(true);
  };

  const handleSendMessage = () => {
    if (!message.trim()) {
      toast.error('Vui lòng nhập tin nhắn');
      return;
    }

    setContactOpen(false);
    setMessage('');
    toast.success('Đã Gửi Tin Nhắn', {
      description: `Tin nhắn đã gửi đến phụ huynh của ${data.fullName}`,
      duration: 3000
    });
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant='ghost' className='h-8 w-8 p-0'>
            <span className='sr-only'>Mở menu</span>
            <MoreHorizontal className='h-4 w-4' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end'>
          <DropdownMenuLabel>Hành Động</DropdownMenuLabel>
          <DropdownMenuSeparator />

          <DropdownMenuItem onClick={() => onViewDetails?.(data)}>
            <FileText className='mr-2 h-4 w-4' />
            Xem Chi Tiết Điểm Số
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => onEditDetails?.(data)}>
            <Edit3 className='mr-2 h-4 w-4' />
            Chỉnh Sửa Chi Tiết Điểm Số
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem onClick={handleCalculateGrade} disabled={loading}>
            <Calculator className='mr-2 h-4 w-4' />
            {loading ? 'Đang Tính Toán...' : 'Tính Lại Điểm Trung Bình'}
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem onClick={handleContactParent}>
            <Mail className='mr-2 h-4 w-4' />
            Liên Hệ Phụ Huynh
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Contact Parent Dialog */}
      <Dialog open={contactOpen} onOpenChange={setContactOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className='flex items-center gap-2'>
              <Mail className='h-5 w-5' />
              Liên Hệ Phụ Huynh
            </DialogTitle>
            <DialogDescription>
              Gửi tin nhắn đến phụ huynh của {data.fullName} về điểm số của họ.
            </DialogDescription>
          </DialogHeader>
          <div className='py-4'>
            <Textarea
              placeholder='Nhập nội dung tin nhắn...'
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
            />
          </div>
          <DialogFooter>
            <Button variant='outline' onClick={() => setContactOpen(false)}>
              Hủy Bỏ
            </Button>
            <Button onClick={handleSendMessage}>Gửi Tin Nhắn</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
