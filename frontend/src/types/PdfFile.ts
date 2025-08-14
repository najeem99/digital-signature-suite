export interface PdfFile {
    id: number;
    fileName: string;
    url: string;
    public_id: string;
    status: string;
    createdAt: string;
    user: { id: number; name: string };
    assignedTo: { id: number; name: string } | null;
}
