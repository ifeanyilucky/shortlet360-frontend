import PropTypes from "prop-types";
import StatusChip from "./StatusChip";
import { fCurrency } from "../utils/formatNumber";

export default function Table({ columns, data }) {
  const renderCell = (column, value) => {
    if (column.accessor === "status") {
      return <StatusChip status={value} />;
    }
    return value;
  };

  return (
    <div>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              {columns?.map((column) => (
                <th key={column.accessor} scope="col" className="px-6 py-3">
                  {column.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data?.map((row, rowIndex) => {
              return (
                <tr
                  key={rowIndex}
                  className="bg-white border-b hover:bg-gray-50"
                >
                  {columns?.map((column) => {
                    if (column.accessor === "action") {
                      return (
                        <td
                          key={`${rowIndex}-${column.accessor}`}
                          className="px-6 py-4"
                        >
                          <a
                            href="#"
                            className="font-medium text-blue-600 hover:underline"
                          >
                            Edit
                          </a>
                        </td>
                      );
                    }
                    if (column.accessor === "amount") {
                      return (
                        <td
                          key={`${rowIndex}-${column.accessor}`}
                          className="px-6 py-4"
                        >
                          {fCurrency(row[column.accessor])}
                        </td>
                      );
                    }
                    return (
                      <td
                        key={`${rowIndex}-${column.accessor}`}
                        className="px-6 py-4"
                      >
                        {renderCell(column, row[column.accessor])}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

Table.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      accessor: PropTypes.string.isRequired,
    })
  ).isRequired,
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
};
