/**
 * Annotation table component with search and lazy loading
 */

import { useState, useRef, useEffect, useMemo } from "react";
import { Annotation } from "@/types/annotations";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SearchBar } from "@/components/shared";
import { AnnotationTableRow } from "./annotation-table-row";
import { filterAnnotations } from "@/lib/utils/annotations";


import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AnnotationTableProps {
  annotations: Annotation[];
  onEdit: (annotation: Annotation) => void;
  initialVisibleCount?: number;
}

export function AnnotationTable({
  annotations: allAnnotations,
  onEdit,
  initialVisibleCount = 5,
}: AnnotationTableProps) {
  // ... (state and effects same as before)
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(initialVisibleCount);
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const tableRef = useRef<HTMLDivElement>(null);

  // Lazy load initial annotations when component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnnotations(allAnnotations.slice(0, visibleCount));
    }, 300);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Load more when scrolling near bottom
  useEffect(() => {
    const handleScroll = () => {
      if (!tableRef.current) return;
      const { scrollTop, scrollHeight, clientHeight } = tableRef.current;
      // Load more when 80% scrolled
      if (
        scrollTop + clientHeight >= scrollHeight * 0.8 &&
        annotations.length < allAnnotations.length
      ) {
        const newCount = Math.min(visibleCount + 5, allAnnotations.length);
        setVisibleCount(newCount);
        setAnnotations(allAnnotations.slice(0, newCount));
      }
    };

    const tableElement = tableRef.current;
    if (tableElement) {
      tableElement.addEventListener("scroll", handleScroll);
      return () => tableElement.removeEventListener("scroll", handleScroll);
    }
  }, [annotations.length, visibleCount, allAnnotations]);

  // Filter annotations based on search query
  const filteredAnnotations = useMemo(() => {
    return filterAnnotations(annotations, searchQuery);
  }, [annotations, searchQuery]);

  return (
    <Card className="flex flex-col h-full border-zinc-800 bg-zinc-900/50 backdrop-blur-xl">
      <CardHeader>
        <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-bold">Annotation History</CardTitle>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 overflow-hidden flex flex-col">
        {/* Search Bar */}
        <SearchBar
          placeholder="Search annotations..."
          value={searchQuery}
          onChange={setSearchQuery}
          className="mb-6"
        />

        {/* Table */}
        <div
            ref={tableRef}
            className="flex-1 overflow-y-auto rounded-lg border border-zinc-800"
        >
            <Table>
            <TableHeader>
                <TableRow className="border-zinc-800 bg-zinc-900/50 sticky top-0 z-10 hover:bg-zinc-900/50">
                <TableHead className="w-[100px]">Meme</TableHead>
                <TableHead>Explanation</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[100px]">Action</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {filteredAnnotations.length === 0 ? (
                <TableRow>
                    <TableCell
                    colSpan={4}
                    className="text-center text-muted-foreground h-24"
                    >
                    No annotations found
                    </TableCell>
                </TableRow>
                ) : (
                filteredAnnotations.map((annotation) => (
                    <AnnotationTableRow
                    key={annotation.id}
                    annotation={annotation}
                    onEdit={onEdit}
                    />
                ))
                )}
            </TableBody>
            </Table>
        </div>
      </CardContent>
    </Card>
  );
}



















