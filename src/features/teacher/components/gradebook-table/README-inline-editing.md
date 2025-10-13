# Inline Editing Feature for Gradebook

## 🎯 Overview

Tính năng inline editing cho phép giáo viên cập nhật điểm số và nhận xét trực tiếp trên bảng gradebook mà không cần mở dialog riêng biệt.

## 🚀 Features

### ✅ Score Editing
- Click vào cell điểm để edit trực tiếp
- Validation điểm số (0 - maxScore)
- Toggle trạng thái vắng mặt
- Keyboard shortcuts (Enter để save, Escape để cancel)
- Visual feedback với loading states

### ✅ Comment Editing
- Click vào cell comment để thêm/sửa nhận xét
- Character counter (500 ký tự tối đa)
- Keyboard shortcuts (Ctrl+Enter để save, Escape để cancel)
- Auto-trim whitespace

### ✅ Error Handling
- Comprehensive validation
- User-friendly error messages
- Automatic rollback on errors
- Loading states và disabled states

## 📁 File Structure

```
src/features/teacher/components/gradebook-table/
├── editable-score-cell.tsx      # Component edit điểm
├── editable-comment-cell.tsx    # Component edit comment
├── columns.tsx                  # Updated columns với inline editing
├── inline-edit-demo.tsx         # Demo component
└── README-inline-editing.md     # Documentation này
```

## 🔧 Usage

### 1. Enable Inline Editing

```tsx
const columns = createColumns({
  studentScores: gradebookData,
  onViewDetails: handleViewDetails,
  onEditDetails: handleEditDetails,
  onUpdateScore: handleUpdateScore,      // Required for score editing
  onUpdateComment: handleUpdateComment,  // Required for comment editing
  isUpdating: isUpdating,               // Loading state
  canEdit: true                         // Enable editing
});
```

### 2. Implement Update Handlers

```tsx
const handleUpdateScore = async (scoreId: string, newScore: number, isAbsent: boolean) => {
  setIsUpdating(true);
  try {
    await updateScoreMutation.mutateAsync({
      scoreId,
      data: {
        score1: newScore,
        isAbsent,
        comment: '' // Keep existing comment
      }
    });
  } catch (error) {
    console.error('Score update error:', error);
    throw error;
  } finally {
    setIsUpdating(false);
  }
};

const handleUpdateComment = async (scoreId: string, comment: string) => {
  setIsUpdating(true);
  try {
    await updateScoreMutation.mutateAsync({
      scoreId,
      data: {
        score1: 0, // Keep existing score
        isAbsent: false, // Keep existing absence status
        comment
      }
    });
  } catch (error) {
    console.error('Comment update error:', error);
    throw error;
  } finally {
    setIsUpdating(false);
  }
};
```

## 🎨 UI/UX Features

### Score Cell
- **Read Mode**: Hiển thị điểm với color coding theo performance
- **Edit Mode**: Input field với validation và absent checkbox
- **Loading State**: Spinner khi đang save
- **Error State**: Reset về giá trị cũ khi có lỗi

### Comment Cell
- **Read Mode**: Hiển thị comment với icon, hoặc placeholder
- **Edit Mode**: Textarea với character counter
- **Loading State**: Spinner khi đang save
- **Error State**: Reset về giá trị cũ khi có lỗi

## ⌨️ Keyboard Shortcuts

| Action | Shortcut | Description |
|--------|----------|-------------|
| Save Score | `Enter` | Save current score and exit edit mode |
| Cancel Score | `Escape` | Cancel editing and revert changes |
| Save Comment | `Ctrl+Enter` | Save comment and exit edit mode |
| Cancel Comment | `Escape` | Cancel editing and revert changes |

## 🔍 Validation Rules

### Score Validation
- Must be a valid number
- Cannot be negative
- Cannot exceed maxScore
- Decimal values allowed (0.1 precision)

### Comment Validation
- Maximum 500 characters
- Whitespace is automatically trimmed
- Empty comments are allowed (removes comment)

## 🚨 Error Handling

### Client-side Validation
- Input format validation
- Range validation
- Length validation
- Real-time feedback

### Server-side Error Handling
- API error catching
- User-friendly error messages
- Automatic rollback on failure
- Retry mechanism

## 🎯 Performance Considerations

- **Debounced Updates**: Prevents excessive API calls
- **Optimistic Updates**: UI updates immediately
- **Error Rollback**: Reverts on failure
- **Loading States**: Prevents multiple simultaneous edits

## 🧪 Testing

Sử dụng `InlineEditDemo` component để test tính năng:

```tsx
import { InlineEditDemo } from './inline-edit-demo';

// Trong component của bạn
<InlineEditDemo />
```

## 🔮 Future Enhancements

- [ ] Bulk edit mode
- [ ] Auto-save functionality
- [ ] Conflict resolution
- [ ] Undo/Redo functionality
- [ ] Keyboard navigation between cells
- [ ] Copy/paste support
- [ ] Export edited data

## 🐛 Troubleshooting

### Common Issues

1. **Score not updating**: Check API endpoint và data format
2. **Comment not saving**: Verify comment length và API response
3. **UI not responsive**: Check loading states và disabled props
4. **Validation errors**: Review input format và range constraints

### Debug Tips

- Check browser console for error logs
- Verify API responses
- Test with different data types
- Check network requests in DevTools
