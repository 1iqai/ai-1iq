import { useState } from "react";
import { Undo, Trash2, AlertTriangle } from "lucide-react";
import { toast } from "react-toastify";
import { formatDate } from "../../../utility/dateCalculations";
import { useAuth } from "../../../hooks/useAuth";

export interface Project {
    id: string;
    name: string;
    description: string | null;
    startDate: string;
    endDate: string;
    status: string;
}

interface ArchiveProjectCardProps {
    project: Project;
    refetch: (page: number) => void;
}

const ArchiveProjectCard = ({ project, refetch }: ArchiveProjectCardProps) => {
    const { user } = useAuth();
    const isAdmin = user?.role === "Admin" || user?.role === "Super Admin";

    const [loading, setLoading] = useState<boolean>(false);
    const [deleting, setDeleting] = useState<boolean>(false);
    const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);

    const token = localStorage.getItem("token");

    const removeFromArchive = async () => {
        setLoading(true);
        try {
            const response = await fetch(
                `${import.meta.env.VITE_BACKEND_URL}/project/${project.id}`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ archived: false }),
                }
            );
            if (!response.ok) {
                throw new Error("Failed to unarchive project");
            }
            toast.success("Project unarchived successfully!");
            refetch(1);
        } catch (error) {
            if(error instanceof Error)
             toast.error(error.message || "Failed to unarchive project");
            console.error("Unarchive error:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteConfirm = async () => {
        setShowDeleteModal(false);
        setDeleting(true);
        try {
            const response = await fetch(
                `${import.meta.env.VITE_BACKEND_URL}/project/${project.id}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            if (!response.ok) {
                throw new Error("Failed to delete project");
            }
            toast.success("Project deleted successfully!");
            refetch(1);
        } catch (error) {
            if(error instanceof Error)
            toast.error(error.message || "Failed to delete project");
            console.error("Delete error:", error);
        } finally {
            setDeleting(false);
        }
    };

    const handleDeleteCancel = () => {
        setShowDeleteModal(false);
    };

    const deleteProject = () => {
        setShowDeleteModal(true);
    };

    return (
        <>
            <div className="w-full bg-bg-secondary-light dark:bg-bg-secondary-dark rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6">
                <div className="flex flex-col h-full space-y-4">
                    <div className="flex-1">
                        <h3 className="text-lg md:text-xl font-semibold text-heading-primary-light dark:text-heading-primary-dark truncate mb-2">
                        {project.name}
                        </h3>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm text-txt-secondary-light dark:text-txt-secondary-dark">
                        <div className="space-y-1">
                            <p className="font-medium">Start Date</p>
                            <p>{formatDate(project.startDate)}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="font-medium">End Date</p>
                            <p>{formatDate(project.endDate)}</p>
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row gap-3">
                        {/* Unarchive Button */}
                        <button
                            onClick={removeFromArchive}
                            disabled={loading}
                            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${loading ? "bg-gray-300 dark:bg-gray-600 cursor-not-allowed" : "bg-brand-primary-500 text-white hover:bg-brand-primary-600 hover:scale-[1.02]"}`}
                            aria-label={`Unarchive project ${project.name}`}
                        >
                            <Undo className="w-4 h-4" />
                            {loading ? "Unarchiving..." : "Unarchive"}
                        </button>
                        {/* Delete Button - Admin Only */}
                        {isAdmin && (
                            <button
                                onClick={deleteProject}
                                disabled={deleting}
                                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${deleting ? "bg-gray-300 dark:bg-gray-600 cursor-not-allowed" : "bg-red-500 text-white hover:bg-red-600 hover:scale-[1.02]"}`}
                                aria-label={`Delete project ${project.name}`}
                            >
                                <Trash2 className="w-4 h-4" />
                                {deleting ? "Deleting..." : "Delete"}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        
            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 ">
                    <div className="bg-bg-secondary-light dark:bg-bg-secondary-dark rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex items-center justify-center mb-4">
                                <div className="bg-red-100 dark:bg-red-900/20 p-3 rounded-full">
                                    <AlertTriangle className="w-6 h-6 text-red-500 dark:text-red-400" />
                                </div>
                            </div>
                            <h3 className="text-lg font-semibold text-heading-primary-light dark:text-heading-primary-dark text-center mb-2">
                                Delete Project?
                            </h3>
                            <p className="text-sm text-txt-secondary-light dark:text-txt-secondary-dark text-center mb-6">
                                Are you sure you want to delete <strong>"{project.name}"</strong>? This action cannot be undone.
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={handleDeleteCancel}
                                    className="flex-1 px-4 py-2 rounded-lg text-sm font-medium bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDeleteConfirm}
                                    disabled={deleting}
                                    className="flex-1 px-4 py-2 rounded-lg text-sm font-medium bg-red-500 text-white hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                                >
                                    {deleting ? "Deleting..." : "Delete"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>


    );
};

export default ArchiveProjectCard;