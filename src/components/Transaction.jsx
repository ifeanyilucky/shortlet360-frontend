import Table from "./Table";

const columns = [
  {
    name: "Transaction ID",
    accessor: "_id",
  },
  {
    name: "Amount",
    accessor: "amount",
  },
  {
    name: "Status",
    accessor: "status",
  },
  // {
  //   name: "Action",
  //   accessor: "action",
  // },
];
export default function Transaction({ transactions }) {
  return (
    <div>
      {/* <div>
        {transactions?.length > 0 ? (
          transactions?.map((transaction) => (
            <div key={transaction.id}>{transaction.amount}</div>
          ))
        ) : (
          <div>No transactions</div>
        )}
      </div> */}
      <Table columns={columns} data={transactions} />
    </div>
  );
}
