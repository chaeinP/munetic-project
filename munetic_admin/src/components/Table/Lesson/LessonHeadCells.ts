export interface LessonData {
  id: number;
  user_id: string;
  category: string;
  title: string;
  location: string;
  createdAt: string;
  deletedAt: string;
}

export interface LessonHeadCell {
  disablePadding: boolean;
  id: keyof LessonData;
  label: string;
  numeric: boolean;
}

export const lessonHeadCells: readonly LessonHeadCell[] = [
  {
    id: 'id',
    numeric: false,
    disablePadding: true,
    label: 'No.',
  },
  {
    id: 'user_id',
    numeric: false,
    disablePadding: false,
    label: '아이디',
  },
  {
    id: 'category',
    numeric: false,
    disablePadding: false,
    label: '카테고리',
  },
  {
    id: 'title',
    numeric: false,
    disablePadding: false,
    label: '제목',
  },
  {
    id: 'createdAt',
    numeric: false,
    disablePadding: false,
    label: '생성일',
  },
  {
    id: 'deletedAt',
    numeric: false,
    disablePadding: false,
    label: '삭제일',
  },
];
