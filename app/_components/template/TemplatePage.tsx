"use client";

import { useTemplates } from "@/app/_hooks/useTemplates";
import { PatientTemplate } from "@/app/_types/Template";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { motion } from "framer-motion";
import {
  CopyIcon,
  EyeIcon,
  FileTextIcon,
  PencilIcon,
  PlusIcon,
  SearchIcon,
  TrashIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function TemplatesPage() {
  const router = useRouter();
  const [templateToDelete, setTemplateToDelete] = useState<string | null>(null);

  const {
    templates,
    isLoading,
    searchTerm,
    setSearchTerm,
    createTemplate,
    updateTemplate,
    deleteTemplate,
  } = useTemplates();

  const handleCreateTemplate = () => {
    router.push("/templates/new");
  };

  const handleEditTemplate = (id: string) => {
    router.push(`/templates/${id}`);
  };

  const handleViewTemplate = (id: string) => {
    router.push(`/templates/${id}?view=true`);
  };

  const handleDeleteTemplate = async (id: string) => {
    const result = await deleteTemplate(id);
    if (result.success) {
      setTemplateToDelete(null);
    } else {
      // Handle error - show notification, etc.
      console.error("Failed to delete template:", result.error);
    }
  };

  const handleDuplicateTemplate = async (template: PatientTemplate) => {
    // Remove ID and modify name for the duplicate
    const { id, ...templateData } = template;
    const duplicateData = {
      ...templateData,
      name: `${template.name} (Copy)`,
      isDefault: false,
    };

    const result = await createTemplate(
      duplicateData as Partial<PatientTemplate>
    );
    if (!result.success) {
      // Handle error - show notification, etc.
      console.error("Failed to duplicate template:", result.error);
    }
  };

  return (
    <div className="flex items-center justify-center p-4 py-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="z-10 w-full max-w-6xl"
      >
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-green-800 dark:text-green-300">
            Patient Templates
          </h1>
          <p className="text-green-600 dark:text-green-400">
            Create and manage patient assessment templates
          </p>
        </div>

        {/* Search and Action Bar */}
        <div className="mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-1/3">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search templates..."
              className="pl-10 bg-white/80 dark:bg-slate-800/80 border-green-100 dark:border-green-900"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button
            className="w-full md:w-auto bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 text-white transition-all duration-200"
            onClick={handleCreateTemplate}
          >
            <PlusIcon className="mr-2 h-5 w-5" />
            <span>Create New Template</span>
          </Button>
        </div>

        {/* Templates List */}
        <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-green-100 dark:border-green-900 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-green-800 dark:text-green-300">
              Available Templates
            </CardTitle>
            <CardDescription>
              {templates.length} templates available in the system
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-green-600"></div>
              </div>
            ) : templates.length === 0 ? (
              <div className="text-center py-8">
                <FileTextIcon className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                <h3 className="text-lg font-medium text-gray-500">
                  No templates found
                </h3>
                <p className="text-gray-400 mt-1">
                  {searchTerm
                    ? "Try a different search term"
                    : "Create your first template to get started"}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="dark:border-b-gray-700">
                      <TableHead className="w-[250px]">Template Name</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="w-[100px] text-center">
                        Sections
                      </TableHead>
                      <TableHead className="w-[100px] text-center">
                        Status
                      </TableHead>
                      <TableHead className="w-[180px] text-right">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {templates.map((template) => (
                      <TableRow
                        key={template.id}
                        className="dark:border-b-gray-700"
                      >
                        <TableCell className="font-medium">
                          <div className="flex items-center">
                            <span>{template.name}</span>
                            {template.isDefault && (
                              <Badge
                                className="ml-2 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                                variant="outline"
                              >
                                Default
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-600 dark:text-gray-300">
                          {template.description || "No description"}
                        </TableCell>
                        <TableCell className="text-center">
                          {template.sections.length}
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge
                            className={`${
                              template.isPrivate
                                ? "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100"
                                : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
                            }`}
                            variant="outline"
                          >
                            {template.isPrivate ? "Private" : "Public"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 bg-green-50 hover:bg-green-100 dark:bg-slate-700 dark:hover:bg-slate-600 text-green-800 dark:text-green-300"
                              onClick={() => handleViewTemplate(template.id)}
                            >
                              <EyeIcon className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 bg-green-50 hover:bg-green-100 dark:bg-slate-700 dark:hover:bg-slate-600 text-green-800 dark:text-green-300"
                              onClick={() => handleEditTemplate(template.id)}
                            >
                              <PencilIcon className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 bg-green-50 hover:bg-green-100 dark:bg-slate-700 dark:hover:bg-slate-600 text-green-800 dark:text-green-300"
                              onClick={() => handleDuplicateTemplate(template)}
                            >
                              <CopyIcon className="h-4 w-4" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-8 w-8 bg-red-50 hover:bg-red-100 dark:bg-red-900/30 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400"
                                  onClick={() =>
                                    setTemplateToDelete(template.id)
                                  }
                                >
                                  <TrashIcon className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent className="bg-white dark:bg-slate-800 border-green-100 dark:border-green-900">
                                <AlertDialogHeader>
                                  <AlertDialogTitle className="text-green-800 dark:text-green-300">
                                    Delete Template
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete the template
                                    "{template.name}"? This action cannot be
                                    undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel className="bg-gray-100 hover:bg-gray-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-gray-800 dark:text-gray-200">
                                    Cancel
                                  </AlertDialogCancel>
                                  <AlertDialogAction
                                    className="bg-red-600 hover:bg-red-700 text-white"
                                    onClick={() =>
                                      handleDeleteTemplate(template.id)
                                    }
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
