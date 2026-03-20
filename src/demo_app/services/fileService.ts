const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

type S3Folder = 'profile-pictures' | 'documents' | 'project-files' | 'csv-imports' | 'attachments';

interface UploadResponse {
    success: boolean;
    message: string;
    data?: {
        url: string;
        displayUrl?: string;
        key: string;
    };
}

interface PresignedUrlResponse {
    success: boolean;
    message?: string;
    data?: {
        url: string;
    };
}

/**
 * Upload a file to S3 via backend API
 * @param file - File to upload
 * @param folder - Folder path (profile-pictures, documents, project-files, csv-imports, attachments)
 * @returns Promise with upload result containing URL
 */
export async function uploadFile(
    file: File,
    folder: S3Folder
): Promise<{ url: string; displayUrl?: string; key: string }> {
    const token = localStorage.getItem('token');

    if (!token) {
        throw new Error('Authentication required');
    }

    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(
        `${BACKEND_URL}/file/upload?folder=${encodeURIComponent(folder)}`,
        {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            body: formData,
        }
    );

    const result: UploadResponse = await response.json();

    if (!response.ok || !result.success) {
        throw new Error(result.message || 'Failed to upload file');
    }

    return result.data!;
}

/**
 * Upload a profile image (convenience wrapper)
 * @param file - Image file to upload
 * @returns Promise with the uploaded image URLs (url for storage, displayUrl for display)
 */
export async function uploadProfileImage(file: File): Promise<{ url: string; displayUrl: string }> {
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
        throw new Error('Only JPEG, PNG, GIF, and WebP images are allowed');
    }

    // Validate file size (5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
        throw new Error('File size must be less than 5MB');
    }

    const result = await uploadFile(file, 'profile-pictures');
    return {
        url: result.url,                          // Raw S3 URL - store in database
        displayUrl: result.displayUrl || result.url // Presigned URL - use for display
    };
}

/**
 * Upload a document file
 * @param file - Document file to upload
 * @returns Promise with the uploaded file URL and key
 */
export async function uploadDocument(file: File): Promise<{ url: string; key: string }> {
    return uploadFile(file, 'documents');
}

/**
 * Upload a project file
 * @param file - Project file to upload
 * @returns Promise with the uploaded file URL and key
 */
export async function uploadProjectFile(file: File): Promise<{ url: string; key: string }> {
    return uploadFile(file, 'project-files');
}

/**
 * Upload a CSV file for import
 * @param file - CSV file to upload
 * @returns Promise with the uploaded file URL and key
 */
export async function uploadCsvFile(file: File): Promise<{ url: string; key: string }> {
    if (!file.name.endsWith('.csv') && file.type !== 'text/csv') {
        throw new Error('Only CSV files are allowed');
    }
    return uploadFile(file, 'csv-imports');
}

/**
 * Upload a general attachment
 * @param file - File to upload
 * @returns Promise with the uploaded file URL and key
 */
export async function uploadAttachment(file: File): Promise<{ url: string; key: string }> {
    return uploadFile(file, 'attachments');
}

/**
 * Get presigned URL for a private file
 * @param key - S3 object key
 * @returns Promise with presigned URL
 */
export async function getPresignedUrl(key: string): Promise<string> {
    const token = localStorage.getItem('token');

    if (!token) {
        throw new Error('Authentication required');
    }

    const response = await fetch(
        `${BACKEND_URL}/file/presigned-url?key=${encodeURIComponent(key)}`,
        {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        }
    );

    const result: PresignedUrlResponse = await response.json();

    if (!response.ok || !result.success) {
        throw new Error(result.message || 'Failed to get file URL');
    }

    return result.data!.url;
}

/**
 * Delete a file from S3
 * @param key - S3 object key
 */
export async function deleteFile(key: string): Promise<void> {
    const token = localStorage.getItem('token');

    if (!token) {
        throw new Error('Authentication required');
    }

    const response = await fetch(
        `${BACKEND_URL}/file/delete`,
        {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ key }),
        }
    );

    const result = await response.json();

    if (!response.ok || !result.success) {
        throw new Error(result.message || 'Failed to delete file');
    }
}
