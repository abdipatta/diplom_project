import { Column } from "../../utils/types";

type Props<T> = {
  columns: Column<T>[];
  rows: T[];
  getUniqueId: (val: T) => number;
};

export const Table = <T,>({ columns, rows, getUniqueId }: Props<T>) => {
  return (
    <div className="h-[70vh] overflow-hidden overflow-y-auto pr-5">
      <table className="w-full">
        <thead>
          <tr className="text-left border-b border-[#d2d2d2]">
            {columns.map((column) => (
              <th key={column.key} align={column.align} className="">
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr className="text-left" key={getUniqueId(row)}>
              {columns.map((column) => {
                if (column.render) {
                  return (
                    <td
                      className="border-b border-dashed py-2"
                      align={column.align}
                      key={column.key}
                    >
                      {column.render(row)}
                    </td>
                  );
                }
                return (
                  <td
                    align={column.align}
                    className="border-b border-dashed py-2 sm:pr-0 pr-10 sm:min-w-20 w-20 sm:w-auto text-wrap"
                    key={column.key}
                  >
                    {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
                    {/* @ts-expect-error */}
                    {row[column.key]}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
