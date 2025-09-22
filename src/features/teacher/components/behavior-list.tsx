// // Behavior List for a Class
// import { fakeBehaviorNotes } from '@/constants/mock-api-teacher';
// import { Card, CardContent } from '@/components/ui/card';

// export default function BehaviorList({ classId }: { classId: string }) {
//   const notes = fakeBehaviorNotes.filter((n) => n.class_id === classId);
//   return (
//     <div className='space-y-4'>
//       {notes.map((note) => (
//         <Card key={note.id}>
//           <CardContent>
//             <div className='font-semibold'>{note.note}</div>
//             <div className='text-muted-foreground text-xs'>
//               Level: {note.level} | {new Date(note.created_at).toLocaleString()}
//             </div>
//           </CardContent>
//         </Card>
//       ))}
//       {notes.length === 0 && <div>No behavior notes.</div>}
//     </div>
//   );
// }
