-- 01-init-tables.sql
CREATE TABLE IF NOT EXISTS public."User" (
    id serial4 NOT NULL,
    "name" text NOT NULL,
    email text NOT NULL,
    "password" text NOT NULL,
    "role" public."Role" NOT NULL,
    "createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) NOT NULL,
    CONSTRAINT "User_pkey" PRIMARY KEY (id),
    CONSTRAINT "User_email_key" UNIQUE (email)
);

CREATE TABLE IF NOT EXISTS public."PdfFile" (
    id serial4 NOT NULL,
    "fileName" text NOT NULL,
    url text NOT NULL,
    public_id text NOT NULL,
    "userId" int4 NOT NULL,
    "assignedToId" int4 NULL,
    "signMarking" jsonb NOT NULL,
    "createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) NOT NULL,
    status public."PdfStatus" DEFAULT 'WAITING_FOR_SIGNER'::"PdfStatus" NOT NULL,
    CONSTRAINT "PdfFile_pkey" PRIMARY KEY (id)
);

ALTER TABLE public."PdfFile" 
    ADD CONSTRAINT IF NOT EXISTS "PdfFile_assignedToId_fkey" 
    FOREIGN KEY ("assignedToId") REFERENCES public."User"(id) ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE public."PdfFile" 
    ADD CONSTRAINT IF NOT EXISTS "PdfFile_userId_fkey" 
    FOREIGN KEY ("userId") REFERENCES public."User"(id) ON DELETE RESTRICT ON UPDATE CASCADE;
