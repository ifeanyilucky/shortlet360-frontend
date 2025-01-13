import React, { useState } from 'react';
import { BiSortAlt2, BiSortDown, BiSortUp } from 'react-icons/bi';
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md';

const DataTable = ({
    data = [],
    columns = [],
    itemsPerPage = 10,
    showPagination = true,
    className = '',
}) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: null });

    // Sorting logic
    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const getSortedData = () => {
        if (!sortConfig.key) return data;

        return [...data].sort((a, b) => {
            if (a[sortConfig.key] < b[sortConfig.key]) {
                return sortConfig.direction === 'asc' ? -1 : 1;
            }
            if (a[sortConfig.key] > b[sortConfig.key]) {
                return sortConfig.direction === 'asc' ? 1 : -1;
            }
            return 0;
        });
    };

    // Pagination logic
    const totalPages = Math.ceil(data.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentData = getSortedData().slice(startIndex, endIndex);

    const getSortIcon = (columnKey) => {
        if (sortConfig.key !== columnKey) return <BiSortAlt2 className="ml-1" />;
        return sortConfig.direction === 'asc' ? (
            <BiSortUp className="ml-1" />
        ) : (
            <BiSortDown className="ml-1" />
        );
    };

    return (
        <div className="w-full">
            <div className="overflow-x-auto">
                <table className={`min-w-full table-auto ${className}`}>
                    <thead className="bg-gray-100">
                        <tr>
                            {columns.map((column) => (
                                <th
                                    key={column.key}
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-200"
                                    onClick={() => handleSort(column.key)}
                                >
                                    <div className="flex items-center">
                                        {column.header}
                                        {column.sortable !== false && getSortIcon(column.key)}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {currentData.map((row, rowIndex) => (
                            <tr
                                key={rowIndex}
                                className="hover:bg-gray-50 transition-colors duration-200"
                            >
                                {columns.map((column) => (
                                    <td
                                        key={column.key}
                                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                                    >
                                        {column.render
                                            ? column.render(row[column.key], row)
                                            : row[column.key]}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showPagination && totalPages > 1 && (
                <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6">
                    <div className="flex items-center">
                        <button
                            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                            disabled={currentPage === 1}
                            className="px-3 py-1 rounded-md mr-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                        >
                            <MdKeyboardArrowLeft className="text-xl" />
                        </button>
                        <span className="text-sm text-gray-700">
                            Page {currentPage} of {totalPages}
                        </span>
                        <button
                            onClick={() =>
                                setCurrentPage(Math.min(totalPages, currentPage + 1))
                            }
                            disabled={currentPage === totalPages}
                            className="px-3 py-1 rounded-md ml-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                        >
                            <MdKeyboardArrowRight className="text-xl" />
                        </button>
                    </div>
                    <div className="text-sm text-gray-500">
                        Showing {startIndex + 1} to {Math.min(endIndex, data.length)} of{' '}
                        {data.length} entries
                    </div>
                </div>
            )}
        </div>
    );
};

export default DataTable;
