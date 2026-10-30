import archSpecImg from '../assets/images/book_spec_architecture_1793228435990.jpg';
import typoSpecImg from '../assets/images/book_spec_typography_1793228437270.jpg';
import botanicalSpecImg from '../assets/images/book_spec_botanical_1793228438417.jpg';
import bindingSpecImg from '../assets/images/book_spec_binding_1793228439049.jpg';
import type { BookFolder, GroupFolder, PhotoItem } from '../types/archive';

export const SEED_GROUPS: GroupFolder[] = [
  {
    id: 'seed-group-design',
    name: 'ဒီဇိုင်းနှင့် ဗိသုကာ စုစည်းမှု',
    createdAt: Date.UTC(2026, 9, 28, 9, 0, 0),
    updatedAt: Date.UTC(2026, 9, 28, 9, 15, 0),
  },
];

export const SEED_FOLDERS: BookFolder[] = [
  {
    id: 'seed-folder-arch',
    name: 'ဗိသုကာ ဒီဇိုင်းစံချိန်စံညွှန်းများ',
    createdAt: Date.UTC(2026, 9, 28, 8, 30, 0),
    updatedAt: Date.UTC(2026, 9, 28, 9, 15, 0),
    groupId: 'seed-group-design',
  },
  {
    id: 'seed-folder-typo',
    name: 'ပုံနှိပ်နှင့် စာလုံးအထားအသို လက်စွဲ',
    createdAt: Date.UTC(2026, 9, 24, 14, 10, 0),
    updatedAt: Date.UTC(2026, 9, 25, 10, 0, 0),
    groupId: null,
  },
  {
    id: 'seed-folder-botany',
    name: 'ရုက္ခဗေဒ မှတ်တမ်းစာအုပ် (အတွဲ ၁)',
    createdAt: Date.UTC(2026, 9, 12, 11, 0, 0),
    updatedAt: Date.UTC(2026, 9, 12, 11, 0, 0),
    groupId: null,
  },
];

export const SEED_PHOTOS: PhotoItem[] = [
  {
    id: 'seed-photo-arch-1',
    folderId: 'seed-folder-arch',
    name: 'plate-34-spatial-grid.jpg',
    mimeType: 'image/jpeg',
    createdAt: Date.UTC(2026, 9, 28, 8, 32, 0),
    size: 1624320,
    previewUrl: archSpecImg,
  },
  {
    id: 'seed-photo-arch-2',
    folderId: 'seed-folder-arch',
    name: 'colophon-material-specs.jpg',
    mimeType: 'image/jpeg',
    createdAt: Date.UTC(2026, 9, 28, 8, 45, 0),
    size: 1187840,
    previewUrl: bindingSpecImg,
  },
  {
    id: 'seed-photo-typo-1',
    folderId: 'seed-folder-typo',
    name: 'swiss-grid-margins.jpg',
    mimeType: 'image/jpeg',
    createdAt: Date.UTC(2026, 9, 24, 14, 15, 0),
    size: 1454080,
    previewUrl: typoSpecImg,
  },
  {
    id: 'seed-photo-botany-1',
    folderId: 'seed-folder-botany',
    name: 'flora-plate-xiv.jpg',
    mimeType: 'image/jpeg',
    createdAt: Date.UTC(2026, 9, 12, 11, 5, 0),
    previewUrl: botanicalSpecImg,
  },
];
