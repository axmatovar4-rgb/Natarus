# Natarus - Mol-Mulk O'tkazish Platformasi

Natarus — notarius tomonidan boshqariladigan, mol-mulkni bir shaxs nomidan ikkinchi shaxsga rasmiy ravishda o'tkazish jarayonini avtomatlashtiruvchi platforma.

## Loyiha Tuzilmasi

```
natarus/
├── frontend/       # Next.js + TypeScript + Tailwind CSS
└── backend/        # NestJS + PostgreSQL + Prisma
```

## Asosiy Funksiyalar

- Notarius paneli (barcha arizalarni boshqarish)
- Mijoz ro'yxatdan o'tish va profil
- Mol-mulk turlari (ko'chmas mulk, transport, boshqa)
- Ariza yaratish va kuzatish
- Hujjat yuklash (PDF, rasm va h.k.)
- O'tkazish jarayoni bosqichlari
- Tarix va arxiv

## Texnologiyalar

| Qism       | Texnologiya                        |
|------------|------------------------------------|
| Frontend   | Next.js 14, TypeScript, Tailwind   |
| Backend    | NestJS, TypeScript                 |
| Database   | PostgreSQL + Prisma ORM            |
| Auth       | JWT (access + refresh token)       |
| File Store | Local / S3-compatible              |
